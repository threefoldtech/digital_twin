import { IdInterface } from './../types/index';
import {Router} from 'express';
import Message from "../models/message";
import {contacts} from "../store/contacts";
import {contactRequests} from "../store/contactRequests";
import {io, sendEventToConnectedSockets} from "../service/socketService";
import {connections} from "../store/connections";
import {ContactRequest, MessageBodyTypeInterface, MessageTypes} from "../types";
import Contact from "../models/contact";
import {parseMessage, editMessage} from "../service/messageService";
import {sendMessage} from "../service/chatService";
import {getChat} from "../service/dataService";
import {config} from "../config/config";

const router = Router();

function handleContactRequest(message: Message<ContactRequest>) {
    contactRequests.push(<Contact><unknown>message.body)
}

// Should be externally availble
router.put("/", (req, res) => {
    // @ TODO check if valid
    const msg = req.body;
    let message: Message<MessageBodyTypeInterface>;
    try {
        message = parseMessage(msg);
    } catch (e) {
        res.status(500).json({status: 'failed', reason: 'validation failed'})
        return;
    }

    if (message.type === MessageTypes.CONTACT_REQUEST) {
        handleContactRequest(message as Message<ContactRequest>);

        res.json({status:"success"})
        return;
    }

    let contact = contacts.find(c => c.id == message.from)

    let chat = getChat(message.from)

    if (chat.isGroup && chat.adminId === config.userid ){
        chat.contacts.forEach(c => {
            sendMessage(c.id, message);
        })
        sendEventToConnectedSockets(connections, "message", message)
        return;
    }

    if (!chat && contactRequests.find(c => c.id == message.from)) {
        //@todo maybe 3 messages should be allowed or something
        res.status(403).json({status: 'Forbidden', reason: 'contact not yet approved'});
        return;
    }

    if (!chat) {
        res.status(403).json({status: 'Forbidden', reason: 'not in contact'});
        return;
    }

    // const message = new Message(msg.from, msg.to, msg.body);
    console.log(`received new message from ${message.from}`);
    //
    sendMessage(chat.adminId, message);
    //
    sendEventToConnectedSockets(connections, "message", message)

    res.sendStatus(200);
});

// router.put("/file", (req, res) => {
//     if(!req.query.chatId){
//         res.status(403).json({status:'Forbidden',reason:'ChatId is required as a parameter'})
//         return
//     }
//     res.sendStatus(200)
// })

router.patch("/", (req,res) => {
    if(!req.query.chatId){
        return res.status(500).json("Please provide chatId and messageId")
    }
    const chatId:IdInterface = <IdInterface>req.query.chatId
    const msg = req.body;
    const message: Message<MessageBodyTypeInterface> = parseMessage(msg);
    editMessage(chatId,message)
    sendEventToConnectedSockets(connections, "message", message)
    res.sendStatus(200)
})

export default router
