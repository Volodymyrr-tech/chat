import { User } from "src/modules/users/users.entity";
export declare class PrivateMessage {
    id: string;
    fromUser: User;
    toUser: User;
    messageType: string;
    text: string;
    media: Buffer;
    createdAt: Date;
}
