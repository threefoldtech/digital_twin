<template>
  <div class="relative h-full w-full flex flex-col">
    <div class="grid bg-white grid-cols-12 rounded-lg shadow z-10">
      <button @click="$emit('showContacts')" class="md:hidden">
        <i class="fas fa-chevron-left"></i>
      </button>
      <div class="col-span-2 place-items-center grid">
        <AvatarImg :id="chat.chatId"></AvatarImg>
      </div>
      <div class="col-span-6 py-4 pl-2">
        <p class="font-bold font">{{ chat.name }}</p>
        <p class="font-thin" v-if="!chat.isGroup">{{
            statusList[chat.chatId]?.isOnline ? "Is online" : "Is offline"
          }}</p>
        <p class="font-thin" v-if="chat.isGroup">Group chat</p>
        <!-- <p class="font-thin">
          <span v-if=".isOnline">Is online</span>
          <span v-else> Last seen {{ m(contact.lastSeen).fromNow() }} </span>
        </p> -->
      </div>
      <div class="col-end-13 pr-2 flex justify-end">
        <button @click="deleteChat" class="text-red-600">Delete</button>
        <button @click="blockChat" class="text-red-600">Block</button>

        <button @click="popupMeeting" class="flex flex-col items-center justify-center">
          <i class="fas fa-video"></i>
        </button>
      </div>
    </div>
    <div class="flex-grow row-span-4 relative overflow-y-auto" ref="messageBox">
      <div class="absolute w-full px-4">
        <template v-for="(message, i) in chat.messages" :key="i">
          <div
              v-if="showDivider(message, i)"
              class="text-center px-4"
          >
                    <span
                        class="font-thin"
                    >
                      {{ m(message.timeStamp).fromNow() }}
                    </span>
          </div>
          <MessageCard

              :isread="i <= lastRead"
              :isreadbyme="i <= lastReadByMe"
              :message="message"
              :chatId="chat.chatId"
              :isGroup="chat.isGroup"
              :isMine="message.from === user.id"
          />
          <span class="font-thin" v-if="reads[message.id]">
            <template v-if="!chat.isGroup || reads[message.id].length === 1">read by {{ reads[message.id][0] }}</template>
            <template v-else-if="reads[message.id].length === 2">read by {{reads[message.id][0]}} and {{ reads[message.id][1] }}</template>
            <template v-else>read by {{reads[message.id][0]}}, {{ reads[message.id][1] }} and {{reads[message.id].length -2}} others</template>
          </span>

        </template>

        <div id="viewAnchor" ref="viewAnchor" style="
    height: 20vh;
    position: absolute;
    bottom: 0;
    width: 50%;
    pointer-events: none;
"></div>
      </div>
    </div>

    <ChatInput class="chatInput" :selectedid="chat.chatId" v-on:messageSend="scrollToBottom"/>
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
import {findLastIndex, each} from 'lodash'

import {statusList} from "@/store/statusStore"
import {usechatsState, usechatsActions} from "../store/chatStore";
import {useContactsState} from "../store/contactStore";
import {useAuthState} from "../store/authStore";
import {Contact} from "../types/index";
import MessageCard from "@/components/MessageCard.vue";
import ChatInput from "@/components/ChatInput.vue";
import {popupCenter} from "@/services/popupService";
import * as crypto from "crypto-js";
import AvatarImg from "@/components/AvatarImg.vue";
import {sendBlockChat, sendRemoveChat} from "@/store/socketStore";


export default defineComponent({
  name: "ChatView",
  components: {AvatarImg, ChatInput, MessageCard},
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
      const {[id]: _, ...read} = chat.value.read;

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
      sendMessage(chat.value.chatId, `${user.id} joined the video chat`, 'SYSTEM');

      // @ts-ignore
      // const str = chat?.contacts ? chat.id : [user.id, chat.id].sort().join();
      const str: string = chat.value.isGroup ? chat.value.chatId : chat.value.contacts.map(c => c.id).sort().join();

      console.log(`str = ${str}`)

      const ID = crypto.SHA1(str)
      popupCenter('https://freeflowconnect.threefold.me/room/' + ID, "video chat", 800, 550)
    }

    const deleteChat = () => {
      sendRemoveChat(chat.value.chatId)
    }

    const blockChat = () => {
      // @ts-ignore
      const confirmed = confirm(`do you really want do block ${chat?.name}?`);
      if (confirmed == true) {
        sendBlockChat(chat.value.chatId)
      }
    }

    const showDivider = (message, index) => {
      const previousMessage = chat.value.messages[index - 1];
      if (!previousMessage) {
        return true;
      }
      const time = moment(message.timeStamp);

      return time.diff(previousMessage.timeStamp, "m") > 5;
    }

    const reads = computed(()=>{
      const preReads = {}
      each( chat.value.read, ( val:string, key:string ) => {
        console.log( key, val );
        if (key === user.id){
          return;
        }
        preReads[val] = preReads[val] ? [key, ...preReads[val]] : [key]
      } );
      return preReads
    })
    //@TODO fix this
    // @ts-ignore
    watch(chat.value.messages, ()=>{
      console.log("inwatch")
      scrollToBottom()
    })

    const viewAnchor = ref(null)
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
      deleteChat,
      blockChat,
      user,
      viewAnchor,
      showDivider,
      reads,
      ...propRefs,
    };
  },
});
</script>

