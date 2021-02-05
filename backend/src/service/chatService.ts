import {DtIdInterface, MessageInterface} from "./../types/index";
import Chat from "../models/chat";
import Message from "../models/message";
import {IdInterface, MessageBodyTypeInterface} from "../types";
import Contact from "../models/contact";
import {getChatIds, persistChat, getChat} from "./dataService";
import messages from "../routes/messages";

export const sendMessage = (
    chatId: IdInterface,
    message: MessageInterface<MessageBodyTypeInterface>
) => {
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
    acceptedChat: boolean,
    adminId: DtIdInterface
) => {
    persistChat(
        new Chat(chatId, contacts, isGroupchat, [message], name, acceptedChat, adminId)
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

export const parseChat = (chat: any) => {
    return new Chat(chat.chatId,chat.contacts, chat.isGroup,chat.messages, chat.name,chat.acceptedChat,chat.adminId)
}
