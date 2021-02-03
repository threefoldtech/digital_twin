import { Message } from "@/types";
import { reactive } from "@vue/reactivity";
import { inject } from "vue";
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
    addMessage(message.chatId, message.message)
  });
  state.socket.on("connectionRequest", (newContactRequest)=> {
    const {addConnectionRequests} = useContactsActions()
    addConnectionRequests(newContactRequest)
  })
};

const sendSocketMessage = async (chatId:string, message:Message<String>) => {
  console.log('sending ', message)
  const data = {
    chatId,
    message
  }
  await state.socket.emit("message", data);
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
