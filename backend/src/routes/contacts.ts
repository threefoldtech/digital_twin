import {getDigitalTwinUrl, getLocationForId, sendMessageToApi} from './../service/apiService';
import { ContactRequest, DtIdInterface, MessageInterface, MessageOperations, MessageTypes } from './../types/index';
import { parseMessage } from './../service/messageService';
import {Router} from 'express';
import {appCallback, getAppLoginUrl} from "../service/authService";
import Contact from "../models/contact";
import Message from "../models/message";
import {config} from "../config/config";
import axios from "axios";
import {contacts} from "../store/contacts";
import {contactRequests} from "../store/contactRequests";
import {MessageBodyTypeInterface} from "../types";
import {addChat, getMessagesFromId} from "../service/chatService";
import { uuidv4 } from '../common';
import {sendEventToConnectedSockets} from "../service/socketService";


const router = Router();

router.get("/", (req, res) => {
    res.json(contacts);
});

router.post("/", (req, res) => {
    const con = req.body;
    const contact = new Contact(con.id, con.location);

    console.log(`Adding contact  ${contact.id}`);
    contacts.push(contact);

    const message:MessageInterface<MessageBodyTypeInterface> = parseMessage(con.message)
    console.log(`creating chat`)
    const chat = addChat(contact.id,[contact, new Contact(config.userid, getLocationForId(config.userid))],false, message ,contact.id, true, contact.id)


    const url = `/api/messages`
    const data:Message<ContactRequest> = {
        "id": uuidv4(),
        "to": contact.id,
        "body": {
            "id": <DtIdInterface>contact.id,
            "location": <string>contact.location
        },
        "from": config.userid,
        "type": MessageTypes.CONTACT_REQUEST,
        "timeStamp": new Date()
    }
    console.log("sending to ",url)
    sendMessageToApi(contact.location,data,MessageOperations.NEW)
    sendEventToConnectedSockets("connectionRequest",chat)
});


export default router
