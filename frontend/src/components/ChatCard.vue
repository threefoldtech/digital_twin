<template>
  <div class="chatcard relative grid grid-cols-12 rounded-lg mb-2 py-2">
    <div
      v-if="newMessages >= 1"
      class="h-5 w-5 bg-accent rounded-full absolute -top-2 -right-2 transition-all z-10 grid place-items-center text-xs text-white"
    >
      {{ newMessages }}
    </div>
    <div class="md:col-span-2 col-span-3 place-items-center grid relative">
      <AvatarImg :id="chat.chatId" />
      <div
        v-if="!chat.isGroup"
        class="h-3 w-3 bg-gray-300 rounded-full absolute bottom-0 right-2 transition-all"
        :class="{
          'bg-red-500': status && !status.isOnline,
          'bg-green-500': status && status.isOnline,
        }"
      ></div>
    </div>
    <div class="md:col-span-10 col-span-9 pl-2">
      <p class="flex place-content-between">
        <span class="font-bold break-normal overflow-ellipsis overflow-hidden ">
          {{ chat.name }}
        </span>
        <span class="font-thin" v-if="chat.isGroup"> group</span>
        <span class="font-thin pr-2" v-if="lastMessage">
          {{ timeAgo(lastMessage.timeStamp) }}
        </span>
      </p>
      <p class="font-thin truncate">
        {{ lastMessageBody }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { findLastIndex } from "lodash";
import { useAuthState } from "@/store/authStore";
import { Message, MessageBodyType } from "@/types";
import moment from "moment";
import { statusList } from "@/store/statusStore";
import AvatarImg from "@/components/AvatarImg.vue";

export default defineComponent({
  name: "ChatCard",
  components: { AvatarImg },
  props: {
    chat: Object,
  },
  setup(props) {
    const { user } = useAuthState();

    const lastReadByMe = computed(() => {
      let lastReadMessage = props.chat.read[<string>user.id];
      return findLastIndex(
        props.chat.messages,
        (message: Message<MessageBodyType>) => lastReadMessage === message.id
      );
    });
    const lastMessage = computed(() => {
      return props.chat && props.chat.messages && props.chat.messages.length
        ? props.chat.messages[props.chat.messages.length - 1]
        : "No messages yet";
    });
    const newMessages = computed(() => {
      return props.chat.messages.length - lastReadByMe.value - 1;
    });
    const timeAgo = (time) => {
      return moment(time).fromNow();
    };

    const status = computed(() => {
      return statusList[props.chat.chatId].status;
    });

    const lastMessageBody = computed(() => {
      const lstmsg = lastMessage.value
      switch (lstmsg.type) {
        case "GIF":
          return "Gif was sent";
        case "GROUP_UPDATE":
          if(lstmsg.body.type == "REMOVEUSER") return `${lstmsg.body.contact.id } removed from group.`
          if(lstmsg.body.type == "ADDUSER") return `${lstmsg.body.contact.id } added to group.`
        case "QUOTE":
          return lstmsg.body.message
        case "FILE":
          return "File has been uploaded";
        case "DELETE":
        default:
          return lstmsg.body
      }
    });

    return {
      status,
      newMessages,
      lastReadByMe,
      lastMessage,
      lastMessageBody,
      timeAgo,
    };
  },
});
</script>

