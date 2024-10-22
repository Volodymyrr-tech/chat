import { IPrivateMessage } from "./dto/private-message.interface";
import { IGroupMessage } from "./dto/group-message.interface";
import { Repository } from "typeorm";
import { PrivateMessage } from "./entities/private-messages.entity";
import { GroupMessage } from "./entities/group-messages.entity";
import { User } from "src/modules/users/users.entity";
import { Group } from "src/modules/groups/groups.entity";
export declare class MessagesService {
    private readonly privateMessageRepository;
    private readonly groupMessageRepository;
    private readonly userRepository;
    private readonly groupRepository;
    constructor(privateMessageRepository: Repository<PrivateMessage>, groupMessageRepository: Repository<GroupMessage>, userRepository: Repository<User>, groupRepository: Repository<Group>);
    createPrivateMessage(message: IPrivateMessage): Promise<PrivateMessage>;
    createGroupMessage(message: IGroupMessage): Promise<GroupMessage>;
    findAllMessagesForUser(userName: string, take?: number, skip?: number): Promise<{
        privateMessages: PrivateMessage[];
        groupMessages: GroupMessage[];
    }>;
}
