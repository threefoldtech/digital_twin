export interface User {
    name: string,
    image: string,
    email: string
}
export interface App {
    id: string,
    name: string,
    url: string,
    iconUrl: string,
    sharedWith:User[],
    accessHistory:User[]
}

export interface Tab {
    name: string,
    icon: string
}

export interface Message {
    chatId: string,
    from: string,
    body: string,
    timeStamp: Date,
}

export interface Chat {
    chatId: string
    chats: Message[]
}

// export interface GroupChat extends Chat {
//     //todo
// }
// export interface Chat {
//     chatId: string
//     chats: Message[]
//     lastMessage: Message,
//     isTyping: false
// }

export interface Contact {
    id: string,
    name:string,
    location:string,
    lastMessage: Message,
    isTyping: false
}