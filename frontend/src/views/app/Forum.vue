<template>
  <div class="flex flex-col justify-between items-center bg-green-400">
    <div class="w-3/4 bg-blue-500">
      <h1>Trending today</h1>
      <div class="overflow-x-auto">
        <ChatCard v-for="(forum, i) in filteredForums" :key="i" :chat="forum" @click="selectedForumId = forum.chatId" class="cursor-pointer"> </ChatCard>
      </div>
    </div>
    <main v-if="selectedForum" class=" w-3/4 bg-pink-500">

      <template
          v-for="(message, i) in selectedForum.messages"
      >
        <div class="post bg-gray-200 rounded-lg m-4 overflow-hidden" @click="goToMessage(message.id)">
          <header class="border-b-2 border-blue-300 p-4  bg-pink-300">
            <h1>{{ message.body.title }}</h1>
          </header>
          <main class="p-4">
            {{message.body.content}}
          </main>
          <footer class="p-4 bg-red-300">
            ACTIONS
          </footer>
        </div>

      </template>

    </main>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import {initializeSocket, useSocketActions} from "../../store/socketStore";
import { defineComponent, ref, computed, onBeforeMount } from "vue";
import {
  usechatsState,
  usechatsActions,
  selectedId,
} from "../../store/chatStore";
import { useContactsState, useContactsActions } from "../../store/contactStore";
import { useAuthState, useAuthActions } from "../../store/authStore";
import addContact from "../../components/ContactAdd.vue";
import chatView from "../../components/ChatView.vue";
import AvatarImg from "../../components/AvatarImg.vue";
import Dialog from "../../components/Dialog.vue";
// import contactpopup from "../../components/ContactPopup.vue";
import ChatCard from "../../components/ChatCard.vue";
import GroupManagement from "../../components/GroupManagement.vue";
import config from "../../../public/config/config";
import axios from "axios";
import { startFetchStatusLoop } from "@/store/statusStore";
import { statusList } from "@/store/statusStore";
import ChatRequestList from "@/views/app/ChatRequestList.vue";
import { uniqBy } from "lodash";
import { ChatType } from "@/types";
import MessageCard from "@/components/MessageCard.vue";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "Apps",
  components: {
    ChatRequestList,
    addContact,
    chatView,
    jdialog: Dialog,
    ChatCard,
    AvatarImg,
    GroupManagement,
    MessageCard,
  },
  setup(_, context) {
    const { chats } = usechatsState();
    const { retrievechats } = usechatsActions();
    const m = (val) => moment(val);
    const selectedForumId = ref("")

    const filteredForums = computed(() => {
      const filteredForumsTmp = chats.value.filter(
        (chat) => chat.type === ChatType.FORUM
      );
      return filteredForumsTmp;
    });
    onBeforeMount(retrievechats);
    //@TODO fix this
    onBeforeMount(() => {
      initializeSocket();
    });

    const selectedForum = computed(() =>{
      return chats.value.find(c => c.chatId == selectedForumId.value)
    })
    const router = useRouter();
    const goToMessage = (messageId) => {
      router.push({
        name:"forumPost",
        params: {
            chatid:<string>selectedForum.value.chatId,
            postid:<string>messageId
        },
      })
    }

    return {
      status,
      filteredForums,
      selectedForumId,
      selectedForum,
      goToMessage,
      m,
    };
  },
});
</script>

