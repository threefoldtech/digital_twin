import {DtIdInterface, MessageInterface} from "./../types/index";
import Chat from "../models/chat";
import Message from "../models/message";
import {IdInterface, MessageBodyTypeInterface} from "../types";
import Contact from "../models/contact";
import {getChatIds, persistChat, getChat} from "./dataService";
import messages from "../routes/messages";
import {parseMessage} from "./messageService";

export const persistMessage = (
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
        new Chat(chatId, contacts, isGroupchat, [message], name, acceptedChat, adminId, {})
    );
};

export const getMessagesFromId = (chatId: IdInterface) =>
    true

export const setChatToAccepted = (chatId: IdInterface) =>
    true

    //@TODO filter for acceptedchatss
export const getAcceptedChats = () => {
    return getChatIds()
        .map((chatid) => getChat(chatid))
        // .filter((chat) => chat.acceptedChat);
};

// @TODO will need to use this later
export const getChatRequests = () => {
    return getChatIds()
        .map((chatid) => getChat(chatid))
        .filter((chat) => !chat.acceptedChat);
};

export const getChatById = (id: IdInterface) => {
    return getChat(id)
}

export const parseChat = (chat: any) => {
    const messages = chat.messages.map((m: any) => parseMessage(m))
    return new Chat(chat.chatId, chat.contacts, chat.isGroup, messages, chat.name, chat.acceptedChat, chat.adminId, chat.read)
}
