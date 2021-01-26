import { reactive } from "@vue/reactivity";
import { toRefs } from "vue";
import axios from "axios";
import moment from 'moment'
import { Contact } from '../types'
import config from "../../public/config/config"
import {uuidv4} from "../../src/common/index"

const state = reactive<State>({
    contacts:[]
});

const retrieveContacts = async () => {
    return axios.get(`${config.baseUrl}api/contacts`).then(function(response) {
        const contacts = response.data
        console.log(`here are the contacts`, contacts)
        contacts.sort((a,b)=> {
            var adate = a.lastMessage? a.lastMessage.timeStamp : new Date()
            var bdate = b.lastMessage? b.lastMessage.timeStamp : new Date()
            return moment(bdate).unix() - moment(adate).unix()
        })
        state.contacts = contacts;
    })
}
const setLastMessage= (username, message) => {
    if(!state.contacts.length || !state.contacts.find(u => u.name == username)) return

    if(!message.timeStamp) message.timeStamp = new Date()
    state.contacts.find(u => u.name == username).lastMessage = message

    const contacts = JSON.parse(JSON.stringify(state.contacts))
    contacts.sort((a,b)=> {
        var adate = a.lastMessage? a.lastMessage.timeStamp : new Date(-8640000000000000)
        var bdate = b.lastMessage? b.lastMessage.timeStamp : new Date(-8640000000000000)
        return moment(bdate).unix() - moment(adate).unix()
    })
    state.contacts = contacts;
    //TODO: Sort contacts
}

const contactIsHealthy = (location) => {
    let isAvailable = false
    axios.get(`https://${location}/api/healthcheck`).then( (res) => {
        console.log(res)
        isAvailable = true
    }).catch( res => {
        isAvailable = false
    })
    return isAvailable
}

const addContact = (username, location, dontCheck = false) => { 
    if(!dontCheck && !contactIsHealthy(location)){ 
        throw "Peer is not healthy"
    }
    const id = uuidv4()
    axios.post(`${config.baseUrl}api/contacts`, {id, username,location}).then( (res) => {
        // @todo check how to fix this
        // @ts-ignore
        state.contacts.push({id, name: username})
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
        setLastMessage,
        addContact
    }
}

interface State {
    contacts: Contact[]
}
