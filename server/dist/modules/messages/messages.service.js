"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const private_messages_entity_1 = require("./entities/private-messages.entity");
const group_messages_entity_1 = require("./entities/group-messages.entity");
const users_entity_1 = require("../users/users.entity");
const groups_entity_1 = require("../groups/groups.entity");
let MessagesService = class MessagesService {
    constructor(privateMessageRepository, groupMessageRepository, userRepository, groupRepository) {
        this.privateMessageRepository = privateMessageRepository;
        this.groupMessageRepository = groupMessageRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
    }
    async createPrivateMessage(message) {
        const recipient = await this.userRepository.findOne({
            where: { name: message.toUserName },
        });
        const sender = await this.userRepository.findOne({
            where: { name: message.fromUserName },
        });
        if (!recipient || !sender) {
            throw new Error("Sender or recipient not found");
        }
        const newMessage = this.privateMessageRepository.create({
            fromUser: sender,
            toUser: recipient,
            text: message.text,
            messageType: message.messageType,
        });
        return this.privateMessageRepository.save(newMessage);
    }
    async createGroupMessage(message) {
        const group = await this.groupRepository.findOne({
            where: { name: message.groupName },
        });
        const sender = await this.userRepository.findOne({
            where: { name: message.fromUserName },
        });
        if (!group || !sender) {
            throw new Error("Group or sender not found");
        }
        const newMessage = this.groupMessageRepository.create({
            fromUser: sender,
            group,
            text: message.text,
            messageType: message.messageType,
        });
        return this.groupMessageRepository.save(newMessage);
    }
    async findAllMessagesForUser(userName, take = 20, skip = 0) {
        const user = await this.userRepository.findOne({
            where: { name: userName },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const privateMessages = await this.privateMessageRepository.find({
            where: [{ fromUser: user }, { toUser: user }],
            order: { createdAt: "DESC" },
            take,
            skip,
        });
        const userGroups = await this.groupRepository
            .createQueryBuilder("group")
            .leftJoin("group.users", "user")
            .where("user.id = :userId", { userId: user.id })
            .getMany();
        const groupIds = userGroups.map((group) => group.id);
        const groupMessages = groupIds.length
            ? await this.groupMessageRepository.find({
                where: { group: (0, typeorm_2.In)(groupIds) },
                order: { createdAt: "DESC" },
                take,
                skip,
            })
            : [];
        return { privateMessages, groupMessages };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(private_messages_entity_1.PrivateMessage)),
    __param(1, (0, typeorm_1.InjectRepository)(group_messages_entity_1.GroupMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(groups_entity_1.Group)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MessagesService);
//# sourceMappingURL=messages.service.js.map