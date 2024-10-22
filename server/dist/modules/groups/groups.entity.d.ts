import { GroupMessage } from "../messages/entities/group-messages.entity";
import { User } from "../users/users.entity";
export declare class Group {
    id: string;
    name: string;
    users: User[];
    messages: GroupMessage[];
}
