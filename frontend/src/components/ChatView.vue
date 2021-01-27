<template>
  <div class="grid grid-cols-12 bg-white rounded-lg mx-4">
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
        <span v-if="contacts[selected].isOnline">Is online</span>
        <span v-else>
          Last seen {{ m(contacts[selected].lastSeen).fromNow() }}
        </span>
      </p>
    </div>
  </div>
  <div class="row-span-4 relative overflow-y-auto" ref="messageBox">
    <div class="absolute w-full px-4">
      <div
        v-for="(message, i) in messages[contacts[selected].name]"
        class="my-2 flex"
        :class="{
          'justify-end': isMine(message),
        }"
        :key="i"
      >
        <div class="bg-white p-4 rounded-lg truncate">
          {{ message.body }}
          <p
            class="font-thin"
            :class="{
              'text-right': isMine(message),
            }"
          >
            {{ m(message.timeStamp).fromNow() }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="p4 grid grid-rows-3">
    <p class="mx-6 pt-4 font-thin">
      <span v-if="contacts[selected].istyping"
        >{{ contacts[selected].name }} is typing ...
      </span>
    </p>
    <form
      @submit.prevent="messageSend"
      class="row-span-2 rounded-xl grid grid-cols-12 h place-items-center bg-white mx-4"
    >
      <span>+</span>
      <input
        class="col-span-10 w-full h-full pl-4"
        type="text"
        v-model="message"
      />
      <button class="px-2 py-8" type="submit" value="Send">Send</button>
    </form>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { defineComponent, onMounted, watch, ref, toRefs, nextTick } from "vue";
import { useMessagesState, useMessagesActions } from "../store/messageStore";
import { useContactsState } from "../store/contactStore";
import { useAuthState } from "../store/authStore";

export default defineComponent({
  name: "ChatView",
  props: {
    selected: Number,
  },
  setup(props) {
    const { messages } = useMessagesState();
    const { sendMessage } = useMessagesActions();
    const { user } = useAuthState();
    const { contacts } = useContactsState();
    const m = (val) => moment(val);
    const messageBox = ref(null);

    const propRefs = toRefs(props);

    console.log("messages in chatview", messages);

    const isMine = (message) => {
      return message.from == user.name;
    };
    const truncate = (value, limit = 20) => {
      if (value.length > limit) {
        value = value.substring(0, limit - 3) + "...";
      }
      return value;
    };

    const scrollToBottom = () => {
      messageBox.value.scrollTop = messageBox.value.scrollHeight;
    };

    const message = ref("");
    const messageSend = (e) => {
      if (message.value == "") {
        return;
      }
      sendMessage(contacts.value[props.selected].name, message.value);
      message.value = "";
      nextTick(() => {
        scrollToBottom();
      });
    };

    onMounted(()=>{
      scrollToBottom()
    })

    return {
      messages,
      truncate,
      messageSend,
      message,
      isMine,
      contacts,
      m,
      messageBox,
      ...propRefs,
    };
  },
});
</script>

<style scoped>
</style>