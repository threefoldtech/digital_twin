import { reactive } from "@vue/reactivity";
import { toRefs } from "vue";
import axios from "axios";
import config from '../common/config';
import moment from "moment";
import { Message } from "../types";
import {useSocketActions} from './socketStore'
import { useAuthState } from "./authStore";
import {useContactsActions} from './contactStore'

const state = reactive<MessageState>({
    messages:
    {
        "Jason Parser":[]
    }
});

const retrieveMessages = () => {  
    console.log(axios.get(`${config.baseUrl}api/messages`).then(function(response) {
        let messages= response.data
        messages.sort((a,b)=>  moment(a.date).unix() - moment(b.date).unix())
        state.messages = messages;
    }))
}

const addMessage= (message) => {
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
    const msg = {
        to: contactName,
        body: message,
        from: user.name
    }
    sendSocketMessage(msg)
    
    addMessage(msg)
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
    messages: any
}