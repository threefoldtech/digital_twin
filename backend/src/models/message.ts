export default class Message {
  chatId: String;
  from: string;
  to: string;
  body: string;
  timeStamp: Date;

  constructor(from: string, to: string, body: string) {
    this.from = from;
    this.to = to;
    this.body = body;
    this.timeStamp = new Date();
  }
}
