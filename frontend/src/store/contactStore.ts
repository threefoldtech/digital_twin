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
import {Message} from "../types/index"


const state = reactive<State>({
    contacts:[],
    connectionRequests: []
});

const retrieveContacts = async () => {
    axios.get(`${config.baseUrl}api/contactRequests`).then(function(response) {
        console.log("connectionrequests",response.data)
        response.data.forEach( (contact:Contact) => {
            addConnectionRequests(contact)
        });
    })

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

const addContact = (username:string, location, dontCheck = false) => { 
    // if(!dontCheck && !contactIsHealthy(username)){ 
    //     throw "Peer is not healthy"
    // }
    const {user} = useAuthState()
    const id = uuidv4()
    const addMessage:Message = {
        body: `Request has been send to ${username}`,
        from: user.name,
        timeStamp: new Date()
    }
    axios.post(`${config.baseUrl}api/contacts`, {id, username,location,message:addMessage}).then( (res) => {
        const contact:Contact = {
            id,
            name: username,
            location
        } 

        state.contacts.push(contact)
        const {addChat} = usechatsActions()
        const chat:Chat = {
            chatId:id,
            contacts: [],
            isGroup: false,
            messages:[addMessage],
            name: username,
            lastMessage: addMessage
        }
        addChat(chat)
    })
}

const addConnectionRequests = (contact:Contact) => {
    state.connectionRequests.push(contact)
}

const moveConnectionRequestToContacts = (id) => {
    const {addChat} = usechatsActions()
    axios.post(`${config.baseUrl}api/contacts?id=${id}`).then( (res) => {
        const index = state.connectionRequests.findIndex(c=>c.id==id)
        console.log(state.connectionRequests[index])
        const messages:Message[] = res.data
        const chat:Chat = {
            chatId:id,
            contacts: [],
            isGroup: false,
            messages:messages,
            //@ts-ignore
            name: state.connectionRequests[index].username,
            lastMessage: messages[messages.length - 1]
        }
        console.log(chat)
        addChat(chat)
        // @ts-ignore
        state.contacts.push({id: state.connectionRequests[index].id, name: state.connectionRequests[index].username})
        state.connectionRequests.splice(index,1)
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
        addContact,
        addConnectionRequests,
        moveConnectionRequestToContacts
    }
}

interface State {
    contacts: Contact[],
    connectionRequests: Contact[]
}
