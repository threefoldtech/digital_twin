export interface User extends AnonymousContact {
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

export interface Message <T>{
    id: Id
    from: DtId,
    to: Id | DtId,
    body: T,
    timeStamp: Date,
    type: String,
}

export interface MessageBodyType extends String{

}

export interface QuoteBodyType extends MessageBodyType{
    message: string
    quotedMessage: Message<MessageBodyType>
}

export interface Chat {
    chatId: Id,
    messages: Message<MessageBodyType>[];
    name: string;
}
export interface PersonChat extends Chat{
    chatId: DtId;
    messages: Message<MessageBodyType>[];
}

export interface GroupChat extends Chat{
    chatId: Id;
    contacts: (AnonymousContact|Contact)[];
    adminId: Id;
}

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