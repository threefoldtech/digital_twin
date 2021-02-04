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
      <p class="font-thin truncate">{{status?.isOnline ? "Is online" : "Is offline"}}</p>
      <p class="font-thin truncate" v-if="status.status">{{ status.status }}</p>
      <p class="font-thin truncate" v-if="chat.lastMessage">
        {{ chat.lastMessage.body }}
      </p>
      <p class="font-thin truncate" v-else>No chats yet</p>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref,
} from "vue";
import {fetchStatus} from "@/store/statusStore";


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

    return {status}
  },
});
</script>

<style scoped>
</style>
