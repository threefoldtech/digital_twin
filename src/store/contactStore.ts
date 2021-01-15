import { reactive } from "@vue/reactivity";
import { toRefs } from "vue";
import axios from "axios";
import config from '../common/config'
import moment from 'moment'


const state = reactive<State>({
    contacts:[]
});

const retrieveContacts = () => {
    console.log(axios.get(`${config.baseUrl}contacts?count=100`).then(function(response) {
        const contacts= response.data
        contacts.sort((a,b)=> moment(b.date).unix() - moment(a.date).unix())
        state.contacts = contacts;
    }))
}

export const useContactsState = () => {
    return {
        ...toRefs(state),
    }
}

export const useContactsActions = () => {
    return {
        retrieveContacts
    }
}

interface State {
    contacts: string[]
}