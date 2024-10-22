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
exports.ChatGateway2 = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let ChatGateway2 = class ChatGateway2 {
    constructor() {
        this.logger = new common_1.Logger("ChatGateway");
    }
    afterInit(server) {
        this.logger.log("WebSocket Gateway Initialized");
        this.logger.log(`Server instance: ${!!server}`);
    }
    handleConnection(client, ...args) {
        this.logger.log(`Client attempting to connect: ${client.id}`);
        this.logger.log(`Connection args: ${JSON.stringify(args)}`);
        client.emit("connection", "Successfully connected to server");
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleEvent(data, client) {
        this.logger.log(`Received event from ${client.id}: ${data}`);
        return data;
    }
};
exports.ChatGateway2 = ChatGateway2;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway2.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("events"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", String)
], ChatGateway2.prototype, "handleEvent", null);
exports.ChatGateway2 = ChatGateway2 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: true,
        transports: ["websocket"],
        path: "/socket.io/",
    })
], ChatGateway2);
//# sourceMappingURL=chat.gateway.js.map