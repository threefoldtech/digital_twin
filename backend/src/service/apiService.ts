import {ChatInterface, IdInterface, MessageOperations} from "./../types/index";
import axios from "axios";
import Contact from "../models/contact";
import Message from "../models/message";
import {MessageBodyTypeInterface} from "../types";

export const sendMessageToApi = async (
    location: IdInterface,
    newMessage: Message<MessageBodyTypeInterface>
) => {
    const url = `${getDigitalTwinUrl(location)}/api/messages`;
    try {
        await axios.put(url, newMessage)
    } catch (e) {
        console.error(`couldn't send message ${url}`)
    }
};


export const getDigitalTwinUrl = (location: IdInterface) => {
    //@todo

    if (location === "localhost:3000-chat"){
        return 'http://localhost:3000'
    }

    return `http://${getLocationForId(<string>location)}`
};

export const getLocationForId= (id:string) => {
    return `${(id.replace('-chat', ''))}-chat`
}
