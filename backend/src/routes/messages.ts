import { persistChat } from './../service/dataService';
import {IdInterface, MessageOperations, PersonChatInterface} from './../types/index';
import {Router} from 'express';
import Message from "../models/message";
import {contactRequests} from "../store/contactRequests";
import {sendEventToConnectedSockets} from "../service/socketService";
import {connections} from "../store/connections";
import {ContactRequest, MessageBodyTypeInterface, MessageTypes} from "../types";
import Contact from "../models/contact";
import {editMessage, handleRead, parseMessage} from "../service/messageService";
import {persistMessage} from "../service/chatService";
import {getChat} from "../service/dataService";
import {config} from "../config/config";
import {sendMessageToApi} from "../service/apiService";
import Chat from '../models/chat';
import { uuidv4 } from '../common';

const router = Router();

function handleContactRequest(message: Message<ContactRequest>) {
    contactRequests.push(<Contact><unknown>message.body)
    const otherContact = new Contact(<string>message.body.id,message.body.location)
    //@TODO fix this location with config
    const myself = new Contact(<string>config.userid,`${config.userid}-chat`)
    const requestMsg:Message<String> = {
        from:message.from,
        to: message.to,
        body: `You've received a new message request from ${message.from}`,
        id:uuidv4(),
        type: MessageTypes.STRING,
        timeStamp: new Date()
    }
    const newchat =  new Chat(
        message.from,
        [myself,otherContact],
        false,
        [requestMsg],
        <string>message.from,
        false,
        message.from
    )
    sendEventToConnectedSockets("connectionRequest",newchat)
    persistChat(newchat)
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

    let chat = getChat(message.from === config.userid ? message.to : message.from)

    console.log(`chat.isGroup ${chat.isGroup}`)
    console.log(`chat.chatId ${chat.chatId}`)
    console.log(`chat.adminId ${chat.adminId}`)
    console.log(`config.userid ${config.userid}`)
    console.log(`works? ${chat.isGroup && chat.adminId === config.userid}`)
    if (chat.isGroup && chat.adminId == config.userid ){
        chat.contacts.filter(c => c.id !== config.userid).forEach(c => {
            console.log(`group sendMessage to ${c.id}`)
            sendMessageToApi(c.id, message,MessageOperations.NEW);
        })


        console.log(`received new group message from ${message.from}`);
        sendEventToConnectedSockets( "message", message)

        if (message.type === MessageTypes.READ) {
            handleRead(message as Message<string>);

            res.json({status:"success"})
            return;
        }
        persistMessage(chat.chatId, message);
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


    if (message.type === MessageTypes.READ) {
        handleRead(message as Message<string>);

        res.json({status:"success"})
        return;
    }

    // const message = new Message(msg.from, msg.to, msg.body);
    console.log(`received new message from ${message.from}`);
    //
    persistMessage(chat.adminId, message);
    //
    sendEventToConnectedSockets( "message", message)

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
    sendEventToConnectedSockets("message", message)
    res.sendStatus(200)
})

export default router
