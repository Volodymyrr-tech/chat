import { GroupsService } from "./groups.service";
export declare class GroupsController {
    private readonly groupsService;
    constructor(groupsService: GroupsService);
    createGroup(body: {
        name: string;
        userIds: string[];
    }): Promise<import("./groups.entity").Group>;
    addUsersToGroup(groupId: string, body: {
        userIds: string[];
    }): Promise<import("./groups.entity").Group>;
    getGroupById(groupId: string): Promise<import("./groups.entity").Group>;
    getAllGroups(): Promise<import("./groups.entity").Group[]>;
    joinOrCreateGroup(body: {
        name: string;
        userIds: string[];
    }): Promise<import("./groups.entity").Group>;
}
