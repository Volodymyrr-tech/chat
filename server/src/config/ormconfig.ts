import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { PrivateMessage } from "../modules/messages/entities/private-messages.entity";
import { GroupMessage } from "../modules/messages/entities/group-messages.entity";
import { User } from "src/modules/users/users.entity";
import { Group } from "src/modules/groups/groups.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "password",
  database: process.env.POSTGRES_DB || "chat",
  entities: [User, Group, PrivateMessage, GroupMessage],
  synchronize: true, // Set to false in production
  autoLoadEntities: true,
};
