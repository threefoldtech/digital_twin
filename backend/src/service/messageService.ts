import { IdInterface, StringMessageTypeInterface } from "./../types/index";
import {
    ContactRequest,
    FileMessageType,
    MessageBodyTypeInterface,
    MessageInterface,
    MessageTypes,
} from "../types";
import Message from "../models/message";
import { getChat, persistChat, saveFile } from "./dataService";
import { sendEventToConnectedSockets } from "./socketService";
import { determinChatId } from "../routes/messages";

export const parseMessage = (
    msg: any
): MessageInterface<MessageBodyTypeInterface> => {
    const type: MessageTypes = <MessageTypes>msg.type;
    const replies: MessageInterface<MessageBodyTypeInterface>[] = [
        ...msg.replys?.map((r: any) => parseMessage(r)),
    ];

    switch (type) {
        case MessageTypes.CONTACT_REQUEST:
            return new Message<ContactRequest>(
                msg.from,
                msg.to,
                <ContactRequest>msg.body,
                new Date(msg.timeStamp),
                msg.id,
                type,
                replies,
                msg?.subject
            );
        case MessageTypes.GROUP_UPDATE:
            return new Message<any>(
                msg.from,
                msg.to,
                <any>msg.body,
                new Date(msg.timeStamp),
                msg.id,
                type,
                replies,
                msg?.subject
            );
        case MessageTypes.FILE_UPLOAD:
            saveFile(msg.to, msg.body.name, msg.body.parsedFile);

            return new Message<FileMessageType>(
                msg.from,
                msg.to,
                <FileMessageType>{ filename: msg.body.name },
                new Date(msg.timeStamp),
                msg.id,
                MessageTypes.FILE,
                replies,
                msg?.subject
            );
        case MessageTypes.FILE:
            return new Message<FileMessageType>(
                msg.from,
                msg.to,
                <FileMessageType>msg.body,
                new Date(msg.timeStamp),
                msg.id,
                type,
                replies,
                msg?.subject
            );
        case MessageTypes.STRING:
        case MessageTypes.EDIT:
        case MessageTypes.DELETE:
        case MessageTypes.QUOTE:
        case MessageTypes.GIF:
        case MessageTypes.READ:
        default:
            return new Message<MessageBodyTypeInterface>(
                msg.from,
                msg.to,
                <String>msg.body,
                new Date(msg.timeStamp),
                msg.id,
                type,
                replies,
                msg?.subject
            );
    }
};

export const editMessage = (
    chatId: IdInterface,
    newMessage: Message<MessageBodyTypeInterface>
) => {
    const chat = getChat(chatId);
    const index = chat.messages.findIndex((mes) => mes.id === newMessage.id);
    chat.messages[index].body = newMessage.body;
    persistChat(chat);
};

export const handleRead = (message: Message<StringMessageTypeInterface>) => {
    console.log("reading");

    let chatId = determinChatId(message);
    const chat = getChat(chatId);

    const newRead = chat.messages.find((m) => m.id === message.body);
    const oldRead = chat.messages.find(
        (m) => m.id === chat.read[<string>message.from]
    );

    if (
        oldRead &&
        newRead &&
        newRead.timeStamp.getTime() < oldRead.timeStamp.getTime()
    ) {
        return;
    }

    chat.read[<string>message.from] = <string>message.body;
    persistChat(chat);
    sendEventToConnectedSockets("message", message);
};
