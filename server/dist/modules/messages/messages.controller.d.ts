import { MessagesService } from "./messages.service";
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getAllMessagesForUser(userName: string, take?: number, skip?: number): Promise<{
        privateMessages: import("./entities/private-messages.entity").PrivateMessage[];
        groupMessages: import("./entities/group-messages.entity").GroupMessage[];
    }>;
}
