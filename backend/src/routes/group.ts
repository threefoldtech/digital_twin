import {Router} from 'express';
import {parseChat} from "../service/chatService";
import {persistChat} from "../service/dataService";
import axios from "axios";
import {getDigitalTwinUrl} from "../service/apiService";

const router = Router();

router.put('/invite', async (req, res) => {

    const chat = parseChat(req.body)
    console.log(chat)
    persistChat(chat);
    res.json({success: true})
})

router.put('/', async (req, res) => {

    let preParsedChat = {...req.body, acceptedChat:true, isGroup:true};
    const chat = parseChat(preParsedChat)
    console.log(chat)
    persistChat(chat);

    chat.contacts.forEach(c => {
        const dtUrl = getDigitalTwinUrl(c.location)
        const path = `${dtUrl}/group/invite`;
        // axios.put(path, chat)
    })

    res.json({success: true})
})

export default router
