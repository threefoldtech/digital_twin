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

    addChat(chatId:string, contacts:Contact[],isGroupchat:boolean,message:Message, name:string, acceptedChat:boolean){
        this.chats[chatId] = new Chat(chatId,contacts,isGroupchat,[message],name, acceptedChat)
    }
    
    getMessagesFromId(chatId:string){
        return this.chats[chatId].messages
    }

    setChatToAccepted(chatId:string){
        return this.chats[chatId].acceptedChat = true
    }

    getAcceptedChats(){
        const chatIds = Object.keys(this.chats)
        const acceptedChatIds = chatIds.filter(chatid => {
            console.log()
            return this.chats[chatid].acceptedChat
        })
        const a:{[key: string]:Chat} = {}
        acceptedChatIds.forEach(id => {
            return a[id] = this.chats[id]
        })
        console.log(a)
        return a
    
    }
    
}