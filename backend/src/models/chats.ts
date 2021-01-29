import Chat from "./chat"
import Message from "./message"
import Contact from "./contact"
export default class Connections {
    chats:{[key: string]:Chat} = {};

    // constructor(chats:{[key: string]:Chat}) {
    //     this.chats = chats
    // }

    sendMessage(chatId:string, message:Message){
        this.chats[chatId].messages.push(message)
    }

    addChat(chatId:string, contacts:Contact[],isGroupchat:boolean,name:string){
        this.chats[chatId] = new Chat(chatId,contacts,isGroupchat,[],name)
    }
}