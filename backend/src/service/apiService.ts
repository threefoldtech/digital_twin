import {ChatInterface, IdInterface} from "./../types/index";
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
        const message = JSON.stringify(newMessage)
        await axios.put(url, message)
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

export const getChatfromAdmin = (adminId:IdInterface, chatId:string):Chat => {
    const location = getLocationForId(<string>adminId)
    const url = `${getDigitalTwinUrl(location)}/api/messages/${chatId}`
    try {
        console.log("getting chat from ", url)
        axios.get(url).then((chat) => {
            console.log("received chat", chat.data)
            return parseChat(chat.data)
        }).catch((e)=>{
            console.log("failed")
        })
    }
    catch { 
        console.log("failed to get chat from admin")
        throw Error
    }
    throw Error
}
