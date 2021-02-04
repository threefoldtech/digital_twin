import {MessageInterface} from "./../types/index";
import Chat from "../models/chat";
import Message from "../models/message";
import {IdInterface, MessageBodyTypeInterface} from "../types";
import Contact from "../models/contact";
import {getChatIds, persistChat, getChat} from "./dataService";

export const sendMessage = (
    chatId: IdInterface,
    message: MessageInterface<MessageBodyTypeInterface>
) => {
    const chat = getChat(chatId);
    chat.messages.push(message);
    console.log(chat)
    console.log(chat.messages)
    persistChat(chat)
};

export const addChat = (
    chatId: IdInterface,
    contacts: Contact[],
    isGroupchat: boolean,
    message: MessageInterface<MessageBodyTypeInterface>,
    name: string,
    acceptedChat: boolean
) => {
    persistChat(
        new Chat(chatId, contacts, isGroupchat, [message], name, acceptedChat)
    );
};

export const getMessagesFromId = (chatId: IdInterface) =>
    true

export const setChatToAccepted = (chatId: IdInterface) =>
    true

export const getAcceptedChats = () => {
    return getChatIds()
        .map((chatid) => getChat(chatid))
        .filter((chat) => chat.acceptedChat);
};

export const getChatById = (id:IdInterface) => {
    return getChat(id)
}