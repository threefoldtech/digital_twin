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
        const incommingchats:Array<Message> =  response.data
        incommingchats.sort((a,b)=>  moment(a.timeStamp).unix() - moment(b.timeStamp).unix())
        incommingchats.forEach( message =>{
            addMessage(message)
        })
    }))
}

const addMessage= (message:Message) => {
    console.log('in addmessage', message)
    const {setLastMessage} = useContactsActions()
    
    if(!state.chats[message.chatId]) state.chats[message.chatId] = []
    state.chats[message.chatId].push(message)

    setLastMessage(message.from, message)
    console.log(state.chats)
}

const sendMessage = (chatId, message) => {
    const {sendSocketMessage} = useSocketActions()
    const {user} = useAuthState()
    const msg:Message = {
        chatId: chatId,
        body: message,
        from: user.name,
        timeStamp: new Date()
    }
    addMessage(msg)
    sendSocketMessage(msg)
}

export const usechatsState = () => {
    return {
        ...toRefs(state),
    }
}

export const usechatsActions = () => {
    return {
        retrievechats,
        sendMessage,
        addMessage
    }
}

interface chatstate {
    chats: Chat[]
}
