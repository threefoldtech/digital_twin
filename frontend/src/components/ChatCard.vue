<template>
  <div class="chatcard grid grid-cols-12 rounded-lg mb-2 py-2">

    <div class="md:col-span-2 col-span-3 place-items-center grid">
      <img
          :src="`https://avatars.dicebear.com/4.5/api/avataaars/${encodeURI(
                  chat.chatId
                )}.svg`"
          alt="User image"
          class="h-12 w-12 bg-icon rounded-full"
      />
    </div>
    <div class="md:col-span-10 col-span-9 pl-2">
      <p class="flex place-content-between">
                <span class="font-bold">
                  {{ chat.chatId }}
                </span>
        <span class="font-thin" v-if="chat.lastMessage">
                  {{ m(chat.lastMessage.timeStamp).fromNow() }}
                </span>
      </p>
      <p class="font-thin truncate" v-if="status">{{ status.isOnline ? "Is online" : "Is offline" }}</p>
      <p class="font-thin truncate" v-if="status && status.status">{{ status.status }}</p>
      <p class="font-thin truncate" v-if="newMessages >= 1">
        new messages: {{ newMessages }}
      </p>
      <p class="font-thin truncate" v-else>No new chats yet</p>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, ref,
} from "vue";
import {fetchStatus} from "@/store/statusStore";
import {findLastIndex} from "lodash";
import {useAuthState} from "@/store/authStore";
import {Message, MessageBodyType} from "@/types";


export default defineComponent({
  name: "ChatCard",
  props: {
    chat: Object
  },
  setup(props) {
    const status = ref({})

    setInterval(async () => {
      status.value = await fetchStatus(props.chat.chatId);
    }, 5000)


    const {user} = useAuthState();

    const lastReadByMe = computed(() => {
      let lastReadMessage = props.chat.read[<string>user.id];
      return findLastIndex(props.chat.messages, (message: Message<MessageBodyType>) => lastReadMessage === message.id)
    })

    const newMessages = computed(() => {
      return props.chat.messages.length - lastReadByMe.value - 1
    })

    return {status, newMessages, lastReadByMe}
  },
});
</script>

<style scoped>
</style>
