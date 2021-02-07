import {ChatInterface, IdInterface, MessageOperations} from "./../types/index";
import axios from "axios";
import Contact from "../models/contact";
import Message from "../models/message";
import {MessageBodyTypeInterface} from "../types";

export const sendMessageToApi = async (
    location: IdInterface,
    newMessage: Message<MessageBodyTypeInterface>,
    type: MessageOperations
) => {
    // console.log(contacts)
    // console.log(newMessage)
//   const receiver = contacts.find((c) => c.id == newMessage.to);
//   if (!receiver) {
//     console.log("receiver not found");
//     return "receiver not found";
//   }

    let url: string;
    let promise;
    switch (type) {
        case MessageOperations.NEW:
            url = `${getDigitalTwinUrl(location)}/api/messages`;
            console.log(url)
            try {
                await axios.put(url, newMessage).then((resp) => {
                    console.log(resp.data);
                })
            } catch (e) {
                console.error(`couldn't send message ${url}`)
            }
            break;
        case MessageOperations.UPDATE:
            url = `${getDigitalTwinUrl(location)}/api/messages?chatId=${newMessage.id}`;
            try {
                await axios.patch(url, newMessage).then((resp) => {
                    console.log(resp.data);
                })
            } catch (e) {
                console.log(e);
            }
            break;
        // case MessageOperations.DELETE:
        // url =
        // default:
        //     throw new Error("validation failed");
    }

    const result = promise

};
export const getDigitalTwinUrl = (location: IdInterface) => {
    //@todo

    if (location === "localhost:3000-chat"){
        return 'http://localhost:3000'
    }

    return `http://${location}`
};

export const getLocationForId= (id:string) => {
    return `${(id.replace('-chat', ''))}-chat`
}
