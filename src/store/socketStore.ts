import { reactive } from "@vue/reactivity";
import { Socket } from "socket.io-client";
import { toRefs, inject } from "vue";
import {useAuthState} from './authStore'
import config from "../common/config";
import { useMessagesActions } from "./messageStore";

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
    console.log("incoming")
    const {addMessage} = useMessagesActions()
    addMessage(message)
  });
};

const sendSocketMessage = (message) => {
  state.socket.emit("message", message);
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
