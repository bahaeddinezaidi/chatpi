"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const messages_gateway_1 = require("./gateways/messages/messages.gateway");
const messages_controller_1 = require("./controllers/messages/messages.controller");
const rooms_controller_1 = require("./controllers/rooms/rooms.controller");
const mongoose_1 = require("@nestjs/mongoose");
const message_model_1 = require("./models/message.model");
const room_model_1 = require("./models/room.model");
const user_model_1 = require("./models/user.model");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot('mongodb://127.0.0.1:27017/chat', {}),
            mongoose_1.MongooseModule.forFeature([
                { name: message_model_1.Message.name, schema: message_model_1.MessageSchema },
                { name: room_model_1.Room.name, schema: room_model_1.RoomSchema },
                { name: user_model_1.User.name, schema: user_model_1.UserSchema }
            ]),
        ],
        controllers: [
            app_controller_1.AppController,
            rooms_controller_1.RoomsController,
            messages_controller_1.MessagesController,
        ],
        providers: [app_service_1.AppService, messages_gateway_1.MessagesGateway],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map