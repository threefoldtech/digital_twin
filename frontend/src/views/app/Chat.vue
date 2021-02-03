<template>
  <div class="grid grid-cols-12">
    <div class="col-span-3 flex flex-col">
      <div>
        <div class="flex mb-2">
          <h1 style="font-size: 1.75em">Chats</h1>
        </div>
        <div class="flex items-center mb-2">
          <button class="h-10 rounded-full" @click="showDialog = true">
            <i class="fas fa-plus"></i><span> New Chat </span>
          </button>
        </div>

        <div v-if="connectionRequests.length > 0">
          <h2 style="font-size: 1.5em">
            You have
            <span style="color: red"> {{ connectionRequests.length }} </span>
            new connection request<span v-if="connectionRequests.length > 1"
              >s</span
            >
          </h2>
          <div v-for="(connRequest, i) in connectionRequests" :key="i">
            <div class="grid grid-cols-12 w-full rounded-lg mb-2 py-2">
              <span class="truncate col-span-8">{{
                connRequest.username
              }}</span>
              <button
                class="col-span-4"
                @click="addConnectionRequestToContacts(connRequest.id)"
              >
                Add to contacts
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
        <div class="absolute w-full px-2">
          <div
            v-for="(chat, i) in filteredChats"
            :key="i"
            class="grid grid-cols-12 rounded-lg mb-2 py-2"
            :class="{
              'bg-white': chat.chatId !== selectedId,
              'bg-icon': chat.chatId === selectedId,
            }"
            @click="setSelected(chat.chatId)"
          >
            <div class="col-span-2 place-items-center grid">
              <img
                :src="`https://avatars.dicebear.com/4.5/api/avataaars/${encodeURI(
                  chat.chatId
                )}.svg`"
                alt="User image"
                class="h-12 bg-icon rounded-full"
              />
            </div>
            <div class="col-span-10 pr-4">
              <p class="flex place-content-between">
                <span class="font-bold">
                  {{ chat.chatId }}
                </span>
                <span class="font-thin" v-if="chat.lastMessage">
                  {{ m(chat.lastMessage.timeStamp).fromNow() }}
                </span>
              </p>
              <p class="font-thin truncate" v-if="chat.lastMessage">
                {{ chat.lastMessage.body }}
              </p>
              <p class="font-thin" v-else>No chats yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-6 h-full w-full grid grid-rows-6">
      <chat-view v-if="selectedId" :selectedId="selectedId"></chat-view>
      <div v-else class="text-center">
        It feels lonely over here :( <br />
        Use the top left button <b>Add a contact</b> to add a contact
      </div>
    </div>

    <div
      class="col-span-3 relative h-full w-full overflow-y-auto flex flex-col"
    >
      <div class="absolute max-w-full w-full px-4 pb-4">
        <div
          class="bg-white h-52 w-full relative rounded-lg mb-4 mt-0"
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
import { defineComponent, ref, computed, onBeforeMount } from "vue";
import { usechatsState, usechatsActions } from "../../store/chatStore";
import { useContactsState, useContactsActions } from "../../store/contactStore";
import { useAuthState } from "../../store/authStore";
import { useSocketActions } from "../../store/socketStore";
import addContact from "../../components/ContactAdd.vue";
import chatView from "../../components/ChatView.vue";
import Dialog from "../../components/Dialog.vue";
// import contactpopup from "../../components/ContactPopup.vue";

export default defineComponent({
  name: "Apps",
  components: { addContact, chatView, jdialog: Dialog },
  setup(_, context) {
    const { chats } = usechatsState();
    const { connectionRequests } = useContactsState();
    const { retrievechats } = usechatsActions();
    const {
      retrieveContacts,
      moveConnectionRequestToContacts,
    } = useContactsActions();
    const { initializeSocket } = useSocketActions();
    const { user } = useAuthState();

    const m = (val) => moment(val);
    const searchValue = ref("");
    let showDialog = ref(false);

    let selectedId = ref("");
    const setSelected = (id) => {
      selectedId.value = id;
      console.log(id);
      console.log(chats.value);
      searchValue.value = "";
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

    const addConnectionRequestToContacts = (id) => {
      moveConnectionRequestToContacts(id);
      console.log(id);
    };
    return {
      selectedId,
      setSelected,
      chats,
      // contacts,
      connectionRequests,
      addConnectionRequestToContacts,
      searchValue,
      filteredChats,
      showDialog,
      m,
    };
  },
});
</script>

<style scoped>
</style>
