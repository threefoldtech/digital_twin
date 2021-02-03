import {Socket} from "socket.io";
import Connections from "../models/connections";
import Message from "../models/message";
import {contacts} from "../store/contacts";
import {chats} from "../store/chats";
import axios from "axios";
import {connections} from "../store/connections";
import * as http from "http";

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
            const newMessage: Message = messageData.message
            const chatId: string = messageData.chatId

            console.log(contacts)
            console.log(chatId)
            const receiver = contacts.find(c => c.id == chatId);
            if (!receiver) {
                console.log("receiver not found")
                return "receiver not found";
            }

            chats.sendMessage(receiver.id, newMessage);

            const url = `http://${receiver.location}/api/messages`
            console.log(`sending message ${newMessage.body} to ${url}`);

            connections.getConnections().forEach((connection: string) => {
                if (connection == socket.id) {
                    // this is me
                    return
                }
                const data = {
                    chatId: newMessage.chatId,
                    message: newMessage
                }
                io.to(connection).emit("message", data);
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
    });
}

export const sendEventToConnectedSockets = (connections: Connections, event: string, body: any) => {
    connections.getConnections().forEach((connection: string) => {
        console.log(io)
        io.to(connection).emit(event, body);
        console.log(`send message to ${connection}`);
    });
}
