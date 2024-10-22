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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMessage = void 0;
const groups_entity_1 = require("../../groups/groups.entity");
const users_entity_1 = require("../../users/users.entity");
const typeorm_1 = require("typeorm");
let GroupMessage = class GroupMessage {
};
exports.GroupMessage = GroupMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], GroupMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.groupMessages),
    __metadata("design:type", users_entity_1.User)
], GroupMessage.prototype, "fromUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => groups_entity_1.Group, (group) => group.messages),
    __metadata("design:type", groups_entity_1.Group)
], GroupMessage.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["text", "media"], default: "text" }),
    __metadata("design:type", String)
], GroupMessage.prototype, "messageType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GroupMessage.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bytea", nullable: true }),
    __metadata("design:type", Buffer)
], GroupMessage.prototype, "media", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GroupMessage.prototype, "createdAt", void 0);
exports.GroupMessage = GroupMessage = __decorate([
    (0, typeorm_1.Entity)("group_messages")
], GroupMessage);
//# sourceMappingURL=group-messages.entity.js.map