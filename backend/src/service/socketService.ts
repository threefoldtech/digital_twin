import { sendMessage } from './chatService';
import {Socket} from "socket.io";
import Connections from "../models/connections";
import Message from "../models/message";
import {contacts} from "../store/contacts";
import {chats} from "../store/chats";
import { user } from "../store/user"
import axios from "axios";
import {connections} from "../store/connections";
import * as http from "http";
import {parseMessage} from "./messageService";
import {MessageBodyTypeInterface} from "../types";
import { saveFile } from "./dataService"

const socketio = require("socket.io");

export let io: Socket;

export const startSocketIo = (httpServer: http.Server) => {
    io = socketio(httpServer, { cors: {
          origin: '*',
        }});


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

            console.log(contacts)
            const receiver = contacts.find(c => c.id == newMessage.to);
            if (!receiver) {
                console.log("receiver not found")
                return "receiver not found";
            }

            sendMessage(receiver.id, newMessage);

            // @todo refactor this
            const url = `http://${receiver.location}/api/messages`
            console.log(`sending message ${newMessage.body} to ${url}`);

            connections.getConnections().forEach((connection: string) => {
                if (connection == socket.id) {
                    // this is me
                    return
                }

                io.to(connection).emit("message", newMessage);
                console.log(`send message to ${connection}`);
            });
            try {
                axios.post(url, newMessage)
                    .then(response => {
                        console.log(response.data)
                    })
                    .catch(error => {
                        console.log("couldn't send message")
                    });
            } catch (e) {
                console.log(e)
            }
        });

        socket.on('slice upload', (data) => { 
            console.log(data)
            var file:any = {
                name: data.file.name, 
                type: data.file.type,
                data: data.file.data, 
                size: data.file.size
            }
            console.log(file)
            saveFile(data.chatId, file.name, file.data)
        });
    });
}

export const sendEventToConnectedSockets = (connections: Connections, event: string, body: any) => {
    connections.getConnections().forEach((connection: string) => {
        console.log(io)
        io.to(connection).emit(event, body);
        console.log(`send message to ${connection}`);
    });
}
