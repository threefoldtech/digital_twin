import { IdInterface } from "./../types/index";
import {
  ContactRequest,
  MessageBodyTypeInterface,
  MessageInterface,
  MessageTypes,
  FileMessageType,
} from "../types";
import Message from "../models/message";
import { saveFile, getChat, persistChat } from "./dataService";

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
        <FileMessageType>{ filename: msg.body.name },
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

    default:
      throw new Error("validation failed");
  }
};

export const editMessage = (
  chatId: IdInterface,
  newMessage: Message<MessageBodyTypeInterface>
) => {
  const chat = getChat(chatId);
  const index = chat.messages.findIndex((mes) => mes.id == newMessage.id);
  chat.messages[index] = newMessage;
  persistChat(chat);
};
