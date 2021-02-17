<template>
  <div class="flex flex-col justify-between items-center bg-green-400">
    <div class="w-3/4 bg-blue-500">
      <h1>Trending today</h1>
      <div class="overflow-x-auto">
        <ChatCard v-for="(forum, i) in filteredForums" :key="i" :chat="forum" @click="selectedForumId = forum.chatId" class="cursor-pointer"> </ChatCard>
      </div>
    </div>
    <main v-if="selectedForum" class=" w-3/4 bg-pink-500">

      <MessageCard
              v-for="(message, i) in selectedForum.messages"
              :key="i"
              isread
              isreadbyme
              :message="message"
              :chatId="selectedForum.chatId"
              isGroup=false
              isMine=false
          />
    </main>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { useSocketActions } from "../../store/socketStore";
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

    const selectedForum = computed(() =>{
      return chats.value.find(c => c.chatId == selectedForumId.value)
    })

    return {
      status,
      filteredForums,
      selectedForumId,
      selectedForum,
      m,
    };
  },
});
</script>

