import {config} from "../config/config"
import {user} from "../store/user"
import User from "../models/user"
import fs from "fs"


export const getChatIds = () => {
    const location = config.baseDir + "chats"
    const locations = fs.readdirSync(location)
    console.log(locations)
    return locations
}

export const getChat = () => {

}

export const persistChat = () => {

}
export const getUserdata = () => {
    const location = config.baseDir + "user/userinfo.json"
    try{
        const data = JSON.parse(fs.readFileSync(location).toString())
        return data
    }catch{
        throw new Error("Userinfo file doesn't exitst")
    }
}
export const persistUserdata = () => {
    // Default status
    let dataToWrite = {
        status: "Exploring the new DigitalTwin"
    }
    if(user){
        dataToWrite = user.getData()
    }
    const userdata = JSON.stringify(dataToWrite)
    const location = config.baseDir + "user/userinfo.json"
    fs.writeFileSync(location,userdata,{flag: 'w'})
}