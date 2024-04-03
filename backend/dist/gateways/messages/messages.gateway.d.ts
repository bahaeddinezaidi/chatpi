import { OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Message } from '../../models/message.model';
import { User } from '../../models/user.model';
import { Room } from '../../models/room.model';
import { Model } from "mongoose";
import { Server } from "socket.io";
export declare class MessagesGateway implements OnGatewayDisconnect {
    private readonly messagesModel;
    private readonly roomsModel;
    private readonly usersModel;
    constructor(messagesModel: Model<Message>, roomsModel: Model<Room>, usersModel: Model<User>);
    server: Server;
    handleDisconnect(client: Socket): Promise<void>;
    enterChatRoom(client: Socket, data: {
        nickname: string;
        roomId: string;
    }): Promise<void>;
    leaveChatRoom(client: Socket, data: {
        nickname: string;
        roomId: string;
    }): Promise<void>;
    handleTyping(client: Socket, data: {
        nickname: string;
        roomId: string;
        isTyping: boolean;
    }): Promise<void>;
    addMessage(client: Socket, message: Message): Promise<void>;
}
