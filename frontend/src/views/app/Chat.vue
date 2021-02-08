<template>
  <div class="md:grid-cols-12 md:grid relative h-full w-full">
    <div class="fixed h-screen w-screen bg-black bg-opacity-25 top-0 left-0 md:hidden transition-all z-20"
         :class="{'hidden': !showContacts}" @click="showContacts = false"></div>
    <div
        class="fixed md:static md:col-span-3 flex flex-col md:bg-transparent bg-white rounded-r-lg shadow md:shadow-none h-screen md:h-auto top-0 left-0 z-30 transition-all"
        :class="{'-left-full' : !showContacts}">
      <div>
        <div class="flex m-2 mt-5">
          <button @click="showContacts = false" class="md:hidden">
            <i class="fas fa-chevron-left"></i>
          </button>
          <h1>Chats</h1>
        </div>
        <div class="flex items-center mb-2">
          <button class="h-10 rounded-full" @click="showDialog = true">
            <i class="fas fa-plus"></i><span> New Chat </span>
          </button>
        </div>

        <div v-if="chatRequests.length > 0">
          <h2 style="font-size: 1.5em">
            You have
            <span style="color: red"> {{ chatRequests.length }} </span>
            new connection request<span v-if="chatRequests.length > 1"
          >s</span
          >
          </h2>
          <div v-for="(chat, i) in chatRequests" :key="i">
            <div class="grid grid-cols-12 w-full rounded-lg mb-2 py-2">
              <span v-if="chat.isGroup" class="truncate col-span-8">
                {{chat.admin}} invited you to {{ chat.name }}
              </span>
              <span v-else class="truncate col-span-8">
                <b>{{ chat.name }}</b> wants to have a chat
              </span>
              <button
                  class="col-span-4"
                  @click="acceptChatRequest(chat.chatId)"
              >
                Accept Chat
              </button>
            </div>
          </div>
        </div>
        <div class="relative full">
          <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="text-gray-500 fas fa-search"></i>
          </div>
          <input
              type="text"
              placeholder="Search..."
              class="w-full pl-12 py-3 sm:text-sm rounded-full bg-white"
              v-model="searchValue"
          />
        </div>
      </div>
      <div class="relative overflow-y-auto w-full max-h-full h-full mt-4">
        <div class="absolute w-full px-2 pt-2">
          <ChatCard
              v-for="chat in filteredChats"
              :key="`${chat.chatId}-${chat.messages.length}-${chat.read[user.id]}`"
              class="grid grid-cols-12 rounded-lg mb-2 py-2"
              :class="{
              'bg-white': chat.chatId !== selectedId,
              'bg-icon': chat.chatId === selectedId,
            }"
              @click="setSelected(chat.chatId)"
              :chat="chat"
          />
        </div>
      </div>
    </div>

    <div class="md:col-span-6 w-full h-full relative">
      <chat-view v-if="selectedId" :selectedId="selectedId" @showContacts="showContacts=true"></chat-view>
      <div v-else class="text-center">
        <p>
          It feels lonely over here :(
        </p>
        <button  @click="showDialog = true" class="mt-2 border rounded-full px-4">Add a contact</button>
      </div>
    </div>

    <div
        class="hidden md:block col-span-3 relative h-full w-full overflow-y-auto flex-col"
    >
      <div class="absolute max-w-full w-full px-4 pb-4">
        <div
            class="bg-white h-52 w-full relative rounded-lg mb-4 mt-0 hidden md:block"
            v-for="i in 3"
            :key="i"
        ></div>
      </div>
    </div>
    <jdialog v-model="showDialog" @close="showDialog = false" noActions>
      <template v-slot:title>
        <h1>New chat</h1>
      </template>
      <add-contact @closeDialog="showDialog = false">
      </add-contact>
    </jdialog>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import {useSocketActions} from "../../store/socketStore";
import { defineComponent, ref, computed, onBeforeMount } from "vue";
import { usechatsState, usechatsActions } from "../../store/chatStore";
import { useContactsState, useContactsActions } from "../../store/contactStore";
import { useAuthState, useAuthActions } from "../../store/authStore";
import addContact from "../../components/ContactAdd.vue";
import chatView from "../../components/ChatView.vue";
import Dialog from "../../components/Dialog.vue";
// import contactpopup from "../../components/ContactPopup.vue";
import ChatCard from "../../components/ChatCard.vue";
import config from "../../../public/config/config"
import axios from "axios"

export default defineComponent({
  name: "Apps",
  components: {addContact, chatView, jdialog: Dialog, ChatCard},
  setup(_, context) {
    const { chats, chatRequests } = usechatsState();
    const { updateUserInfo } = useAuthActions();
    const { retrievechats } = usechatsActions();
    const {
      retrieveContacts,
      // moveConnectionRequestToContacts,
    } = useContactsActions();
    const {initializeSocket} = useSocketActions();
    const {user} = useAuthState();

    const m = (val) => moment(val);
    const searchValue = ref("");
    let showDialog = ref(false);
    let showContacts = ref(false);

    let selectedId = ref("");
    const setSelected = (id) => {
      selectedId.value = id;
      console.log(id);
      console.log(chats.value);
      searchValue.value = "";
      showContacts.value = false
      chats.value.find((c) => c.chatId === selectedId.value);
    };

    const filteredChats = computed(() => {
      if (searchValue.value == "") {
        return chats.value;
      }
      console.log("filtered", chats.value)
      return chats.value.filter((c) =>
          c.name.toLowerCase().includes(searchValue.value.toLowerCase())
      );
    });
    onBeforeMount(() => {
      initializeSocket(user.id.toString());
    });
    onBeforeMount(retrievechats);
    onBeforeMount(() => {
      retrieveContacts().then(() => {
        selectedId.value = <string>chats.value[0].chatId;
      });
    });

    const acceptChatRequest = (id) => {
      const {acceptChat} = usechatsActions()
      acceptChat(id);
      console.log("TODO here",id);
    };

    return {
      selectedId,
      setSelected,
      chats,
      chatRequests,
      searchValue,
      filteredChats,
      showDialog,
      showContacts,
      user,
      acceptChatRequest,
      m,
    };
  },
});
</script>

<style scoped>
</style>
