import { Controller, Get, Param, UseGuards, Query } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("messages")
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Endpoint for fetching all chats of a user
  @Get(":userName/chats")
  async getAllChatsForUser(@Param("userName") userName: string) {
    try {
      const chats = await this.messagesService.getAllChatsForUser(userName);
      return chats;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Endpoint for fetching private messages between two users
  @Get("private/:otherUserName")
  async getPrivateMessages(
    @Param("otherUserName") otherUserName: string,
    @Query("currentUserName") currentUserName: string,
    @Query("take") take: number = 20,
    @Query("skip") skip: number = 0
  ) {
    try {
      const messages = await this.messagesService.getPrivateMessages(
        currentUserName,
        otherUserName,
        take,
        skip
      );
      return messages;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Endpoint for fetching group messages
  @Get("group/:groupName")
  async getGroupMessages(
    @Param("groupName") groupName: string,
    @Query("take") take: number = 20,
    @Query("skip") skip: number = 0
  ) {
    try {
      const messages = await this.messagesService.getGroupMessages(
        groupName,
        take,
        skip
      );
      return messages;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
