import {DtIdInterface, IdInterface, MessageInterface, MessageTypes} from "../types";

export default class Message<T> implements MessageInterface<T> {
    public from: DtIdInterface;
    public to: IdInterface;
    public body: T;
    public timeStamp: Date;
    public id: IdInterface;
    public type: MessageTypes;


    constructor(from: DtIdInterface, to: IdInterface, body: T, timeStamp: Date, id: IdInterface, type: MessageTypes) {
        this.from = from;
        this.to = to;
        this.body = body;
        this.timeStamp = timeStamp;
        this.id = id;
        this.type = type;
    }

}
