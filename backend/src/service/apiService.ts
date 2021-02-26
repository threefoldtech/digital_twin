import {IdInterface} from "./../types/index";
import axios from "axios";
import Message from "../models/message";
import {MessageBodyTypeInterface} from "../types";
import Chat from "../models/chat";
import { parseChat } from "./chatService";

export const sendMessageToApi = async (
    location: String,
    newMessage: Message<MessageBodyTypeInterface>
) => {
    const url = `http://[${location}]/api/messages`;
    try {
        await axios.put(url, newMessage)
    } catch (e) {
        console.error(`couldn't send message ${url}`)
    }
};

export const getChatfromAdmin = async (adminLocation:string, chatId:string) => {
    const url = `${adminLocation}/api/messages/${chatId}`
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
