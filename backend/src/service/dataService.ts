import { IdInterface } from "../types/index";
import { config } from "../config/config";
import fs from "fs";
import User from "../models/user";
import Chat from "../models/chat";

export const getChatIds = () => {
    const location = config.baseDir + "chats"
    const locations = fs.readdirSync(location)
    console.log(locations)
    return locations
}

export const getChat = (id: IdInterface):Chat => {
  const path = config.baseDir + `chats/${id}`
  const chat:Chat = <Chat>JSON.parse(fs.readFileSync(path).toString());
  return chat
};

export const persistChat = (chat:Chat) => {
  const path = config.baseDir + `chats/${chat.chatId}`

  try{
    fs.statSync(path)
  }
  catch{
    fs.mkdirSync(path)
  }
  fs.writeFileSync(path+"/chat.json",JSON.stringify(chat),{flag: 'w'})
};
export const getUserdata = () => {
  const location = config.baseDir + "user/userinfo.json";
  try {
    const data = JSON.parse(fs.readFileSync(location).toString());
    return data;
  } catch {
    throw new Error("Userinfo file doesn't exitst");
  }
};
export const persistUserdata = (userData:Object) => {
  const userdata = JSON.stringify(userData)
  const location = config.baseDir + "user/userinfo.json"
  fs.writeFileSync(location,userdata,{flag: 'w'})
  return
};
