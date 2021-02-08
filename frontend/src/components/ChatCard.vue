<template>
  <div class="chatcard relative grid grid-cols-12 rounded-lg mb-2 py-2">
    <div v-if="newMessages >= 1" class="h-5 w-5 bg-accent rounded-full absolute -top-2 -right-2 transition-all z-10 grid place-items-center text-xs text-white">
      {{ newMessages }}
    </div>
    <div class="md:col-span-2 col-span-3 place-items-center grid relative">
        <img
          :src="`https://avatars.dicebear.com/4.5/api/avataaars/${encodeURI(
            chat.chatId
          )}.svg`"
          alt="User image"
          class="h-12 w-12 bg-icon rounded-full"
        />
        <div class="h-3 w-3 bg-gray-300 rounded-full absolute bottom-0 right-2 transition-all" :class="{'bg-red-500': status && !status.isOnline, 'bg-green-500': status && status.isOnline}"></div>
    </div>
    <div class="md:col-span-10 col-span-9 pl-2">
      <p class="flex place-content-between">
        <span class="font-bold">
          {{ chat.chatId }}
        </span>
        <span class="font-thin pr-2" v-if="lastMessage">
          {{ timeAgo(lastMessage.timeStamp)}}
        </span>
      </p>
      <p class="font-thin truncate">{{lastMessage.body}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { fetchStatus } from "@/store/statusStore";
import { findLastIndex } from "lodash";
import { useAuthState } from "@/store/authStore";
import { Message, MessageBodyType } from "@/types";
import moment from 'moment'

export default defineComponent({
  name: "ChatCard",
  props: {
    chat: Object,
  },
  setup(props) {
    const status = ref({});

    setInterval(async () => {
      status.value = await fetchStatus(props.chat.chatId);
    }, 5000);

    const { user } = useAuthState();

    // TODO: this doesn;t work
    const lastReadByMe = computed(() => {
      let lastReadMessage = props.chat.read[<string>user.id];
      return findLastIndex(
        props.chat.messages,
        (message: Message<MessageBodyType>) => lastReadMessage === message.id
      );
    });
    const lastMessage = computed(() => {
      console.log(props.chat.messages[props.chat.messages.length-1])
      return props.chat && props.chat.messages && props.chat.messages.length? props.chat.messages[props.chat.messages.length-1] : "No messages yet" 
    });
    const newMessages = computed(() => {
      return props.chat.messages.length - lastReadByMe.value - 1;
    });
    const timeAgo = (time) => {
      console.log({time})
      return moment(time).fromNow()
      return props.chat.messages.length - lastReadByMe.value - 1;
    };

    return { status, newMessages, lastReadByMe, lastMessage, timeAgo };
  },
});
</script>

<style scoped>
</style>
