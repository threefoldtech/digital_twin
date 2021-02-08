<template>
  <div
    class="bg-white p-2 w-full h-52 relative rounded-lg mb-4 mt-0 md:grid place-items-center grid-cols-1"
  >
     <div v-for="contact in groupChat.contacts" :key="contact.id">
     <div class="chatcard relative grid grid-cols-12 rounded-lg mb-2 py-2">
        <div class="md:col-span-2 col-span-3 place-items-center grid relative">
          <AvatarImg :id="contact.id" />
          <div
            class="h-3 w-3 bg-gray-300 rounded-full absolute bottom-0 right-2 transition-all"
            :class="{
              'bg-red-500': status && !status.isOnline,
              'bg-green-500': status && status.isOnline,
            }"
          ></div>
        </div>
        <div class="md:col-span-10 col-span-9 pl-2">
          <p class="flex place-content-between">
            <span class="font-bold">
              {{ contact.id }}
            </span>
          </p>
        </div>
      </div>
    </div> 
  </div>
</template>
<script lang="ts">
import { computed } from "vue";
import { statusList } from "@/store/statusStore";
import { GroupChat } from "../types/index";
export default {
  name: "GroupManagementBlock",
  props: {
    groupChat: { required: true},
  },
  setup(props) {
    const status = computed(() => {
      //@ts-ignore
      return statusList[props.groupChat.chatId];
    });
    console.log(props.groupChat)
    return {
      groupChat: props.groupChat,
      status,
    };
  },
};
</script>
