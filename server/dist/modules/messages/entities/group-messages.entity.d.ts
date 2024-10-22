import { Group } from "src/modules/groups/groups.entity";
import { User } from "src/modules/users/users.entity";
export declare class GroupMessage {
    id: string;
    fromUser: User;
    group: Group;
    messageType: string;
    text: string;
    media: Buffer;
    createdAt: Date;
}
