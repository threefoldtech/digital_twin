<template>
  <div class="grid grid-cols-12">
    <div class="col-span-3 grid grid-rows-6">
      <div>
        <div class="flex mb-2">
          <h1 style="font-size: 1.75em">Chats</h1>
        </div>
        <div class="flex items-center mb-2">
          <button
            class="h-10 w-10 rounded-full"
            @click="showDialog = true"
          >
            <i class="fas fa-plus"></i> 
          </button><span> Add a contact </span>
        </div>
        <add-contact v-if="showDialog" @closeDialog="showDialog=false"> </add-contact>
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
      <div class="row-span-5 relative overflow-y-auto w-full h-full">
        <div class="absolute w-full px-2">
          <div
            v-for="(contact, i) in contacts"
            :key="i"
            class="grid grid-cols-12 rounded-lg mb-2 py-2"
            :class="{
              'bg-white': i !== selected,
              'bg-icon': i === selected,
            }"
            @click="setSelected(i)"
          >
            <div class="col-span-2 place-items-center grid">
              <img
                :src="`https://avatars.dicebear.com/4.5/api/avataaars/${encodeURI(
                  contact.name
                )}.svg`"
                alt="User image"
                class="h-12 bg-icon rounded-full"
              />
            </div>
            <div class="col-span-10 pr-4">
              <p class="flex place-content-between">
                <span class="font-bold ">
                  {{ contact.name }}
                </span>
                <span class="font-thin" v-if="contact.lastMessage">
                  {{ m(contact.lastMessage.timeStamp).fromNow() }}
                </span>
              </p>
              <p class="font-thin truncate" v-if="contact.lastMessage">
                {{ contact.lastMessage.body }}
              </p>
              <p class="font-thin" v-else>No messages yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="col-span-6 h-full w-full grid grid-rows-6"
      v-if="contacts.length"
    >
    <chat-view :selected="selected"></chat-view>
    </div>
    <div
      class="col-span-3 relative h-full w-full overflow-y-auto flex flex-col"
    >
      <div class="absolute max-w-full w-full px-4 pb-4">
        <div
          class="bg-white h-52 w-full relative rounded-lg mb-4 mt-0"
          v-for="i in 3"
          :key="i"
        >{{selectedId}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { defineComponent, onMounted, ref, computed, inject, watch, onBeforeMount } from "vue";
import { useMessagesState, useMessagesActions } from "../../store/messageStore";
import { useContactsState, useContactsActions } from "../../store/contactStore";
import { useAuthState } from "../../store/authStore";
import { useSocketActions } from "../../store/socketStore";
import addContact from "../../components/ContactAdd.vue"
import chatView from "../../components/ChatView.vue"
// import contactpopup from "../../components/ContactPopup.vue";

export default defineComponent({
  name: "Apps",
  components: {addContact, chatView},
  setup(_, context) {
    const { messages } = useMessagesState();
    const { contacts } = useContactsState();
    const { retrieveMessages } = useMessagesActions();
    const { retrieveContacts } = useContactsActions();
    const { initializeSocket } = useSocketActions();
    const { user } = useAuthState();

    const m = (val) => moment(val);
    const searchValue = ref("");
    let showDialog = ref(false);
    
    let selected = ref(0);
    let selectedId = ref("")
    const setSelected = (i) => {
      selected.value = i
      // @ts-ignore
      selectedId = contacts.value[i].id
    }
    watch(contacts, () => {
      // @ts-ignore
      let index = contacts.value.findIndex((c)=> c.id == selectedId )
      if(index == -1){
        index = 0
      }
      selected.value = index
      
    })

    const truncate = (value, limit = 40) => {
      if (value.length > limit) {
        value = value.substring(0, limit - 3) + "...";
      }
      return value;
    };

    const filteredContacts = computed(() => {
      return contacts;
    });
    onBeforeMount(() => {
      initializeSocket(user.name);
    });
    onBeforeMount(retrieveMessages);
    onBeforeMount(retrieveContacts);

    return {
      selected,
      selectedId,
      setSelected,
      messages,
      contacts,
      truncate,
      searchValue,
      filteredContacts,
      showDialog,
      m,
    };
  },
});
</script>

<style scoped>
</style>