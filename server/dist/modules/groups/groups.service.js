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
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const groups_entity_1 = require("./groups.entity");
const users_entity_1 = require("../users/users.entity");
let GroupsService = class GroupsService {
    constructor(groupRepository, userRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }
    async createGroup(name, userIds) {
        const users = await Promise.all(userIds.map((id) => this.userRepository.findOne({ where: { id } })));
        const group = this.groupRepository.create({ name, users });
        return this.groupRepository.save(group);
    }
    async addUsersToGroup(groupId, userIds) {
        const group = await this.groupRepository.findOne({
            where: { id: groupId },
            relations: ["users"],
        });
        const newUsers = await Promise.all(userIds.map((id) => this.userRepository.findOne({ where: { id } })));
        group.users.push(...newUsers);
        return this.groupRepository.save(group);
    }
    async findGroupByName(name) {
        return this.groupRepository.findOne({
            where: { name },
            relations: ["users"],
        });
    }
    async getGroupById(groupId) {
        return this.groupRepository.findOne({
            where: { id: groupId },
            relations: ["users", "messages"],
        });
    }
    async getAllGroups() {
        return this.groupRepository.find({ relations: ["users"] });
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(groups_entity_1.Group)),
    __param(1, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], GroupsService);
//# sourceMappingURL=groups.service.js.map