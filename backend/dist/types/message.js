"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
class Message {
    constructor(from, to, body) {
        this.from = from;
        this.to = to;
        this.body = body;
        this.timeStamp = new Date();
    }
}
exports.Message = Message;
