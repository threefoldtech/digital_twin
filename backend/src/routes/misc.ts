import {Router} from 'express';
import {ChatType, MessageTypes} from "../types";
import Chat from "../models/chat";
import {uuidv4} from "../common";
import {config} from "../config/config";
import {getChat, persistChat} from "../service/dataService";

const router = Router();

router.get('/healthcheck', async (req, res) => {
    res.sendStatus(200);
})

router.get('/possibleMessages', async (req, res) => {
    res.json(MessageTypes)
})

router.get('/test', async (req, res) => {
    let id = uuidv4();
    getChat(id)
    const chat = new Chat(id, [], false, [], "test", false, config.userid, ChatType.PERSON ,{})

    persistChat(chat)
    res.json({success: true})
})

export default router
