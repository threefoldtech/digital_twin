
import { reactive } from "@vue/reactivity";
import { toRefs } from "vue";
import axios from "axios";
import moment from "moment";
import { Chat, Contact, Message, GroupChat, MessageBodyType } from "../types";
import {useSocketActions} from './socketStore'
import { useAuthState } from "./authStore";
import {useContactsActions} from './contactStore'
import config from '../../public/config/config'
import { uuidv4 } from "@/common";

const state = reactive<chatstate>({
    chats:[]
});

const retrievechats = async () => {
    const response = await axios.get(`${config.baseUrl}api/chats`).then((response) => {
        console.log("retreived chats: ", response.data)
        const incommingchats = response.data

        // debugger
        incommingchats.forEach(chat => {
            addChat(chat)
        })
        sortChats()
    })
}

const addChat = (chat:Chat) => {
    state.chats.push(chat)
    sortChats()
}

const addGroupchat = (name:string ,contacts:Contact[]) => {
    const {user} = useAuthState()
    const newGroupchat:GroupChat = {
        chatId: uuidv4(),
        contacts: contacts,
        messages: [{
            from: "localhost:8080",
            to: "testgroup",
            body: "testing",
            timeStamp: new Date(),
            id: "3d11c0cf-0fa9-4177-90c3-1ac08d2313f7",
            type: "STRING"
        }],
        name: name,
        adminId: user.id
    }
    axios.put(`${config.baseUrl}api/group`, newGroupchat).then((res)=>{
        console.log(res)
    }).catch((e)=>{
        console.log("failed to add groupchat",e)
    })
}

const addMessage = (chatId, message) => {
    console.log('in addmessage chatid', chatId)
    console.log('in addmessage message', message)

    const chat:Chat = state.chats.find(chat=>chat.chatId == chatId)
    const index = chat.messages.findIndex(mes=> mes.id == message.id)
    if(index !== -1){
        console.log("edit chat")
        chat.messages[index] = message
        return
    }
    chat.messages.push(message)
    console.log("before setLastmessage")
    setLastMessage(chatId, message)
}

const sendMessage = (chatId, message) => {
    const {sendSocketMessage} = useSocketActions()
    const {user} = useAuthState()
    const msg:Message<String> = {
        id: uuidv4(),
        body: message,
        from: user.id,
        to: chatId,
        timeStamp: new Date(),
        type: "STRING"
    }
    addMessage(chatId, msg)
    sendSocketMessage(chatId, msg)
}

const sendMessageObject = (chatId, message:Message<MessageBodyType>)=> {
    const {sendSocketMessage} = useSocketActions()
    console.log(chatId,message)
    addMessage(chatId,message)
    let isEdit = false
    if(message.type === "UPDATE" ){
        isEdit = true
    }

    sendSocketMessage(chatId, message, isEdit)
}

const sendFile = async (chatId, name, parsedFile) => {
    const { sendSocketMessage } = useSocketActions()
    const {user} = useAuthState()

    let id = uuidv4();
    const msgToSend:Message<Object> = {
        id,
        body: {
            name,
            parsedFile
        },
        from: user.id,
        to: chatId,
        timeStamp: new Date(),
        type: "FILE_UPLOAD"
    }
    sendSocketMessage(chatId,msgToSend)
    // const msgToShow:Message<Object> = {
    //     id,
    //     body: {
    //         filename: name
    //     },
    //     from: user.id,
    //     to: chatId,
    //     timeStamp: new Date(),
    //     type: "FILE"
    // }
    // addMessage(chatId, msgToShow)
}

const setLastMessage= (chatId:string, message:Message<String>) => {
    console.log("here", state.chats, chatId)
    if(!state.chats) return
    const chat = state.chats.find(c=> c.chatId == chatId)
    if(!chat) return

    // sortChats()
}

const sortChats = () => {
    state.chats.sort((a,b)=> {
        var adate = a.messages[a.messages.length-1] ? a.messages[a.messages.length-1].timeStamp : new Date(-8640000000000000)
        var bdate = b.messages[b.messages.length-1]? b.messages[b.messages.length-1].timeStamp : new Date(-8640000000000000)
        return moment(bdate).unix() - moment(adate).unix()
    })
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
        addMessage,
        sendFile,
        sendMessageObject,
        addGroupchat,
    }
}

interface chatstate {
    chats: Chat[]
}
