import { MessageInterface } from './../types/index';
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

const router = Router();

router.get("/", (req, res) => {
    const resp = contacts.map((contact) => {
        return contact.id
    });
    res.json(resp);
});

router.post("/", (req, res) => {
    if(req.query.id){
        //Flow to add contact request to contacts
        const id = req.query.id
        const index = contactRequests.findIndex(c=>c.id==id)
        contacts.push(contactRequests[index]);
        contactRequests.splice(index,1)
        res.json([]);
        return
    }

    const con = req.body;
    const contact = new Contact(con.id, con.location);

    console.log(`Adding contact  ${contact.id}`);
    contacts.push(contact);

    const message:MessageInterface<MessageBodyTypeInterface> = parseMessage(con.message)
    console.log(`creating chat`)
    addChat(contact.id,[contact],false, message ,contact.id, true)

    const url = `http://${contact.location}/api/messageRequest`
    const data = {
        username:config.userid,
        location: `${config.userid}-chat`
    }
    console.log("sending to ",url)
    try{
        axios.post(
            url,
            data).then( () => {
            console.log("Send request to ", contact.location)
        }).catch((e)=>{
            console.log("couldnt send contact request")
        })
    }catch (e) {
        console.log("couldn't send contact request")
    }
    res.sendStatus(200);
});


export default router