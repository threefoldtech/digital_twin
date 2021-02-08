import { reactive } from "@vue/reactivity";
import { toRefs } from "vue";
import axios from "axios";
import moment from 'moment'
import { Contact } from '../types'
import config from "../../public/config/config"
import {uuidv4} from "../../src/common/index"
import { Chat } from "../types";
import {usechatsActions} from "./chatStore"
import { useAuthState } from './authStore';
import { Message, PersonChat, DtId } from "../types/index"


const state = reactive<State>({
    contacts:[]
});

const retrieveContacts = async () => {
    return axios.get(`${config.baseUrl}api/contacts`).then(function(response) {
        const contacts = response.data
        console.log(`here are the contacts`, contacts)
        state.contacts = contacts;
    })

}

const contactIsHealthy = (location) => {
    let isAvailable = false
    axios.get(`https://${location}.digitaltwin.jimbertesting.be/api/healthcheck`).then( (res) => {
        console.log(res)
        isAvailable = true
    }).catch( res => {
        isAvailable = false
    })
    return isAvailable
}

const addContact = (username:DtId, location, dontCheck = false) => {
    // if(!dontCheck && !contactIsHealthy(username)){
    //     throw "Peer is not healthy"
    // }
    const {user} = useAuthState()
    const addMessage:Message<String> = {
        id: uuidv4(),
        body: `Request has been send to ${username}`,
        from: user.id,
        to: username,
        timeStamp: new Date(),
        type:"STRING"
    }
    const chatname:String = username
    axios.post(`${config.baseUrl}api/contacts`, {id:username,location,message:addMessage}).then( (res) => {
        const contact:Contact = {
            id:username,
            location
        }

        state.contacts.push(contact)
        const {addChat} = usechatsActions()
        const chat:PersonChat = {
            read: {},
            chatId:username,
            messages:[addMessage],
            name: chatname.toString(),
            acceptedChat: true
        }
        addChat(chat)
    })
}


export const useContactsState = () => {
    return {
        ...toRefs(state),
    }
}

export const useContactsActions = () => {
    return {
        retrieveContacts,
        // setLastMessage,
        addContact
    }
}

interface State {
    contacts: Contact[]
}
