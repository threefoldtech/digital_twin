import Chat from "../models/chat";
import Message from "../models/message";
import {IdInterface, MessageBodyTypeInterface} from "../types";
import Contact from "../models/contact";
import {chats} from "../store/chats";
import { getChatIds } from "../service/dataService"

export const sendMessage = (chatId: IdInterface, message: Message<MessageBodyTypeInterface>) => {
    chats.get(chatId).messages.push(message)
};

export const addChat = (chatId: IdInterface, contacts: Contact[], isGroupchat: boolean, message: Message<MessageBodyTypeInterface>, name: string, acceptedChat: boolean) => {
    chats.set(chatId, new Chat(chatId, contacts, isGroupchat, [message], name, acceptedChat));
};

export const getMessagesFromId = (chatId: IdInterface) => chats.get(chatId).messages;

export const setChatToAccepted = (chatId: IdInterface) => chats.get(chatId).acceptedChat = true;

export const getAcceptedChats = () => {
    const chatIds = getChatIds()
    
    // const chatIds = <String[]>Array.from(chats.keys())
    // console.log(chatIds)
    // const acceptedChatIds = chatIds.filter(chatId => {
    //     console.log()
    //     return chats.get(chatId).acceptedChat
    // })
    // return acceptedChatIds.map(id => {
    //     return chats.get(id).chatId
    // })

};
