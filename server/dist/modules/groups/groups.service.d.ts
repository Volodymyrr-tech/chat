import { Repository } from "typeorm";
import { Group } from "./groups.entity";
import { User } from "../users/users.entity";
export declare class GroupsService {
    private readonly groupRepository;
    private readonly userRepository;
    constructor(groupRepository: Repository<Group>, userRepository: Repository<User>);
    createGroup(name: string, userIds: string[]): Promise<Group>;
    addUsersToGroup(groupId: string, userIds: string[]): Promise<Group>;
    findGroupByName(name: string): Promise<Group>;
    getGroupById(groupId: string): Promise<Group>;
    getAllGroups(): Promise<Group[]>;
}
