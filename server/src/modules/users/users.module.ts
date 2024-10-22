import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm"; // Import TypeOrmModule
import { UsersService } from "./users.service";
import { User } from "./users.entity"; // Import User entity
import { UsersController } from "./users.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register User entity in TypeOrmModule
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule], // Export TypeOrmModule so UserRepository is available
})
export class UsersModule {}
