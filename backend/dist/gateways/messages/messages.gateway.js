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
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const message_model_1 = require("../../models/message.model");
const user_model_1 = require("../../models/user.model");
const room_model_1 = require("../../models/room.model");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const socket_io_2 = require("socket.io");
let MessagesGateway = class MessagesGateway {
    constructor(messagesModel, roomsModel, usersModel) {
        this.messagesModel = messagesModel;
        this.roomsModel = roomsModel;
        this.usersModel = usersModel;
    }
    async handleDisconnect(client) {
        const user = await this.usersModel.findOne({ clientId: client.id });
        if (user) {
            this.server.emit('users-changed', { user: user.nickname, event: 'left' });
            user.clientId = null;
            await this.usersModel.findByIdAndUpdate(user._id, user);
        }
    }
    async enterChatRoom(client, data) {
        let user = await this.usersModel.findOne({ nickname: data.nickname });
        if (!user) {
            user = await this.usersModel.create({ nickname: data.nickname, clientId: client.id });
        }
        else {
            user.clientId = client.id;
            user = await this.usersModel.findByIdAndUpdate(user._id, user, { new: true });
        }
        client.join(data.roomId);
        client.broadcast.to(data.roomId)
            .emit('users-changed', { user: user.nickname, event: 'joined' });
    }
    async leaveChatRoom(client, data) {
        const user = await this.usersModel.findOne({ nickname: data.nickname });
        client.broadcast.to(data.roomId).emit('users-changed', { user: user.nickname, event: 'left' });
        client.leave(data.roomId);
    }
    async handleTyping(client, data) {
        client.broadcast.to(data.roomId).emit('typing', { nickname: data.nickname, isTyping: data.isTyping });
    }
    async addMessage(client, message) {
        message.owner = await this.usersModel.findOne({ clientId: client.id });
        message.created = new Date();
        message = await this.messagesModel.create(message);
        this.server.in(message.room).emit('message', message);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_2.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('enter-chat-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "enterChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-chat-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "leaveChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('add-message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, message_model_1.Message]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "addMessage", null);
MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __param(0, (0, mongoose_1.InjectModel)(message_model_1.Message.name)),
    __param(1, (0, mongoose_1.InjectModel)(room_model_1.Room.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], MessagesGateway);
exports.MessagesGateway = MessagesGateway;
//# sourceMappingURL=messages.gateway.js.map