import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    searchUserByName(name: string): Promise<import("./users.entity").User>;
}
