import {DtId, Id, Message} from "@/types";
import { reactive } from "@vue/reactivity";
import { inject } from "vue";
import {handleRead, removeChat, usechatsActions} from "./chatStore";
import { useContactsActions, useContactsState } from "./contactStore";
import { useAuthState } from "@/store/authStore";
import { addUserToBlockList} from "@/store/blockStore"

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
    state.socket.on("chat_removed", (chatId) => {
        console.log('chat_removed')
        removeChat(chatId)
    });
    state.socket.on("chat_blocked", (chatId) => {
        removeChat(chatId)
        addUserToBlockList(chatId)
    });
    state.socket.on("message", (message) => {
        if (message.type === 'READ'){
            handleRead(message)

            return;
        }
        const {addMessage} = usechatsActions()

    const { user } = useAuthState();
    addMessage(message.to === user.id ? message.from : message.to, message);
  });
  state.socket.on("connectionRequest", (newContactRequest) => {
    const { addChat } = usechatsActions();
    const { contacts } = useContactsState();
    const {user} = useAuthState()
    addChat(newContactRequest);
  });
    state.socket.on("chat_updated", (chat) => {
        const {updateChat} = usechatsActions()
        console.log(chat)
        console.log("updating chat", chat.chatId)
        updateChat(chat)
        // removeChat(chatId)
    });
    state.socket.on("new_chat", (chat) => {
        const { addChat } = usechatsActions();
        addChat(chat)
    });
};

const sendSocketMessage = async (
  chatId: string,
  message: Message<any>,
  isUpdate = false
) => {
  // console.log("sending ", message);
  const data = {
    chatId,
    message,
  };
  const messageType = isUpdate ? "update_message" : "message";
  await state.socket.emit(messageType, data);
};

export const sendRemoveChat = async (id: Id) => {
    state.socket.emit("remove_chat", id);
};
export const sendBlockChat = async (id: Id) => {
    state.socket.emit("block_chat", id);
    state.socket.emit("remove_chat", id);
};

const sendSocketUserStatus = async (status: string) => {
  const data = {
    status
  }
  state.socket.emit("status_update",data)
}

const getSocket = () => {
  return state.socket;
};

export const useSocketActions = () => {
  return {
    initializeSocket,
    sendSocketMessage,
    sendSocketUserStatus
  };
};

interface State {
  socket: any;
}
