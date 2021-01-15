<template>
  <div class="grid grid-cols-12">
    <div class="col-span-3 grid grid-rows-6">
      <div>
        <div class="flex mb-4">
          <h1 style="font-size: 1.75em">Chats</h1>
          <button
            class="ml-2 h-10 w-10 rounded-full"
            @click="showDialog = true"
          >
            <i class="fas fa-plus"></i>
          </button>
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
            @click="selected = i"
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
                <span class="font-bold">
                  {{ contact.name }}
                </span>
                <span class="font-thin">
                  {{ m(contact.date).fromNow() }}
                </span>
              </p>
              <p
                class="font-thin text-accent"
                v-if="i % Math.floor(Math.random() * Math.floor(5)) == 0"
              >
                Is typing...
              </p>
              <p class="font-thin" v-else>{{ truncate(contact.message) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="col-span-6 h-full w-full grid grid-rows-6"
      v-if="contacts.length"
    >
      <div class="grid grid-cols-12 bg-white rounded-lg m-4">
        <div class="col-span-2 place-items-center grid">
          <img
            :src="`https://avatars.dicebear.com/4.5/api/avataaars/${encodeURI(
              contacts[selected].name
            )}.svg`"
            alt="User image"
            class="h-12 bg-icon rounded-full"
          />
        </div>
        <div class="col-span-10 py-8">
          <p class="font-bold font">{{ contacts[selected].name }}</p>
          <p class="font-thin">
            Last seen {{ m(contacts[selected].date).fromNow() }}
          </p>
        </div>
      </div>
      <div class="row-span-4 relative overflow-y-auto">
        <div class="absolute w-full px-4">
          <div
            v-for="(message, i) in messages"
            class="my-2 flex"
            :class="{
              'justify-end': isMine(i),
            }"
            :key="i"
          >
            <div class="bg-white p-4 rounded-lg">
              {{ message.message }}
              <p
                class="font-thin"
                :class="{
                  'text-right': isMine(i),
                }"
              >
                {{ m(message.date).fromNow() }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="p4 grid grid-rows-3">
        <span class="mx-6 pt-4 font-thin"
          >{{ contacts[selected].name }} is typing ...</span
        >
        <form
          @submit.prevent="sendMessage"
          class="row-span-2 rounded-xl grid grid-cols-12 h place-items-center bg-white mx-4"
        >
          <span>+</span>
          <input class="col-span-10 w-full h-full pl-4" type="text" v-model="message"/>
          <button class="px-2 py-8" type="submit" value="Send" @click="sendMessage">Send </button>
        </form>
      </div>
    </div>
    <div
      class="col-span-3 relative h-full w-full overflow-y-auto flex flex-col"
    >
      <div class="absolute max-w-full w-full px-4 pb-4">
        <div
          class="bg-white h-96 w-full relative rounded-lg mb-4 mt-0"
          v-for="i in 3"
          :key="i"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { defineComponent, onMounted, ref } from "vue";
import { useMessagesState, useMessagesActions } from "../../store/messageStore";
import { useContactsState, useContactsActions } from "../../store/contactStore";
export default defineComponent({
  name: "Apps",
  setup() {
    const { messages } = useMessagesState();
    const { contacts } = useContactsState();
    const { retrieveMessages } = useMessagesActions();
    const { retrieveContacts } = useContactsActions();

    const m = (val) => moment(val);
    const selected = ref(1);
    const searchValue = ref("");
    const message = ref("");

    const isMine = (i) => {
      return i % 3 == 0;
    };
    const truncate = (value, limit = 40) => {
      if (value.length > limit) {
        value = value.substring(0, limit - 3) + "...";
      }

      return value;
    };
    
    const sendMessage = (e) => {
      message.value = ""
    }

    onMounted(retrieveMessages);
    onMounted(retrieveContacts);

    return {
      selected,
      messages,
      contacts,
      truncate,
      sendMessage,
      searchValue,
      message,
      isMine,
      m,
    };
  },
});
</script>

<style scoped>
</style>