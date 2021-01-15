import { reactive } from "@vue/reactivity";
import { toRefs } from "vue";
import axios from "axios";
import config from '../common/config';
import moment from "moment";


const state = reactive<State>({
    messages:[]
});

const retrieveMessages = () => {
    
    console.log(axios.get(`${config.baseUrl}messages?count=10`).then(function(response) {
        let messages= response.data
        messages.sort((a,b)=>  moment(a.date).unix() - moment(b.date).unix())
        state.messages = messages;
    }))
}

export const useMessagesState = () => {
    return {
        ...toRefs(state),
    }
}

export const useMessagesActions = () => {
    return {
        retrieveMessages
    }
}

interface State {
    messages: string[]
}