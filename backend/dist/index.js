"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
// import ioserver, {Socket} from "socket.io"
const socketio = require("socket.io");
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const message_1 = __importDefault(require("./models/message"));
const connections_1 = __importDefault(require("./models/connections"));
const contact_1 = __importDefault(require("./models/contact"));
const app = express_1.default();
const httpServer = http_1.default.createServer(app);
const io = socketio(httpServer);
let connections = new connections_1.default([]);
const dummycontact = new contact_1.default("Jason parser", "localhost:3000");
let contacts = [dummycontact];
let messages = [];
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};
app.use(cors_1.default(corsOptions));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/api/login", (req, res) => {
    console.log("to implement");
});
app.get("/api/messages", (req, res) => {
    res.json(messages);
});
app.get("/api/contacts", (req, res) => {
    const resp = contacts.map((contact) => {
        return {
            name: contact.username
        };
    });
    res.json(resp);
});
app.post("/api/messages", (req, res) => {
    // @ TODO check if valid
    const mes = req.body;
    const message = new message_1.default(mes.from, mes.to, mes.body);
    console.log(`received new message from ${message.from}`);
    // @TODO implement db here
    messages.push(message);
    connections.getConnections().forEach((connection) => {
        io.to(connection).emit("message", message);
        console.log(`send message to ${connection}`);
    });
    res.sendStatus(200);
});
app.post("/api/contacts", (req, res) => {
    // @ TODO check if valid
    const con = req.body;
    const contact = new contact_1.default(con.username, con.location);
    console.log(`Adding contact  ${contact.username}`);
    // @TODO implement db here
    contacts.push(contact);
    res.sendStatus(200);
});
io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);
    connections.add(socket.id);
    messages.forEach((message) => {
        socket.emit("message", message);
    });
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
        connections.delete(socket.id);
    });
    socket.on("message", (newMessage) => {
        console.log('new message');
        const receiver = contacts.find((c) => c.username == newMessage.to);
        if (!receiver) {
            console.log("receiver not found");
            return "receiver not found";
        }
        // @TODO implement db here
        messages.push(newMessage);
        const url = `http://${receiver.location}/api/messages`;
        console.log(`sending message ${newMessage.body} to ${url}`);
        connections.getConnections().forEach((connection) => {
            if (connection == socket.id) {
                // this is me
                return;
            }
            io.to(connection).emit("message", newMessage);
            console.log(`send message to ${connection}`);
        });
        try {
            axios_1.default.post(url, newMessage)
                .then(response => {
                console.log(response.data);
                // console.log(response)
            })
                .catch(error => {
                console.log("couldn't send message");
            });
        }
        catch (e) {
            console.log(e);
        }
    });
});
httpServer.listen(3000, "localhost", () => {
    console.log("go to http://localhost:3000");
});
