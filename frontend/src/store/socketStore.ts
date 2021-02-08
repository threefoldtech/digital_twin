import { Message } from "@/types";
import { reactive } from "@vue/reactivity";
import { inject } from "vue";
import {handleRead, usechatsActions} from "./chatStore";
import { useContactsActions } from "./contactStore";
import { useAuthState } from "@/store/authStore";

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
        if (message.type === 'READ'){
            handleRead(message)

            return;
        }
        const {addMessage} = usechatsActions()

    const { user } = useAuthState();
    addMessage(message.to === user.id ? message.from : message.to, message);
  });
  state.socket.on("connectionRequest", (newContactRequest) => {
    const { addConnectionRequests } = useContactsActions();
    addConnectionRequests(newContactRequest);
  });
};

const sendSocketMessage = async (
  chatId: string,
  message: Message<any>,
  isUpdate = false
) => {
  console.log("sending ", message);
  const data = {
    chatId,
    message,
  };
  const messageType = isUpdate ? "update_message" : "message";
  await state.socket.emit(messageType, data);
};

// const sendSocketFile = async (chatId:string, message:Message<ArrayBuffer>) => {
//   console.log('sending ', message)
//   const data = {
//     chatId,
//     message
//   }
//   await state.socket.emit("message", data);
// };

const sendSocketAvatar = async (avatar: ArrayBuffer) => {
  const url = `https://${window.location.origin}/api/user/avatar`.replace("https://localhost:8080","http://localhost:3000")
  const data = {
    avatar,
    url
  }
  state.socket.emit("new_avatar", data);
};

const getSocket = () => {
  return state.socket;
};

export const useSocketActions = () => {
  return {
    initializeSocket,
    sendSocketMessage,
    sendSocketAvatar,
  };
};

interface State {
  socket: any;
}
