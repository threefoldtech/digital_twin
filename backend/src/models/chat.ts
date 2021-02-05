import Contact from "./contact"
import Message from "./message"
import {DtIdInterface, MessageBodyTypeInterface} from "../types";
import {user} from "../store/user";

export default class Chat {
    chatId: String;
    contacts: Contact[];
    isGroup: boolean;
    messages: Message<MessageBodyTypeInterface>[];
    name: string;
    acceptedChat: boolean;
    adminId: DtIdInterface;

    constructor(chatId:String, contacts: Contact[], isGroup: boolean, messages: Message<MessageBodyTypeInterface>[],name:string, acceptedChat:boolean, admin: DtIdInterface) {
      this.chatId = chatId;
      this.contacts = contacts;
      this.isGroup = isGroup;
      this.messages = messages;
      this.name = name;
      this.acceptedChat = acceptedChat;
      this.adminId = admin;
    }

    addMessage(message:Message<MessageBodyTypeInterface>){
        this.messages.push(message)
    }
  }
