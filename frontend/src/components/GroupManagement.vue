<template>
  <div
    class="bg-white p-2 w-full relative rounded-lg mb-4 mt-0 md:grid place-items-center grid-cols-1"
  >
    <div v-for="contact in groupChat.contacts" :key="contact.id + groupChat.contacts.length">
      <div class="chatcard relative grid grid-cols-12 rounded-lg mb-2 py-2">
        <div class="md:col-span-2 col-span-3 place-items-center grid relative">
          <AvatarImg :id="contact.id" />
          <div
            class="h-3 w-3 bg-gray-300 rounded-full absolute bottom-0 right-2 transition-all"
            :class="{
              'bg-red-500': status && status[contact.id],
              'bg-green-500': status && status[contact.id],
            }"
          ></div>
        </div>
        <div class="md:col-span-9 col-span-8 pl-2">
          <p class="flex place-content-between">
            <span class="font-bold">
              {{ contact.id }}
            </span>
          </p>
        </div>
        <button @click="removeFromGroup(contact)" > <i class="fas fa-times text-red-500"></i></button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed } from "vue";
import { statusList } from "@/store/statusStore";
import { GroupChat } from "../types/index";
import AvatarImg from "@/components/AvatarImg.vue"
import { usechatsActions } from "../store/chatStore"
export default {
  name: "GroupManagementBlock",
  props: {
    groupChat: { required: true },
  },
  components: {AvatarImg},
  setup(props) {
    const removeFromGroup = (contact) => {
      const {updateContactsInGroup} = usechatsActions()
      //@ts-ignore
      updateContactsInGroup(props.groupChat.chatId, contact, true )
    }
    return {
      groupChat: props.groupChat,
      status: statusList,
      removeFromGroup
    };
  },
};
</script>
