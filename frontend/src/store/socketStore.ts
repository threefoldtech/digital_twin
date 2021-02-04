import {Message} from "@/types";
import {reactive} from "@vue/reactivity";
import {inject} from "vue";
import {usechatsActions} from "./chatStore";
import {useContactsActions} from "./contactStore";
import {useAuthState} from "@/store/authStore";

const state = reactive<State>({
    socket: "",
});

const initializeSocket = (username: string) => {
    state.socket = inject("socket");
    state.socket.on("connect", () => {
        console.log("connected");
    });
    state.socket.emit("identify", {
        name: username,
    });
    state.socket.on("message", (message) => {
        debugger
        console.log(message);
        const {addMessage} = usechatsActions()

        const {user} = useAuthState()
        addMessage(message.to === user.id ? message.from : message.to, message)
    });
    state.socket.on("connectionRequest", (newContactRequest) => {
        const {addConnectionRequests} = useContactsActions()
        addConnectionRequests(newContactRequest)
    })
};

const sendSocketMessage = async (chatId: string, message: Message<any>) => {
    console.log('sending ', message)
    const data = {
        chatId,
        message
    }
    await state.socket.emit("message", data);
};

// const sendSocketFile = async (chatId:string, message:Message<ArrayBuffer>) => {
//   console.log('sending ', message)
//   const data = {
//     chatId,
//     message
//   }
//   await state.socket.emit("message", data);
// };

const getSocket = () => {
    return state.socket;
};

export const useSocketActions = () => {
    return {
        initializeSocket,
        sendSocketMessage,
    };
};

interface State {
    socket: any;
}
