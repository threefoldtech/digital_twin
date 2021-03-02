import {IdInterface, UserInterface} from './../types/index';
import {config} from "../config/config";
import fs from "fs";
import Chat from "../models/chat";
import {parseChat} from "./chatService";
import {uniqBy} from "lodash";
import {db} from "./dbService";

export const getChatIds = (): IdInterface[] => {
    // db.get('chats').map(chat => chat)

    const location = config.baseDir + "chats"
    const locations = fs.readdirSync(location)
    console.log(locations)
    return locations
}

export const getChat = (id: IdInterface): Chat => {
    // const path = config.baseDir + `chats/${id}/chat.json`
    // const chat: Chat = <Chat>JSON.parse(fs.readFileSync(path).toString());
    // persistChat(parseChat(chat))
    // return parseChat(chat)
    const dbChat = db.get('chats').find({chatId: id})
    return parseChat(dbChat.value())
};

export const getUserdata = () => {
    const location = config.baseDir + "user/userinfo.json";
    try {
        const data = JSON.parse(fs.readFileSync(location).toString());
        return data;
    } catch {
        throw new Error("Userinfo file doesn't exitst");
    }
};

const sortChat = (chat: Chat) => {
    const messages = uniqBy(chat.messages, m => m.id)

    messages.map(m => {
        const replys = uniqBy(m.replys, r => r.id)
        replys.sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime())
        m.replys = replys;
    })

    messages.sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime())

    chat.messages = messages;

    return chat;
};

export const persistChat = (chat: Chat) => {
    const sortedChat = sortChat(chat)

    console.log('db persist')
    // @ts-ignore
    const dbChat = db.get('chats').find({chatId: chat.chatId})
    if (dbChat) {
        dbChat.assign(sortedChat).write()
    }
    db.get('chats').push(sortedChat).write()
};
export const deleteChat = (chatId: string) => {
    db.get('chats').remove({chatId}).write()
};

export const persistUserdata = (userData: UserInterface) => {
    const userdata = JSON.stringify(userData, null, 4)
    const location = config.baseDir + "user/userinfo.json"
    fs.writeFileSync(location, userdata, {flag: 'w'})
    return
};

export const saveFile = (chatId: IdInterface, fileName: string, fileBuffer: Buffer) => {
    const path = `${config.baseDir}chats/${chatId}/files/${fileName}`
    fs.writeFileSync(path, fileBuffer)
    return path
}

export const saveAvatar = (fileBuffer: Buffer, id: string) => {
    const path = `${config.baseDir}user/avatar-${id}`
    fs.writeFileSync(path, fileBuffer)
}

export const persistBlocklist = (blockList: string[]) => {
    const location = config.baseDir + "user/blockList.json"
    fs.writeFileSync(location, JSON.stringify(blockList, null, 4), {flag: 'w'})
    return
};


export const getBlocklist = (): string[] => {
    const location = config.baseDir + "user/blockList.json";
    try {
        return JSON.parse(fs.readFileSync(location).toString());
    } catch {
        return []
    }
};
