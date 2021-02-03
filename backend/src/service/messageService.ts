import {ContactRequest, MessageBodyTypeInterface, MessageInterface, MessageTypes} from "../types";
import Message from "../models/message";

export const parseMessage = (msg: any): MessageInterface<MessageBodyTypeInterface> => {
    console.log(msg)

    const type: MessageTypes = <MessageTypes>msg.type;

    console.log(type)

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
        default:
            throw new Error('validation failed')
    }

};
