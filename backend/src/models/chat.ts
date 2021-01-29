import Contact from "./contact"
import Message from "./message"
export default class Chat {
    chatId: String;
    contacts: Contact[];
    isGroup: boolean;
    messages: Message[];
    name: string
  
    constructor(chatId:String, contacts: Contact[], isGroup: boolean, messages: Message[],name:string) {
      this.chatId = chatId;
      this.contacts = contacts;
      this.isGroup = isGroup;
      this.messages = messages;
      this.name = name;
    }

    addMessage(message:Message){
        this.messages.push(message)
    }
  }
  