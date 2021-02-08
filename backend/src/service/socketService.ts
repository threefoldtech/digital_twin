import {getChatById, persistMessage} from './chatService';
import {Socket} from "socket.io";
import Connections from "../models/connections";
import Message from "../models/message";
import {contacts} from "../store/contacts";
import {connections} from "../store/connections";
import * as http from "http";
import {editMessage, handleRead, parseMessage} from "./messageService";
import {MessageBodyTypeInterface, MessageOperations, MessageTypes} from "../types";
import {saveFile, saveAvatar, deleteChat} from "./dataService"
import {getLocationForId, sendMessageToApi} from './apiService';
import {user} from "../store/user"


const socketio = require("socket.io");

export let io: Socket;

export const startSocketIo = (httpServer: http.Server) => {
    io = socketio(httpServer, {
        cors: {
            origin: '*',
        }
    });


    io.on("connection", (socket: Socket) => {
        console.log(`${socket.id} connected`);
        connections.add(socket.id);

        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected`);
            connections.delete(socket.id);
        });

        socket.on("message", (messageData) => {
            console.log('new message')

            const newMessage: Message<MessageBodyTypeInterface> = parseMessage(messageData.message)

            const chat = getChatById(newMessage.to)

            console.log(`internal send message to  ${chat.adminId}`)
            // sendMessage(chat.adminId, newMessage);

            // @todo refactor this
            connections.getConnections().forEach((connection: string) => {
                // if (connection == socket.id) {
                //     // this is me
                //     return
                // }

                io.to(connection).emit("message", newMessage);
                console.log(`send message to socket ${connection}`);
            });
            let location = getLocationForId(<string>chat.adminId);

            if (newMessage.type === MessageTypes.READ) {
                handleRead(<Message<string>>newMessage);
                sendMessageToApi(location, newMessage, MessageOperations.NEW)
                return;
            }

            persistMessage(chat.chatId, newMessage);
            sendMessageToApi(location, newMessage, MessageOperations.NEW)
        });

        socket.on('slice upload', (data) => {
            console.log(data)
            var file: any = {
                name: data.file.name,
                type: data.file.type,
                data: data.file.data,
                size: data.file.size
            }
            console.log(file)
            saveFile(data.chatId, file.name, file.data)
        });

        socket.on("update_message", (messageData) => {
            console.log("updatemsgdata", messageData)
            const newMessage: Message<MessageBodyTypeInterface> = parseMessage(messageData.message)
            editMessage(messageData.chatId, newMessage)
            let location1 = getLocationForId(<string>newMessage.to);
            sendMessageToApi(location1, newMessage, MessageOperations.UPDATE)
        })
        socket.on('new_avatar', (data) => {
            console.log(data)
            const url = data.url
            const avatar = data.avatar
            saveAvatar(avatar)
            user.updateAvatar(url)
        });
        socket.on('remove_chat', (id) => {
            const success = deleteChat(id);
            if (!success) {
                return;
            }
            sendEventToConnectedSockets('chat_removed', id)

        });

    });
}

export const sendEventToConnectedSockets = (event: string, body: any) => {
    connections.getConnections().forEach((connection: string) => {
        io.to(connection).emit(event, body);
        console.log(`send message to ${connection}`);
    });
}
