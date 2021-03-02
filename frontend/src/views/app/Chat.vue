<template>
  <app-layout @addUser="showAddUserDialog = true">
    <div class="relative h-full w-full grid md:customgrid">
      <chat-list v-model="showAddUserDialog"/>
      <div class="hidden w-full h-full md:grid place-items-center">
        <div class="flex flex-col mb-12 text-center">
          <p>Select a chat</p>
          <button
            @click="showAddUserDialog = true"
            class="mt-2 border rounded-full py-1 px-3"
          >
            Or start a new conversation
          </button>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script lang="ts">
import appLayout from "../../layout/AppLayout.vue";
import { defineComponent, ref, computed, onBeforeMount } from "vue";
<<<<<<< HEAD
import {usechatsState, usechatsActions, selectedId} from "../../store/chatStore";
import { useContactsState, useContactsActions } from "../../store/contactStore";
import { useAuthState, useAuthActions } from "../../store/authStore";
import addContact from "../../components/ContactAdd.vue";
import chatView from "../../components/ChatView.vue";
import AvatarImg from "../../components/AvatarImg.vue";
import Dialog from "../../components/Dialog.vue";
// import contactpopup from "../../components/ContactPopup.vue";
import ChatCard from "../../components/ChatCard.vue";
import GroupManagement from "../../components/GroupManagement.vue"
import config from "../../../public/config/config";
import axios from "axios";
import { startFetchStatusLoop } from "@/store/statusStore";
import {statusList} from "@/store/statusStore";
import ChatRequestList from "@/views/app/ChatRequestList.vue";
import {uniqBy} from "lodash";
import { Contact } from "../../types";

export default defineComponent({
  name: "Apps",
  components: {ChatRequestList, addContact, chatView, jdialog: Dialog, ChatCard, AvatarImg, GroupManagement },
  setup(_, context) {
    const { chats, chatRequests } = usechatsState();
    const { retrievechats } = usechatsActions();
    let selectedId = ref("");
    const status = computed(() => {
      return statusList[selectedId.value]
    })
    const { initializeSocket } = useSocketActions();
    const { user } = useAuthState();

    const m = (val) => moment(val);
    const searchValue = ref("");
    let showDialog = ref(false);
    let showContacts = ref(false);

    const setSelected = (id) => {
      selectedId.value = id;
      searchValue.value = "";
      showContacts.value = false;
      chats.value.find((c) => c.chatId === selectedId.value);
    };

    const filteredChats = computed(() => {
      if (searchValue.value == "") {
        return chats.value;
      }
      console.log("filtered", chats.value);
      return chats.value.filter((c) =>
        c.name.toLowerCase().includes(searchValue.value.toLowerCase())
      );
    });
    onBeforeMount(() => {
      initializeSocket(user.id.toString());
    });
    onBeforeMount(retrievechats);

    const selectedChat = computed(()=>chats.value.find(chat=> chat.chatId == selectedId.value))

    startFetchStatusLoop(<Contact>{id:user.id, location:window.location.origin});

    const filteredChatRequests = computed(() => {
      chatRequests.value = chatRequests.value.filter(cr => !chats.value.find(c => c.chatId === cr.chatId));
      const filteredChats = chatRequests.value.filter(cr => !chats.value.find(c => c.chatId === cr.chatId));
      return uniqBy(filteredChats, c => c.chatId);
    })

=======
import ChatList from "@/components/ChatList.vue";

export default defineComponent({
  name: "Apps",
  components: {
    appLayout,
    ChatList,
  },
  setup({}, ctx) {
    const showAddUserDialog = ref(false);
>>>>>>> development_messageCard
    return {
      showAddUserDialog,
    };
  },
});
</script>


<style scoped type="text/css">
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  @variants responsive {
    .customgrid {
      grid-template-columns: 400px 1fr;
    }
  }
}
</style>
