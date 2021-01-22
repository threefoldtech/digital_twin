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
    from: string,
    to: string,
    body: string,
    timeStamp: Date,
}

export interface Contact {
    name:string,
    lastMessage: Message,
    isTyping: false
}