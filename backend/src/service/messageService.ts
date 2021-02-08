import {IdInterface} from "./../types/index";
import {ContactRequest, FileMessageType, MessageBodyTypeInterface, MessageInterface, MessageTypes,} from "../types";
import Message from "../models/message";
import {getChat, persistChat, saveFile} from "./dataService";
import get = Reflect.get;
import Chat from "../models/chat";
import {config} from "../config/config";
import {sendEventToConnectedSockets} from "./socketService";
import {connections} from "../store/connections";

export const parseMessage = (
    msg: any
): MessageInterface<MessageBodyTypeInterface> => {
    const type: MessageTypes = <MessageTypes>msg.type;

    switch (type) {
        case MessageTypes.STRING:
            return new Message<String>(
                msg.from,
                msg.to,
                msg.body,
                new Date(msg.timeStamp),
                msg.id,
                type
            );
        case MessageTypes.CONTACT_REQUEST:
            return new Message<ContactRequest>(
                msg.from,
                msg.to,
                <ContactRequest>msg.body,
                new Date(msg.timeStamp),
                msg.id,
                type
            );
        case MessageTypes.FILE_UPLOAD:
            const url = saveFile(msg.to, msg.body.name, msg.body.parsedFile);

            return new Message<FileMessageType>(
                msg.from,
                msg.to,
                <FileMessageType>{filename: msg.body.name},
                new Date(msg.timeStamp),
                msg.id,
                MessageTypes.FILE
            );
        case MessageTypes.FILE:
            return new Message<FileMessageType>(
                msg.from,
                msg.to,
                <FileMessageType>msg.body,
                new Date(msg.timeStamp),
                msg.id,
                type
            );
        case MessageTypes.EDIT:
            return new Message<String>(
                msg.from,
                msg.to,
                <String>msg.body,
                new Date(msg.timeStamp),
                msg.id,
                MessageTypes.EDIT
            );
        case MessageTypes.DELETE:
            return new Message<String>(
                msg.from,
                msg.to,
                <String>msg.body,
                new Date(msg.timeStamp),
                msg.id,
                MessageTypes.DELETE
            );
        case MessageTypes.QUOTE:
            return new Message<String>(
                msg.from,
                msg.to,
                <String>msg.body,
                new Date(msg.timeStamp),
                msg.id,
                MessageTypes.QUOTE
            );
        case MessageTypes.READ:
            return new Message<String>(
                msg.from,
                msg.to,
                <String>msg.body,
                new Date(msg.timeStamp),
                msg.id,
                MessageTypes.READ
            );

        default:
            throw new Error("validation failed");
    }
};

export const editMessage = (
    chatId: IdInterface,
    newMessage: Message<MessageBodyTypeInterface>
) => {
    const chat = getChat(chatId);
    const index = chat.messages.findIndex((mes) => mes.id === newMessage.id);
    chat.messages[index] = newMessage;
    persistChat(chat);
};

export const handleRead = (message: Message<string>) => {
    console.log('reading')

    let chatId = message.to === config.userid ? message.from : message.to;
    const chat = getChat(chatId);

    const newRead = chat.messages.find(m => m.id === message.body)
    const oldRead = chat.messages.find(m => m.id === chat.read[<string>message.from])


    if (oldRead && newRead.timeStamp.getTime() > oldRead.timeStamp.getTime()){
        return;
    }


    chat.read[<string>message.from] = message.body
    persistChat(chat);
    sendEventToConnectedSockets(connections, "message", message)
};
