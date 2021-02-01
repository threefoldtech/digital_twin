import Contact from "./contact"
import Message from "./message"
export default class Chat {
    chatId: String;
    contacts: Contact[];
    isGroup: boolean;
    messages: Message[];
    name: string;
    acceptedChat: boolean;
  
    constructor(chatId:String, contacts: Contact[], isGroup: boolean, messages: Message[],name:string, acceptedChat:boolean) {
      this.chatId = chatId;
      this.contacts = contacts;
      this.isGroup = isGroup;
      this.messages = messages;
      this.name = name;
      this.acceptedChat = acceptedChat;
    }

    addMessage(message:Message){
        this.messages.push(message)
    }
  }
  