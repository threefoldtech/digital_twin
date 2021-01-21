import { reactive } from "@vue/reactivity";
import { toRefs } from "vue";
import axios from "axios";
import config from '../common/config'
import moment from 'moment'
import { Contact } from '../types'


const state = reactive<State>({
    contacts:[]
});

const retrieveContacts = () => {
    console.log(axios.get(`${config.baseUrl}api/contacts`).then(function(response) {
        const contacts = response.data
        console.log(`here are the contacts`, contacts)
        contacts.sort((a,b)=> {
            var adate = a.lastMessage? a.lastMessage.timeStamp : new Date()
            var bdate = b.lastMessage? b.lastMessage.timeStamp : new Date()
            return moment(bdate).unix() - moment(adate).unix()
        })
        state.contacts = contacts;
    }))
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

export const useContactsState = () => {
    return {
        ...toRefs(state),
    }
}

export const useContactsActions = () => {
    return {
        retrieveContacts,
        setLastMessage
    }
}

interface State {
    contacts: Contact[]
}