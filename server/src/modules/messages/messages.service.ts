// import { Injectable } from "@nestjs/common";
// import { IPrivateMessage } from "./dto/private-message.interface";
// import { IGroupMessage } from "./dto/group-message.interface";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository, In } from "typeorm";
// import { PrivateMessage } from "./entities/private-messages.entity";
// import { GroupMessage } from "./entities/group-messages.entity";
// import { User } from "src/modules/users/users.entity";
// import { Group } from "src/modules/groups/groups.entity";

// @Injectable()
// export class MessagesService {
//   constructor(
//     @InjectRepository(PrivateMessage)
//     private readonly privateMessageRepository: Repository<PrivateMessage>,
//     @InjectRepository(GroupMessage)
//     private readonly groupMessageRepository: Repository<GroupMessage>,
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//     @InjectRepository(Group)
//     private readonly groupRepository: Repository<Group>
//   ) {}

//   async createPrivateMessage(
//     message: IPrivateMessage
//   ): Promise<PrivateMessage> {
//     const sender = await this.userRepository.findOne({
//       where: { name: message.fromUserName },
//     });
//     const recipient = await this.userRepository.findOne({
//       where: { name: message.toUserName },
//     });

//     if (!sender || !recipient) {
//       throw new Error("User not found");
//     }

//     const newMessage = this.privateMessageRepository.create({
//       ...message,
//       fromUser: sender,
//       toUser: recipient,
//     });
//     return this.privateMessageRepository.save(newMessage);
//   }

//   async createGroupMessage(message: IGroupMessage): Promise<GroupMessage> {
//     const sender = await this.userRepository.findOne({
//       where: { name: message.fromUserName },
//     });
//     const group = await this.groupRepository.findOne({
//       where: { name: message.groupName },
//     });

//     if (!sender || !group) {
//       throw new Error("User or group not found");
//     }

//     const newMessage = this.groupMessageRepository.create({
//       ...message,
//       fromUser: sender,
//       group,
//     });
//     return this.groupMessageRepository.save(newMessage);
//   }

//   async findAllMessagesForUser(
//     userName: string,
//     take: number = 20,
//     skip: number = 0
//   ): Promise<{
//     privateMessages: PrivateMessage[];
//     groupMessages: GroupMessage[];
//   }> {
//     const user = await this.userRepository.findOne({
//       where: { name: userName },
//     });
//     if (!user) {
//       throw new Error("User not found");
//     }

//     const privateMessages = await this.privateMessageRepository.find({
//       where: [{ fromUser: user }, { toUser: user }],
//       order: { createdAt: "DESC" },
//       take,
//       skip,
//     });

//     const userGroups = await this.groupRepository
//       .createQueryBuilder("group")
//       .leftJoinAndSelect("group.users", "user")
//       .where("user.name = :userName", { userName })
//       .getMany();
//     const groupIds = userGroups.map((group) => group.id);

//     const groupMessages = groupIds.length
//       ? await this.groupMessageRepository.find({
//           where: { group: In(groupIds) },
//           order: { createdAt: "DESC" },
//           take,
//           skip,
//         })
//       : [];

