import { reactive } from "@vue/reactivity";
import { Socket } from "socket.io-client";
import { toRefs, inject } from "vue";
import {useAuthState} from './authStore'
import { usechatsActions } from "./chatStore";
import { useContactsActions } from "./contactStore";

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
    console.log(message);
    const {addMessage} = usechatsActions()
    addMessage(message)
  });
  state.socket.on("connectionRequest", (newContactRequest)=> {
    const {addConnectionRequests} = useContactsActions()
    addConnectionRequests(newContactRequest)
  })
};

const sendSocketMessage = async (message) => {
  console.log('sending',  message)
  await state.socket.emit("message", message);
};

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
