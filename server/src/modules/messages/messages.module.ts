import { ChatGateway } from "./chat-gateway";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessagesService } from "./messages.service";
import { PrivateMessage } from "./entities/private-messages.entity";
import { GroupMessage } from "./entities/group-messages.entity";
import { UsersModule } from "../users/users.module";
import { GroupsModule } from "../groups/groups.module";
import { JwtModule } from "@nestjs/jwt"; // Import JwtModule
import { MessagesController } from "./messages.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([PrivateMessage, GroupMessage]),
    UsersModule,
    GroupsModule,
    JwtModule.register({
      secret: "your_jwt_secret_key",
      signOptions: { expiresIn: "6h" },
    }),
  ],
  controllers: [MessagesController],
  providers: [ChatGateway, MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
