import {IdInterface} from "./../types/index";
import axios from "axios";
import Message from "../models/message";
import {MessageBodyTypeInterface} from "../types";
import Chat from "../models/chat";
import { parseChat } from "./chatService";

export const sendMessageToApi = async (
    location: IdInterface,
    newMessage: Message<MessageBodyTypeInterface>
) => {
    const url = `${getDigitalTwinUrl(location)}/api/messages`;
    try {
        await axios.put(url, newMessage)
    } catch (e) {
        console.error(`couldn't send message ${url}`)
    }
};


export const getDigitalTwinUrl = (location: IdInterface) => {
    //@todo

    if (location === "localhost:3000-chat"){
        return 'http://localhost:3000'
    }

    return `http://${getLocationForId(<string>location)}`
};

export const getLocationForId= (id:string) => {
    return `${(id.replace('-chat', ''))}-chat`
}

export const getChatfromAdmin = async (adminId:IdInterface, chatId:string) => {
    const location = getLocationForId(<string>adminId)
    const url = `${getDigitalTwinUrl(location)}/api/messages/${chatId}`
    try {
        console.log("getting chat from ", url)
        const chat =  await axios.get(url)
        const parsedChat = parseChat(chat.data)
        console.log(parsedChat)
        return parsedChat
    }
    catch { 
        console.log("failed to get chat from admin")
        throw Error
    }
    throw Error
}
