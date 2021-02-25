<template>
  <div class="flex flex-col justify-between items-center bg-green-400" v-if="message">
    <div class="w-3/4 bg-blue-500">
      <h1>{{ message.body.title }}</h1>
      <div class="overflow-x-auto">
      </div>
    </div>
    <main class=" w-3/4 bg-yellow-300">
      <div>{{ message.body.content }}</div>
      <div class="comments bg-pink-300">
        <div v-if="message.replys.length === 0">
          Be the first to comment
        </div>
        <div class="reply" :key="reply.id" v-for="reply in message.replys">
         {{reply.from}} said : {{reply.body}}
        </div>
      </div>

      <div class="comment-input">
        <form @submit.prevent="onSubmitComment">
            <input type="text" v-model="commentInput">
          <input type="submit" value="Post">
        </form>
      </div>
    </main>

  </div>
  <template v-else>
    loading ...
  </template>
</template>

<script lang="ts">
import axios from "axios";
import config from "../../../public/config/config";
import {defineComponent, onBeforeMount, ref} from "vue";

import {useRoute} from 'vue-router';
import MessageCard from "@/components/MessageCard.vue";
import ChatInput from "@/components/ChatInput.vue";
import {useAuthState} from "@/store/authStore";
import {Message, StringMessageType} from "@/types";
import {uuidv4} from "@/common";
import {sendMessageObject} from "@/store/chatStore";
import {initializeSocket, sendSocketMessage} from "@/store/socketStore";


const submitComment = (body, postId, chatId) => {
  const {user} = useAuthState();
  const newMessage: Message<StringMessageType> = {
    id: uuidv4(),
    from: user.id,
    to: chatId,
    body: <StringMessageType>body,
    timeStamp: new Date(),
    type: "STRING",
    replys: [],
    subject: postId,
  };
  // sendMessageObject(chatId, newMessage);

  sendSocketMessage(chatId, newMessage);
}

export default defineComponent({
  name: "Apps",
  components: {
    ChatInput,
    MessageCard
  },
  setup: function (_, context) {
    const message = ref()
    const commentInput = ref()

    const route = useRoute();
    const chatId = route.params.chatid
    const postId = route.params.postid
    //@TODO fix this
    onBeforeMount(() => {
      const {user} = useAuthState()

      initializeSocket();
    });
    onBeforeMount(async () => {
      const res = await axios.get(`${config.baseUrl}api/messages/${chatId}/${postId}`)
      message.value = res.data
    })

    const onSubmitComment = () => {
      submitComment(commentInput.value, postId, chatId)
    }

    return {
      message,
      onSubmitComment,
      chatId,
      postId,
      commentInput,
    };
  },
});
</script>

