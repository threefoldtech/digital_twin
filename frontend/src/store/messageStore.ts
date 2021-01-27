import { reactive } from "@vue/reactivity";
import { toRefs } from "vue";
import axios from "axios";
import moment from "moment";
import { Message } from "../types";
import {useSocketActions} from './socketStore'
import { useAuthState } from "./authStore";
import {useContactsActions} from './contactStore'
import config from '../../public/config/config'

const state = reactive<MessageState>({
    messages:[]
});

const retrieveMessages = () => {
    console.log(axios.get(`${config.baseUrl}api/messages`).then(function(response) {
        console.log("retreivedmessages: ", response.data)
        const incommingMessages:Array<Message> =  response.data
        incommingMessages.sort((a,b)=>  moment(a.timeStamp).unix() - moment(b.timeStamp).unix())
        incommingMessages.forEach( message =>{
            addMessage(message)
        })
    }))
}

const addMessage= (message:Message) => {
    console.log('in addmessage', message)
    const {setLastMessage} = useContactsActions()
    const {user} = useAuthState()

    if(message.from == user.name){
        if(!state.messages[message.to]) state.messages[message.to] = []
        state.messages[message.to].push(message)
        setLastMessage(message.to, message)
    } else {
        if(!state.messages[message.from]) state.messages[message.from] = []
        state.messages[message.from].push(message)
        setLastMessage(message.from, message)
    }
    console.log(state.messages)
}

const sendMessage = (contactName, message) => {
    const {sendSocketMessage} = useSocketActions()
    const {user} = useAuthState()
    const msg:Message = {
        to: contactName,
        body: message,
        from: user.name,
        timeStamp: new Date()
    }
    addMessage(msg)
    sendSocketMessage(msg)
}

export const useMessagesState = () => {
    return {
        ...toRefs(state),
    }
}

export const useMessagesActions = () => {
    return {
        retrieveMessages,
        sendMessage,
        addMessage
    }
}

interface MessageState {
    messages: Array<Message>
}
