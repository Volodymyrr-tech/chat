import { Group } from "../groups/groups.entity";
import { PrivateMessage } from "../messages/entities/private-messages.entity";
import { GroupMessage } from "../messages/entities/group-messages.entity";
export declare class User {
    id: string;
    name: string;
    groups: Group[];
    sentMessages: PrivateMessage[];
    receivedMessages: PrivateMessage[];
    groupMessages: GroupMessage[];
}
