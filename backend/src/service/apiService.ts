import { MessageOperations } from "./../types/index";
import axios from "axios";
import Contact from "../models/contact";
import Message from "../models/message";
import { MessageBodyTypeInterface } from "../types";
export const sendMessageToApi = (
  contacts: Contact[],
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

  let url;
  let promise;
  switch (type) {
    case MessageOperations.NEW:
      url = `http://${newMessage.to}-chat/api/messages`;
      console.log(url)
      try {
        axios.put(url, newMessage).then((resp) => {
            console.log(resp.data);
          })
          .catch((error) => {
            console.log("couldn't send message");
          });
      } catch (e) {
        console.log(e);
      }
    case MessageOperations.UPDATE:
      url = `http://${newMessage.to}-chat/api/messages?chatId=${newMessage.id}`;
      try {
        axios.patch(url, newMessage).then((resp) => {
            console.log(resp.data);
          })
          .catch((error) => {
            console.log("couldn't send message");
          });
      } catch (e) {
        console.log(e);
      }
    // case MessageOperations.DELETE:
    // url =
    // default:
    //     throw new Error("validation failed");
  }

  const result = promise
    
};
