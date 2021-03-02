import { persistChat } from './../service/dataService';
import { UploadedFile } from 'express-fileupload';
import {Router} from 'express';
import {user} from "../store/user"
import {connections} from "../store/connections"
import { getChat, saveFile } from '../service/dataService';
import { FileMessageType, MessageTypes } from '../types';
import Message from '../models/message';
import {config} from '../config/config'
import { sendEventToConnectedSockets } from '../service/socketService';
import { sendMessageToApi } from '../service/apiService';

const router = Router();

router.get('/:chatid/:name', async(req, res) => {
    // @TODO fix this security
    const path = `${config.baseDir}/chats/${req.params.chatid}/files/${req.params.name}`

    res.download(path);
})

router.post('/:chatid/:messageid',async(req,resp)=>{
    const chatId = req.params.chatid
    const messageId = req.params.messageid
    const fileToSave = <UploadedFile>req.files.file
    saveFile(chatId,fileToSave.name,fileToSave.data)
    const message:Message<FileMessageType> = {
        from: config.userid,
        body: <FileMessageType>{ filename: fileToSave.name },
        id: messageId,
        timeStamp: new Date(),
        to: chatId,
        type: MessageTypes.FILE,
        replys: [],
        subject: null
    }
    sendEventToConnectedSockets("message",message)
    const chat = getChat(chatId)
    sendMessageToApi(<string>chat.adminId,message)
    chat.addMessage(message)
    persistChat(chat)
    resp.sendStatus(200)
})

export default router
