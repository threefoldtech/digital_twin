export default class Message {
  chatId: String;
  from: string;
  to: string;
  body: string;
  timeStamp: Date;

  constructor(chatId:String, from: string, to: string, body: string) {
    this.chatId = chatId;
    this.from = from;
    this.to = to;
    this.body = body;
    this.timeStamp = new Date();
  }
}
