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
      <div class="col-span-6 py-4 pl-2">
        <p class="font-bold font">{{ chat.name }}</p>
        <p class="font-thin">{{ statusList[chat.chatId]?.isOnline ? "Is online" : "Is offline" }}</p>
        <!-- <p class="font-thin">
          <span v-if=".isOnline">Is online</span>
          <span v-else> Last seen {{ m(contact.lastSeen).fromNow() }} </span>
        </p> -->
      </div>
      <div class="col-span-3 py-4 pl-2">
        <button @click="popupMeeting">goto video</button>
      </div>
    </div>
    <div class="flex-grow row-span-4 relative overflow-y-auto" ref="messageBox">
      <div class="absolute w-full px-4">
        <MessageCard v-for="(message, i) in chat.messages"
                     :key="i"
                     :isread="i <= lastRead"
                     :isreadbyme="i <= lastReadByMe"
                     :message="message"
                     :chatId="chat.chatId"
        />
      </div>
    </div>

    <ChatInput :selectedid="chat.chatId" v-on:messageSend="scrollToBottom"/>
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
import {findLastIndex} from 'lodash'

import {statusList} from "@/store/statusStore"
import {usechatsState, usechatsActions} from "../store/chatStore";
import {useContactsState} from "../store/contactStore";
import {useAuthState} from "../store/authStore";
import {Contact} from "../types/index";
import MessageCard from "@/components/MessageCard.vue";
import ChatInput from "@/components/ChatInput.vue";
import {popupCenter} from "@/services/popupService";
import * as crypto from "crypto-js";


export default defineComponent({
  name: "ChatView",
  components: {ChatInput, MessageCard},
  props: {
    selectedId: String,
  },
  setup(props) {
    const {chats} = usechatsState();
    const {sendMessage, sendFile} = usechatsActions();
    const {user} = useAuthState();
    const {contacts} = useContactsState();
    const m = (val) => moment(val);
    const messageBox = ref(null);
    const file = ref();

    const propRefs = toRefs(props);

    const lastRead = computed(() => {
      console.log(chat.value)
      let id = <string>user.id;
      //@ts-ignore
      const { [id]: _, ...read } = chat.value.read;

      const reads = Object.values(read)

      console.log(reads)

      return findLastIndex(chat.value.messages, (message) => reads.includes(<string>message.id))
    })

    const lastReadByMe = computed(() => {
      console.log(chat.value)
      return findLastIndex(chat.value.messages, (message) => chat.value.read[<string>user.id] === message.id)
    })

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

    // @todo: fix so that properly scrools to bottom
    const scrollToBottom = () => {
      nextTick(
          () => {
            messageBox.value.scrollTop = messageBox.value.scrollHeight;
          }
      )
    };

    const message = ref("");

    const chat = computed(() => {
      return chats.value.find((c) => c.chatId == props.selectedId);
    });

    onMounted(() => {
      scrollToBottom()
    });

    const popupMeeting = () => {

      // @ts-ignore
      const str = chat?.contacts ? chat.id : [user.id, chat.id].sort().join();

      const ID = crypto.SHA1(str)
      popupCenter('https://meetings.jimber.org/room/' + ID, "Threefold login", 800, 550)
    }

    return {
      chats,
      chat,
      truncate,
      message,
      file,
      isMine,
      m,
      messageBox,
      scrollToBottom,
      statusList,
      popupMeeting,
      lastRead,
      lastReadByMe,
      ...propRefs,
    };
  },
});
</script>

