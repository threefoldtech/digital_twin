<template>
  <div class="flex flex-col justify-between items-center bg-green-400">
    <div class="w-3/4 bg-blue-500">
      <h1>Forum post</h1>
      <div class="overflow-x-auto">
      </div>
    </div>
    <main class=" w-3/4 bg-yellow-600" v-if="message">
      {{message}}
          get in forum/chatid/messageid the complete message to show
    </main>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import moment from "moment";
import config from "../../../public/config/config";
import { defineComponent, onBeforeMount, ref} from "vue";


export default defineComponent({
  name: "Apps",
  components: {
  },
  setup(_, context) {
    const message = ref()
    onBeforeMount(async ()=>{
      const url = new URL(window.location.href)
      const chatId = url.searchParams.get("chatId")
      const messageId = url.searchParams.get("messageId")
      console.log(chatId)
      console.log(messageId)
      const res = await  axios.get(`${config.baseUrl}api/messages/${chatId}/${messageId}`)
      console.log(res.data)
      message.value = res.data
    })
    return {
      message
    };
  },
});
</script>

