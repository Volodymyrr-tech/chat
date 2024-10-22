import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/ormconfig";
import { UsersModule } from "./modules/users/users.module";
import { GroupsModule } from "./modules/groups/groups.module";
import { MessagesModule } from "./modules/messages/messages.module";
import { AuthModule } from "./auth/auth.module";
// import { ChatGateway2 } from "./modules/chat/chat.gateway";
// import { MessageModule2 } from "./modules/chat/chat.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    GroupsModule,
    MessagesModule,
    AuthModule,
    // MessageModule2,
  ],
  // providers: [ChatGateway2],
})
export class AppModule {}
