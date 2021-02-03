import {Router} from 'express';
import {appCallback, getAppLoginUrl} from "../service/authService";
import {chats} from "../store/chats";
import Contact from "../models/contact";
import Message from "../models/message";
import {config} from "../config/config";
import axios from "axios";
import {contacts} from "../store/contacts";
import {contactRequests} from "../store/contactRequests";
import {io, sendEventToConnectedSockets} from "../service/socketService";
import {connections} from "../store/connections";

const router = Router();


router.post("/messageRequest", (req,res)=>{
    const username = req.body.username
    const location = req.body.location

    if(!contactRequests.find(c=> c.location == location)){
        const contact = new Contact(username, username, location);

        console.log("adding contact to contactrequest", contact )
        contactRequests.push(contact);

        console.log(`creating chat`)
        const addMessage:Message = {
            chatId: username,
            to: config.userid,
            body: `Request to connect received from ${username}`,
            from: username,
            timeStamp: new Date()
        }
        chats.addChat(contact.id, [contact], false, addMessage, contact.username, false)

        sendEventToConnectedSockets(connections, "connectionRequest", contact)
    }
    res.sendStatus(200)
})


export default router
