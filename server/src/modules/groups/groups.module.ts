import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm"; // Import TypeOrmModule
import { Group } from "./groups.entity"; // Import Group entity
import { GroupsService } from "./groups.service";
import { User } from "../users/users.entity";
import { GroupsController } from "./groups.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Group, User])], // Register Group entity
  providers: [GroupsService],
  controllers: [GroupsController],
  exports: [GroupsService, TypeOrmModule], // Export TypeOrmModule and GroupsService
})
export class GroupsModule {}
