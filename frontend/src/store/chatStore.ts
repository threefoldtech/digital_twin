import { reactive } from "@vue/reactivity";
import { toRefs } from "vue";
import axios from "axios";
import moment from "moment";
import { Chat, Message } from "../types";
import {useSocketActions} from './socketStore'
import { useAuthState } from "./authStore";
import {useContactsActions} from './contactStore'
import config from '../../public/config/config'

const state = reactive<chatstate>({
    chats:[]
});

const retrievechats = () => {
    console.log(axios.get(`${config.baseUrl}api/chats`).then(function(response) {
        console.log("retreived chats: ", response.data)
        const incommingchats =  response.data.chats
        Object.keys(incommingchats).forEach((key)=>{
            addChat(incommingchats[key])
        })
    }))
}

const addChat = (chat:Chat) => {
    state.chats.push(chat)
}

const addMessage= (chatId, message) => {
    console.log('in addmessage chatid', chatId)
    console.log('in addmessage message', message)
    
    const chat:Chat = state.chats.find(chat=>chat.chatId == chatId)
    chat.messages.push(message)

    // setLastMessage(message.from, message)
    console.log(state.chats)
}

const sendMessage = (chatId, message) => {
    const {sendSocketMessage} = useSocketActions()
    const {user} = useAuthState()
    const msg:Message = {
        body: message,
        from: user.name,
        timeStamp: new Date()
    }
    addMessage(chatId, msg)
    sendSocketMessage(chatId, message)
}

export const usechatsState = () => {
    return {
        ...toRefs(state),
    }
}

export const usechatsActions = () => {
    return {
        addChat,
        retrievechats,
        sendMessage,
        addMessage
    }
}

interface chatstate {
    chats: Chat[]
}
