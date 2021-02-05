import {sendMessage, getChatById} from './chatService';
import {Socket} from "socket.io";
import Connections from "../models/connections";
import Message from "../models/message";
import {contacts} from "../store/contacts";
import {user} from "../store/user"
import axios from "axios";
import {connections} from "../store/connections";
import * as http from "http";
import {parseMessage} from "./messageService";
import {MessageBodyTypeInterface, MessageOperations} from "../types";
import {saveFile} from "./dataService"
import {editMessage} from "./messageService"
import {getLocationForId, sendMessageToApi} from './apiService';
import {config} from "../config/config";

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
            console.log(contacts)
            let location1 = getLocationForId(<string>newMessage.to);
            sendMessageToApi(location1, newMessage, MessageOperations.UPDATE)
        })

    });
}

export const sendEventToConnectedSockets = (connections: Connections, event: string, body: any) => {
    connections.getConnections().forEach((connection: string) => {
        io.to(connection).emit(event, body);
        console.log(`send message to ${connection}`);
    });
}
