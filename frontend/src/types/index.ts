export interface User extends AnonymousContact {
    image: string,
    email: string,
    status: string
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

export interface Message <T>{
    id: Id
    from: DtId,
    to: Id | DtId,
    body: T,
    timeStamp: Date,
    type: String,
    subject: Id | null
    replys: Message<MessageBodyType>[]
}

export interface MessageBodyType{

}


export interface StringMessageType extends String, MessageBodyType{

}

export interface QuoteBodyType extends MessageBodyType{
    message: string
    quotedMessage: Message<MessageBodyType>
}

export interface GroupUpdate extends MessageBodyType{
    type: string
    contact: Contact
    chat: Chat
}

export interface Chat {
    chatId: Id,
    messages: Message<MessageBodyType>[];
    read: {
        [key: string]: string
    };
    contacts: (AnonymousContact|Contact)[];
    acceptedChat: boolean;
    name: string;
    isGroup:boolean
    adminId: Id;
    type: ChatType;

}

export enum ChatType {
    PERSON = "PERSON",
    GROUP = "GROUP",
    FORUM = "FORUM",
}

export interface PersonChat extends Chat{}

export interface GroupChat extends Chat{}

export interface Contact extends AnonymousContact {
    location:string,
}

export interface AnonymousContact {
    id: DtId,
}

export interface DtId extends Id {

}

export interface Id extends String {

}
const test: Id = ""

export interface Workspace extends GroupChat{
    subGroups: GroupChat[]
}
