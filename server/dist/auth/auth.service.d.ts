import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/modules/users/users.service";
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(name: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
export default AuthService;
