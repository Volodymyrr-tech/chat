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
exports.PrivateMessage = void 0;
const users_entity_1 = require("../../users/users.entity");
const typeorm_1 = require("typeorm");
let PrivateMessage = class PrivateMessage {
};
exports.PrivateMessage = PrivateMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], PrivateMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.sentMessages),
    __metadata("design:type", users_entity_1.User)
], PrivateMessage.prototype, "fromUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.receivedMessages),
    __metadata("design:type", users_entity_1.User)
], PrivateMessage.prototype, "toUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["text", "media"], default: "text" }),
    __metadata("design:type", String)
], PrivateMessage.prototype, "messageType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PrivateMessage.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bytea", nullable: true }),
    __metadata("design:type", Buffer)
], PrivateMessage.prototype, "media", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PrivateMessage.prototype, "createdAt", void 0);
exports.PrivateMessage = PrivateMessage = __decorate([
    (0, typeorm_1.Entity)("private_messages")
], PrivateMessage);
//# sourceMappingURL=private-messages.entity.js.map