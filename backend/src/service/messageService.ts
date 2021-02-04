import {ContactRequest, MessageBodyTypeInterface, MessageInterface, MessageTypes, FileMessageType} from "../types";
import Message from "../models/message";
import { saveFile } from "./dataService"


export const parseMessage = (msg: any): MessageInterface<MessageBodyTypeInterface> => {
    console.log(msg)
    console.log(msg.type)
    const type: MessageTypes = <MessageTypes>msg.type;

    console.log("message type", type)

    switch (type) {
        case MessageTypes.STRING:
            return new Message<String>(
                msg.from,
                msg.to,
                msg.body,
                new Date(msg.timeStamp),
                msg.id,
                type
            )
        case MessageTypes.CONTACT_REQUEST:
            return new Message<ContactRequest>(
                msg.from,
                msg.to,
                <ContactRequest>msg.body,
                new Date(msg.timeStamp),
                msg.id,
                type
            )
        case MessageTypes.FILE_UPLOAD:
            console.log("newMessage")
                
            const url = saveFile(msg.to, msg.body.name, msg.body.parsedFile);

            return new Message<FileMessageType>(
                msg.from,
                msg.to,
                <FileMessageType>{url},
                new Date(msg.timeStamp),
                msg.id,
                MessageTypes.FILE
            )
        case MessageTypes.FILE:
                return new Message<FileMessageType>(
                    msg.from,
                    msg.to,
                    <FileMessageType>msg.body,
                    new Date(msg.timeStamp),
                    msg.id,
                    type
                )
        default:
            throw new Error('validation failed')
    }

};