//     return { privateMessages, groupMessages };
//   }
// }
import { Injectable } from "@nestjs/common";
import { IPrivateMessage } from "./dto/private-message.interface";
import { IGroupMessage } from "./dto/group-message.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { PrivateMessage } from "./entities/private-messages.entity";
import { GroupMessage } from "./entities/group-messages.entity";
import { User } from "src/modules/users/users.entity";
import { Group } from "src/modules/groups/groups.entity";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(PrivateMessage)
    private readonly privateMessageRepository: Repository<PrivateMessage>,
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>
  ) {}

  async createPrivateMessage(
    message: IPrivateMessage
  ): Promise<PrivateMessage> {
    const recipient = await this.userRepository.findOne({
      where: { name: message.toUserName },
    });

    const sender = await this.userRepository.findOne({
      where: { name: message.fromUserName },
    });

    if (!recipient || !sender) {
      throw new Error("Sender or recipient not found");
    }

    const newMessage = this.privateMessageRepository.create({
      fromUser: sender,
      toUser: recipient,
      text: message.text,
      messageType: message.messageType,
    });

    return this.privateMessageRepository.save(newMessage);
  }

  async createGroupMessage(message: IGroupMessage): Promise<GroupMessage> {
    const group = await this.groupRepository.findOne({
      where: { name: message.groupName },
    });
    const sender = await this.userRepository.findOne({
      where: { name: message.fromUserName },
    });
    if (!group || !sender) {
      throw new Error("Group or sender not found");
    }

    const newMessage = this.groupMessageRepository.create({
      fromUser: sender,
      group,
      text: message.text,
      messageType: message.messageType,
    });
    return this.groupMessageRepository.save(newMessage);
  }

  async findAllMessagesForUser(
    userName: string,
    take: number = 20,
    skip: number = 0
  ): Promise<{
    privateMessages: PrivateMessage[];
    groupMessages: GroupMessage[];
  }> {
    const user = await this.userRepository.findOne({
      where: { name: userName },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const privateMessages = await this.privateMessageRepository.find({
      where: [{ fromUser: user }, { toUser: user }],
      order: { createdAt: "DESC" },
      take,
      skip,
    });

    // const userGroups = await this.groupRepository
    //   .createQueryBuilder("group")
    //   .leftJoinAndSelect("group.users", "user")
    //   .where("user.name = :userName", { userName })
    //   .getMany();
    const userGroups = await this.groupRepository
      .createQueryBuilder("group")
      .leftJoin("group.users", "user")
      .where("user.id = :userId", { userId: user.id })
      .getMany();
    const groupIds = userGroups.map((group) => group.id);

    const groupMessages = groupIds.length
      ? await this.groupMessageRepository.find({
          where: { group: In(groupIds) },
          order: { createdAt: "DESC" },
          take,
          skip,
        })
      : [];

    return { privateMessages, groupMessages };
  }

  // async getAllChatsForUser(userName: string): Promise<{
  //   privateChats: { user: User; lastMessage: PrivateMessage }[];
  //   groupChats: { group: Group; lastMessage: GroupMessage }[];
  // }> {
  //   const user = await this.userRepository.findOne({
  //     where: { name: userName },
  //   });
  //   if (!user) {
  //     throw new Error("User not found");
  //   }

  //   // Fetch all private chats (all users the user has messages with)
  //   const privateMessages = await this.privateMessageRepository
  //     .createQueryBuilder("message")
  //     .leftJoinAndSelect("message.fromUser", "fromUser")
  //     .leftJoinAndSelect("message.toUser", "toUser")
  //     .where("message.fromUser.id = :userId OR message.toUser.id = :userId", {
  //       userId: user.id,
  //     })
  //     .orderBy("message.createdAt", "DESC")
  //     .getMany();

  //   const usersWithMessages = new Set();
  //   const privateChats = [];

  //   privateMessages.forEach((message) => {
  //     const otherUser =
  //       message.fromUser.id === user.id ? message.toUser : message.fromUser;
  //     if (!usersWithMessages.has(otherUser.id)) {
  //       usersWithMessages.add(otherUser.id);
  //       privateChats.push({ user: otherUser, lastMessage: message });
  //     }
  //   });

  //   // Fetch all group chats (groups the user is a part of with the latest message)
  //   const userGroups = await this.groupRepository
  //     .createQueryBuilder("group")
  //     .leftJoin("group.users", "user")
  //     .where("user.id = :userId", { userId: user.id })
  //     .getMany();

  //   const groupIds = userGroups.map((group) => group.id);

  //   const groupMessages = groupIds.length
  //     ? await this.groupMessageRepository
  //         .createQueryBuilder("message")
  //         .leftJoinAndSelect("message.group", "group")
  //         .where("message.group.id IN (:...groupIds)", { groupIds })
  //         .orderBy("message.createdAt", "DESC")
  //         .getMany()
  //     : [];

  //   const groupChats = [];
  //   const groupsWithMessages = new Set();

  //   groupMessages.forEach((message) => {
  //     if (!groupsWithMessages.has(message.group.id)) {
  //       groupsWithMessages.add(message.group.id);
  //       groupChats.push({ group: message.group, lastMessage: message });
  //     }
  //   });

  //   return { privateChats, groupChats };
  // }
  // Ensure this service method is implemented correctly
  async getAllChatsForUser(userName: string): Promise<{
    privateChats: { user: User; lastMessage: PrivateMessage }[];
    groupChats: { group: Group; lastMessage: GroupMessage }[];
  }> {
    const user = await this.userRepository.findOne({
      where: { name: userName },
    });
    if (!user) {
      throw new Error("User not found");
    }

    // Fetch private chats
    const privateMessages = await this.privateMessageRepository
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.fromUser", "fromUser")
      .leftJoinAndSelect("message.toUser", "toUser")
      .where("message.fromUser.id = :userId OR message.toUser.id = :userId", {
        userId: user.id,
      })
      .orderBy("message.createdAt", "DESC")
      .getMany();

    // Get users involved in conversations
    const usersWithMessages = new Set();
    const privateChats = [];

    privateMessages.forEach((message) => {
      const otherUser =
        message.fromUser.id === user.id ? message.toUser : message.fromUser;
      if (!usersWithMessages.has(otherUser.id)) {
        usersWithMessages.add(otherUser.id);
        privateChats.push({ user: otherUser, lastMessage: message });
      }
    });

    // Fetch group chats
    const userGroups = await this.groupRepository
      .createQueryBuilder("group")
      .leftJoin("group.users", "user")
      .where("user.id = :userId", { userId: user.id })
      .getMany();

    const groupIds = userGroups.map((group) => group.id);

    const groupMessages = groupIds.length
      ? await this.groupMessageRepository
          .createQueryBuilder("message")
          .leftJoinAndSelect("message.group", "group")
          .where("message.group.id IN (:...groupIds)", { groupIds })
          .orderBy("message.createdAt", "DESC")
          .getMany()
      : [];

    const groupChats = [];
    const groupsWithMessages = new Set();

    groupMessages.forEach((message) => {
      if (!groupsWithMessages.has(message.group.id)) {
        groupsWithMessages.add(message.group.id);
        groupChats.push({ group: message.group, lastMessage: message });
      }
    });

    return { privateChats, groupChats };
  }

  async getPrivateMessages(
    currentUserName: string,
    otherUserName: string,
    take: number = 20,
    skip: number = 0
  ): Promise<PrivateMessage[]> {
    const currentUser = await this.userRepository.findOne({
      where: { name: currentUserName },
    });
    const otherUser = await this.userRepository.findOne({
      where: { name: otherUserName },
    });

    if (!currentUser || !otherUser) {
      throw new Error("User not found");
    }

    return await this.privateMessageRepository.find({
      where: [
        { fromUser: currentUser, toUser: otherUser },
        { fromUser: otherUser, toUser: currentUser },
      ],
      order: { createdAt: "DESC" },
      take,
      skip,
    });
  }

  async getGroupMessages(
    groupName: string,
    take: number = 20,
    skip: number = 0
  ): Promise<GroupMessage[]> {
    return await this.groupMessageRepository.find({
      where: { group: { name: groupName } },
      order: { createdAt: "DESC" },
      take,
      skip,
    });
  }
}
