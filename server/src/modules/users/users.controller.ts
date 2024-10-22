import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("search")
  async searchUserByName(@Query("name") name: string) {
    if (!name) {
      throw new Error("Name parameter is required");
    }

    const user = await this.usersService.findUserByName(name);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
