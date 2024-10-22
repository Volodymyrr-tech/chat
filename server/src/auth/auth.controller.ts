import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body("name") name: string) {
    try {
      const user = await this.authService.validateUser(name);
      if (!user) {
        throw new HttpException("Invalid name", HttpStatus.UNAUTHORIZED);
      }
      console.log(`user logged in ${user}`);
      return this.authService.login(user);
    } catch (error) {
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
