import Chat from "../models/chat";
import {IdInterface} from "../types";
import Contact from "../models/contact";

export const chats: Map<IdInterface, Chat> = new Map<IdInterface, Chat>();

console.log(process.env.NODE_ENV)
chats.set('jason_parser', new Chat('jason_parser', [new Contact('jason_parser', 'localhost:3000')], false, [], '', true))
chats.set('56f32728-8f2b-4e47-9d24-6f6d57023264', new Chat('56f32728-8f2b-4e47-9d24-6f6d57023264', [new Contact('jason_parser', 'localhost:3000')], true, [], '', true))
