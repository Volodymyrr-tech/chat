import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessagesService } from "./messages.service";
import { JwtService } from "@nestjs/jwt";
import { Logger } from "@nestjs/common";
import { GroupsService } from "../groups/groups.service";

@WebSocketGateway({
  cors: {
    origin: "*", // Be more specific in production
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"],
  path: "/socket.io/",
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("ChatGateway");

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
    private readonly groupsService: GroupsService
  ) {}

  afterInit(server: Server) {
    this.logger.log("WebSocket Gateway Initialized");
    this.server = server;
  }

  async handleConnection(client: Socket) {
    try {
      this.logger.log(`Client attempting to connect: ${client.id}`);

      // Get token from handshake auth
      const token = client.handshake.auth.token;

      if (!token) {
        this.logger.error(`No token provided for client ${client.id}`);
        client.disconnect();
        return;
      }

      try {
        const decoded = this.jwtService.verify(token);
        this.logger.log(`Token verified for user: ${JSON.stringify(decoded)}`);

        // Store user data in socket
        client.data.user = decoded;

        // Join a room with their username for private messaging
        client.join(decoded.name);

        // Join all group rooms that the user is part of
        const userGroups = await this.groupsService.getGroupsForUser(
          decoded.id
        );
        userGroups.forEach((group) => {
          client.join(group.name);
          this.logger.log(
            `User ${decoded.name} joined group room: ${group.name}`
          );
        });

        // Emit connection success
        client.emit("connectionEstablished", {
          userId: decoded.name,
          message: "Successfully connected to chat server",
        });

        // Broadcast user connected event
        this.server.emit("userConnected", { user: decoded.name });

        this.logger.log(`Client connected: ${client.id}`);
      } catch (err) {
        this.logger.error(`Token verification failed: ${err.message}`);
        client.disconnect();
      }
    } catch (err) {
      this.logger.error(`Connection error: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    try {
      const user = client.data.user;
      if (user) {
        this.logger.log(`Client disconnected: ${client.id} (${user.name})`);
        this.server.emit("userDisconnected", { userId: user.name });
      } else {
        this.logger.log(`Client disconnected: ${client.id} (unknown user)`);
      }
    } catch (err) {
      this.logger.error(`Disconnect error: ${err.message}`);
    }
  }

  @SubscribeMessage("privateMessage")
  async handlePrivateMessage(
    client: Socket,
    message: { text: string; toUserName: string }
  ) {
    try {
      const user = client.data.user;
      if (!user) {
        this.logger.error("No user data found for message sender");
        return;
      }

      this.logger.log(
        `Processing private message from ${user.name} to ${message.toUserName}`
      );

      // Emit to recipient
      this.server.to(message.toUserName).emit("privateMessage", {
        from: user.name,
        text: message.text,
      });

      // Save to database
      await this.messagesService.createPrivateMessage({
        fromUserName: user.name,
        toUserName: message.toUserName,
        text: message.text,
        messageType: "text",
      });

      this.logger.log("Private message processed successfully");
    } catch (error) {
      this.logger.error(`Error handling private message: ${error.message}`);
      client.emit("messageError", { error: "Failed to send message" });
    }
  }
  @SubscribeMessage("groupMessage")
  async handleGroupMessage(
    client: Socket,
    message: { text: string; groupName: string }
  ) {
    try {
      const user = client.data.user;
      if (!user) {
        this.logger.error("No user data found for message sender");
        return;
      }

      this.logger.log(
        `Processing group message from ${user.name} to group ${message.groupName}`
      );

      // Emit the message to everyone in the group room, including the sender
      this.server.to(message.groupName).emit("groupMessage", {
        from: user.name,
        text: message.text,
        timestamp: new Date().toISOString(),
      });

      // Debug: Log the clients in the room
      const room = this.server.sockets.adapter.rooms.get(message.groupName);
      const clientsInRoom = room ? Array.from(room) : [];
      this.logger.log(
        `Clients in room ${message.groupName}: ${JSON.stringify(clientsInRoom)}`
      );

      // Save to database
      await this.messagesService.createGroupMessage({
        fromUserName: user.name,
        groupName: message.groupName,
        text: message.text,
        messageType: "text",
      });

      this.logger.log("Group message processed successfully");
    } catch (error) {
      this.logger.error(`Error handling group message: ${error.message}`);
      client.emit("messageError", { error: "Failed to send message" });
    }
  }

  @SubscribeMessage("joinGroup")
  async handleJoinGroup(client: Socket, data: { groupName: string }) {
    const user = client.data.user;
    this.logger.log(
      `Client ${client.id} joined rooms: ${Array.from(client.rooms)}`
    );

    if (user) {
      client.join(data.groupName);
      this.logger.log(`User ${user.name} joined group room: ${data.groupName}`);
    } else {
      this.logger.error(
        "No user data found for client attempting to join group"
      );
    }
  }
}
