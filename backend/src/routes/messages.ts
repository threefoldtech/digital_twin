import {Router} from 'express';
import {chats} from "../store/chats";
import Message from "../models/message";
import {contacts} from "../store/contacts";
import {contactRequests} from "../store/contactRequests";
import {io, sendEventToConnectedSockets} from "../service/socketService";
import {connections} from "../store/connections";
import {ContactRequest, MessageBodyTypeInterface, MessageTypes} from "../types";
import Contact from "../models/contact";
import {parseMessage} from "../service/messageService";
import {sendMessage} from "../service/chatService";

const router = Router();

function handleContactRequest(message: Message<ContactRequest>) {
    contactRequests.push(<Contact><unknown>message.body)
}

// Should be externally availble
router.put("/", (req, res) => {
    // @ TODO check if valid
    const msg = req.body;
    let message: Message<MessageBodyTypeInterface>;
    try {
        message = parseMessage(msg);
    } catch (e) {
        res.status(500).json({status: 'failed', reason: 'validation failed'})
        return;
    }

    if (message.type === MessageTypes.CONTACT_REQUEST) {
        handleContactRequest(message as Message<ContactRequest>);

        res.json({status:"success"})
        return;
    }

    let contact = contacts.find(c => c.id == message.from)

    if (!contact && contactRequests.find(c => c.id == message.from)) {
        //@todo maybe 3 messages should be allowed or something
        res.status(403).json({status: 'Forbidden', reason: 'contact not yet approved'});
        return;
    }

    if (!contact) {
        res.status(403).json({status: 'Forbidden', reason: 'not in contact'});
        return;
    }

    // const message = new Message(msg.from, msg.to, msg.body);
    console.log(`received new message from ${message.from}`);
    //
    sendMessage(contact.id, message);
    //
    sendEventToConnectedSockets(connections, "message", message)

    res.sendStatus(200);
});

export default router
