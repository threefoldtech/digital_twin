import {MessageInterface} from "./../types/index";
import Chat from "../models/chat";
import Message from "../models/message";
import {IdInterface, MessageBodyTypeInterface} from "../types";
import Contact from "../models/contact";
import {chats} from "../store/chats";
import {getChatIds, persistChat, getChat} from "./dataService";

export const sendMessage = (
    chatId: IdInterface,
    message: MessageInterface<MessageBodyTypeInterface>
) => {
    console.log(chatId)
    const chat = getChat(chatId);
    chat.messages.push(message);
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
    chats.set(
        chatId,
        new Chat(chatId, contacts, isGroupchat, [message], name, acceptedChat)
    );
    persistChat(
        new Chat(chatId, contacts, isGroupchat, [message], name, acceptedChat)
    );
};

export const getMessagesFromId = (chatId: IdInterface) =>
    chats.get(chatId).messages;

export const setChatToAccepted = (chatId: IdInterface) =>
    (chats.get(chatId).acceptedChat = true);

export const getAcceptedChats = () => {
    return getChatIds()
        .map((chatid) => getChat(chatid))
        .filter((chat) => chat.acceptedChat);
};
