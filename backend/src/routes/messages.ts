import {Router} from 'express';
import {appCallback, getAppLoginUrl} from "../service/authService";
import {chats} from "../store/chats";
import Contact from "../models/contact";
import Message from "../models/message";
import {config} from "../config/config";
import axios from "axios";
import {contacts} from "../store/contacts";
import {contactRequests} from "../store/contactRequests";
import {sendEventToConnectedSockets, io} from "../service/socketService";
import {connections} from "../store/connections";

const router = Router();

// Should be externally availble
router.post("/", (req, res) => {
    // @ TODO check if valid
    const mes = req.body;

    let contact = contacts.find(c => c.username == mes.from)
    if(!contact){
        contact = contactRequests.find(c=> c.username == mes.from)

        if(!contact){
            res.sendStatus(404)
            return
        }
        return
    }
    const message = new Message(mes.from, mes.to, mes.body);
    console.log(`received new message from ${message.from}`);

    chats.sendMessage(contact.id, message);
    const data = {
        chatId: contact.id,
        message: mes
    }

    sendEventToConnectedSockets(io, connections, "message", data)
    console.log("<<<<< new message >>>>")

    res.sendStatus(200);
});

export default router
