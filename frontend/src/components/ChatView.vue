<template>
  <div class="relative h-full w-full flex flex-col">
    <div class="grid grid-cols-12 bg-white rounded-lg shadow z-10">
      <button @click="$emit('showContacts')" class="md:hidden">
        <i class="fas fa-chevron-left"></i>
      </button>
      <div class="col-span-2 place-items-center grid">
        <img
          :src="`https://avatars.dicebear.com/4.5/api/avataaars/${encodeURI(
            chat.name
          )}.svg`"
          alt="User image"
          class="h-12 bg-icon rounded-full"
        />
      </div>
      <div class="col-span-9 py-4 pl-2">
        <p class="font-bold font">{{ chat.name }}</p>
        <p class="font-thin">Is online</p>
        <!-- <p class="font-thin">
          <span v-if=".isOnline">Is online</span>
          <span v-else> Last seen {{ m(contact.lastSeen).fromNow() }} </span>
        </p> -->
      </div>
    </div>
    <div class="flex-grow row-span-4 relative overflow-y-auto" ref="messageBox">
      <div class="absolute w-full px-4">
        <MessageCard v-for="(message, i) in chat.messages"
                     :key="i"
                     :message="message" />
      </div>
    </div>

    <div class="p4 flex flex-col">
      <p class="mx-6 pt-4 font-thin">
        <!-- <span v-if="contact.istyping"
        >{{ contact.name }} is typing ...
      </span> -->
      </p>
      <form
        @submit.prevent="chatsend"
        class="flex rounded-xl h place-items-center bg-white mx-4"
      >
        <!-- <button class="px-2 py-8" type="submit" value="Send">
          <i class="fas fa-paperclip text-gray-500 transform" style="--tw-rotate: -225deg;"></i>
        </button> -->
        <label class="col-span-4"
          >File <br />
          <input type="file" id="file" ref="file" />
        </label>
        <input
          class="col-span-6 w-full h-full pl-4"
          type="text"
          v-model="message"
        />
        <button class="px-2 py-8" type="submit">
          <i class="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import {
  defineComponent,
  onMounted,
  watch,
  ref,
  toRefs,
  nextTick,
  computed,
} from "vue";
import { usechatsState, usechatsActions } from "../store/chatStore";
import { useContactsState } from "../store/contactStore";
import { useAuthState } from "../store/authStore";
import { Contact } from "../types/index";
import MessageCard from "@/components/MessageCard.vue";

export default defineComponent({
  name: "ChatView",
  components: {MessageCard},
  props: {
    selectedId: String,
  },
  setup(props) {
    const { chats } = usechatsState();
    const { sendMessage, sendFile } = usechatsActions();
    const { user } = useAuthState();
    const { contacts } = useContactsState();
    const m = (val) => moment(val);
    const messageBox = ref(null);
    const file = ref();

    const propRefs = toRefs(props);

    console.log("chats in chatview", chats);

    const isMine = (message) => {
      return message.from == user.id;
    };
    const truncate = (value, limit = 20) => {
      if (value.length > limit) {
        value = value.substring(0, limit - 3) + "...";
      }
      return value;
    };

    const scrollToBottom = () => {
      messageBox.value.scrollTop = messageBox.value.scrollHeight;
    };

    const message = ref("");
    const chatsend = (e) => {
      if (message.value != "") {
        sendMessage(props.selectedId, message.value);
        message.value = "";
      }
      if (file.value.files.length > 0) {
        sendFile(props.selectedId, file.value.files[0]);
      }
      nextTick(() => {
        scrollToBottom();
      });
    };

    const chat = computed(() => {
      return chats.value.find((c) => c.chatId == props.selectedId);
    });

    onMounted(() => {
      scrollToBottom();
    });

    return {
      chats,
      chat,
      truncate,
      chatsend,
      message,
      file,
      isMine,
      m,
      messageBox,
      ...propRefs,
    };
  },
});
</script>

<style scoped>
</style>
