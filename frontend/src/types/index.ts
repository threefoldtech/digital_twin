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
    body: string,
    timeStamp: Date,
}

export interface Chat {
    chatId: string;
    contacts: Contact[];
    isGroup: boolean;
    messages: Message[];
    name: string;
    lastMessage: Message;
}

export interface Contact {
    id: string,
    name:string,
    location:string,
}