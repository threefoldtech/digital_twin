<template>
  <app-layout>
    <top>
        <Topbar />
    </top>
    <div class="md:grid-cols-12 md:grid relative h-full w-full">
      <div
        class="fixed h-screen w-screen bg-black bg-opacity-25 top-0 left-0 md:hidden transition-all z-20"
        :class="{ hidden: !showLeftSidebar }"
        @click="showLeftSidebar = false"
      ></div>
      <aside
        class="fixed md:static md:col-span-3 flex flex-col md:bg-transparent bg-white rounded-r-lg shadow md:shadow-none h-screen md:h-auto top-0 left-0 z-30 transition-all"
        :class="{ '-left-full': !showLeftSidebar }"
      >
        <div class="flex m-2 mt-5">
          <button @click="showLeftSidebar = false" class="md:hidden">
            <i class="fas fa-chevron-left"></i>
          </button>
          <h1>Chats</h1>
        </div>
        <div class="flex items-center mb-2 px-2 md:px-0">
          <button class="h-10 rounded-full" @click="showDialog = true">
            <i class="fas fa-plus"></i><span> New Chat </span>
          </button>
        </div>

        <div v-if="filteredChatRequests.length > 0">
          <h2 style="font-size: 1.5em">
            You have
            <span style="color: red"> {{ filteredChatRequests.length }} </span>
            new connection request<span v-if="filteredChatRequests.length > 1"
              >s</span
            >
          </h2>
          <ChatRequestList :chat-requests="filteredChatRequests" />
        </div>
      </aside>
      <main
        class="md:col-span-6 grid place-items-center w-full h-full relative"
      >
        <!-- <chat-view
          :class="selectedId ? 'visible' : 'hidden'"
          v-if="selectedId && chats.find((c) => c.chatId === selectedId)"
          :selectedId="selectedId"
          :key="selectedId"
          @showContacts="setSelected(null)"
        ></chat-view> -->
        <div
          class="relative overflow-y-auto w-full max-h-full h-full mt-4"
          :class="!selectedId ? 'visible' : 'hidden'"
          v-if="filteredChats && filteredChats.length"
        >
          <div class="absolute w-full pt-2">
            <ChatCard
              v-for="chat in filteredChats"
              :key="`${chat.chatId}-${chat.messages.length}-${
                chat.read[user.id]
              }`"
              class="grid grid-cols-12 rounded-lg mb-2 py-2 cursor-pointer"
              @click="setSelected(chat.chatId)"
              :chat="chat"
            />
          </div>
        </div>
        <div v-else class="text-center">
          <p>It feels lonely over here :(</p>
          <button
            @click="showDialog = true"
            class="mt-2 border rounded-full px-4"
          >
            Add a contact
          </button>
        </div>
      </main>
      <aside
        class="hidden md:block col-span-3 relative h-full w-full overflow-y-auto flex-col"
        v-if="selectedChat"
      >
        <div class="absolute max-w-full w-full px-4 pb-4" v-if="selectedId">
          <div
            class="bg-white p-2 w-full relative rounded-lg mb-4 mt-0 md:grid place-items-center grid-cols-1 md:px-4"
          >
            <div class="place-items-center grid relative">
              <AvatarImg :id="selectedId" />
              <div
                v-if="!selectedChat.isGroup"
                class="h-3 w-3 bg-gray-300 rounded-full absolute bottom-0 right-0 transition-all"
                :class="{
                  'bg-red-500': status && !status.isOnline,
                  'bg-green-500': status && status.isOnline,
                }"
              ></div>
            </div>
            <h2
              class="my-3 break-words text-center w-full overflow-y-auto max-h-28"
            >
              {{ selectedChat.name }}
            </h2>
            <h4
              class="break-words w-full h-20 overflow-y-auto font-bold text-center"
            >
              {{ status?.status }}
            </h4>
          </div>
          <group-management
            v-if="selectedChat.isGroup"
            :groupChat="selectedChat"
            :key="selectedChat.chatId + selectedChat.contacts.length"
          ></group-management>
        </div>
      </aside>
      <jdialog v-model="showDialog" @close="showDialog = false" noActions>
        <template v-slot:title>
          <h1>Create a new chat</h1>
        </template>
        <add-contact @closeDialog="showDialog = false"> </add-contact>
      </jdialog>
    </div>
  </app-layout>
</template>

<script lang="ts">
import moment from "moment";
import { useSocketActions } from "../../store/socketStore";
import { defineComponent, ref, computed, onBeforeMount } from "vue";
import { usechatsState, usechatsActions } from "../../store/chatStore";
import { useAuthState, useAuthActions } from "../../store/authStore";
import appLayout from "../../layout/AppLayout.vue";
import addContact from "../../components/ContactAdd.vue";
import AvatarImg from "../../components/AvatarImg.vue";
import Dialog from "../../components/Dialog.vue";
// import contactpopup from "../../components/ContactPopup.vue";
import ChatCard from "../../components/ChatCard.vue";
import GroupManagement from "../../components/GroupManagement.vue";
import { startFetchStatusLoop } from "@/store/statusStore";
import { statusList } from "@/store/statusStore";
import ChatRequestList from "@/views/app/ChatRequestList.vue";
import { uniqBy } from "lodash";
import {useRouter} from 'vue-router';

export default defineComponent({
  name: "Apps",
  components: {
    ChatRequestList,
    addContact,
    jdialog: Dialog,
    ChatCard,
    AvatarImg,
    GroupManagement,
    appLayout,
  },
  setup(_, context) {
    const { chats, chatRequests } = usechatsState();
    const { retrievechats } = usechatsActions();
    let selectedId = ref("");
    const status = computed(() => {
      return statusList[selectedId.value];
    });
    const { initializeSocket } = useSocketActions();
    const { user } = useAuthState();

    const m = (val) => moment(val);
    const searchValue = ref("");
    let showDialog = ref(false);
    let showContacts = ref(false);

    const router = useRouter();

    const setSelected = (id) => {
      router.push({name:'single',params:{id}})
      // selectedId.value = id;
      // searchValue.value = "";
      // showContacts.value = false;
      // chats.value.find((c) => c.chatId === selectedId.value);
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

    const selectedChat = computed(() =>
      chats.value.find((chat) => chat.chatId == selectedId.value)
    );

    startFetchStatusLoop(user.id);

    const filteredChatRequests = computed(() => {
      chatRequests.value = chatRequests.value.filter(
        (cr) => !chats.value.find((c) => c.chatId === cr.chatId)
      );
      const filteredChats = chatRequests.value.filter(
        (cr) => !chats.value.find((c) => c.chatId === cr.chatId)
      );
      return uniqBy(filteredChats, (c) => c.chatId);
    });

    return {
      status,
      selectedId,
      selectedChat,
      setSelected,
      chats,
      filteredChatRequests,
      searchValue,
      filteredChats,
      showDialog,
      showContacts,
      user,
      m,
    };
  },
});
</script>

