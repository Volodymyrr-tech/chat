import { Repository } from "typeorm";
import { User } from "./users.entity";
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findUserByName(name: string): Promise<User>;
    findUserById(id: string): Promise<User>;
    createUser(name: string): Promise<User>;
}
