"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const messages_service_1 = require("./messages.service");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
let ChatGateway = class ChatGateway {
    constructor(messagesService, jwtService) {
        this.messagesService = messagesService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger("ChatGateway");
    }
    afterInit(server) {
        this.logger.log("WebSocket Gateway Initialized");
        this.server = server;
    }
    async handleConnection(client) {
        try {
            this.logger.log(`Client attempting to connect: ${client.id}`);
            const token = client.handshake.auth.token;
            if (!token) {
                this.logger.error(`No token provided for client ${client.id}`);
                client.disconnect();
                return;
            }
            try {
                const decoded = this.jwtService.verify(token);
                this.logger.log(`Token verified for user: ${JSON.stringify(decoded)}`);
                client.data.user = decoded;
                client.join(decoded.name);
                client.emit("connectionEstablished", {
                    userId: decoded.name,
                    message: "Successfully connected to chat server",
                });
                this.server.emit("userConnected", { user: decoded.name });
                this.logger.log(`Client connected: ${client.id}`);
            }
            catch (err) {
                this.logger.error(`Token verification failed: ${err.message}`);
                client.disconnect();
            }
        }
        catch (err) {
            this.logger.error(`Connection error: ${err.message}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        try {
            const user = client.data.user;
            if (user) {
                this.logger.log(`Client disconnected: ${client.id} (${user.name})`);
                this.server.emit("userDisconnected", { userId: user.name });
            }
            else {
                this.logger.log(`Client disconnected: ${client.id} (unknown user)`);
            }
        }
        catch (err) {
            this.logger.error(`Disconnect error: ${err.message}`);
        }
    }
    async handlePrivateMessage(client, message) {
        try {
            const user = client.data.user;
            if (!user) {
                this.logger.error("No user data found for message sender");
                return;
            }
            this.logger.log(`Processing private message from ${user.name} to ${message.toUserName}`);
            this.server.to(message.toUserName).emit("privateMessage", {
                from: user.name,
                text: message.text,
            });
            await this.messagesService.createPrivateMessage({
                fromUserName: user.name,
                toUserName: message.toUserName,
                text: message.text,
                messageType: "text",
            });
            this.logger.log("Private message processed successfully");
        }
        catch (error) {
            this.logger.error(`Error handling private message: ${error.message}`);
            client.emit("messageError", { error: "Failed to send message" });
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("privateMessage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handlePrivateMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true,
        },
        transports: ["websocket"],
        path: "/socket.io/",
    }),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        jwt_1.JwtService])
], ChatGateway);
//# sourceMappingURL=chat-gateway.js.map