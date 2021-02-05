<template>
  <div
    class="my-2 flex"
    :class="{
      'justify-end': isMine(message),
    }"
  >
    <div class="bg-white p-4 rounded-lg truncate">
      <pre>{{ message }}</pre>
      <button v-if="message.type=='EDIT'|| message.type=='STRING'" @click="setEditMessage">
        <i class="fas fa-pen text-gray-500"></i>
      </button>
      <i class="fas fa-minus-circle text-gray-500"></i>
      <br />
      <span v-if="message.type === 'FILE'">
        <audio controls v-if="message.body.filename.indexOf('.WebM') !== -1" :src="`http://${message.from.replace('localhost:8080','localhost:3000')}/api/files/${message.to}/${message.body.filename}`"></audio>
        <br>
        <a class="py-2 px-2 bg-green-200 border-r-2" :href="`http://${message.from.replace('localhost:8080','localhost:3000')}/api/files/${message.to}/${message.body.filename}`" download>{{message.body.filename}}</a>
      </span>
      <span v-else>
        <div v-if="editMessage" class="flex">
          <input class="col-span-6" stype="text" v-model="editMessageValue" />
          <button class="px-2 py-8" @click="sendUpdateMessage">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <div v-else>
          {{ message.body }}
        </div>
      </span>
      <p
        class="font-thin"
        :class="{
          'text-right': isMine(message),
        }"
      >
        <span v-if="message.type == 'EDIT'"> edited - </span>
        {{ m(message.timeStamp).fromNow() }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useAuthState } from "../store/authStore";
import moment from "moment";
import { usechatsActions } from "../store/chatStore"
import { Message } from "../types/index"

export default defineComponent({
  name: "MessageCard",
  props: {
    message: Object,
    chatId: String,
  },
  setup(props) {
    const { user } = useAuthState();

    const isMine = (message) => {
      return message.from == user.id;
    };

    const m = (val) => moment(val);

    const editMessage = ref(false);
    const editMessageValue = ref("");
    const setEditMessage = () => {
      console.log("inseteditmessage");
      editMessage.value = true;
      editMessageValue.value = props.message.body;
    };
    const sendUpdateMessage = () => { 
      editMessage.value = false;
      console.log("heerreeeeeeeeeeeeeeee")
      if (props.message.value != editMessageValue.value) {
        const { sendEditMessage } = usechatsActions()
        const oldmessage = props.message
        console.log(props.message)
        console.log("hlllasdfasdf")
        const updatedMessage:Message<String> = {
          id: oldmessage.id,
          from: oldmessage.from,
          to: oldmessage.to,
          body: editMessageValue.value,
          timeStamp: oldmessage.timeStamp,
          type:"EDIT"
        } 
        sendEditMessage(props.chatId, updatedMessage)
        console.log(props.chatId);
        console.log(props.message);
      }
      props.message.value = editMessageValue.value;
    };

    return {
      isMine,
      m,
      setEditMessage,
      editMessage,
      editMessageValue,
      sendUpdateMessage,
    };
  },
});
</script>

<style scoped>
</style>
