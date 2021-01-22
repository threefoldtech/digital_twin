"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(from, to, body) {
        this.from = from;
        this.to = to;
        this.body = body;
        this.timeStamp = new Date();
    }
}
exports.default = Message;
