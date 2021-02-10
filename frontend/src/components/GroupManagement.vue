<template>
  <div
    class="bg-white p-2 w-full relative rounded-lg mb-4 mt-0 md:grid place-items-center grid-cols-1"
  >
    <h2>Members</h2>
    <div
      v-for="contact in groupChat.contacts"
      :key="contact.id + groupChat.contacts.length"
    >
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
        <button v-if="iAmAdmin" @click="removeFromGroup(contact)">
          <i class="fas fa-times text-red-500"></i>
        </button>
      </div>
    </div>

    <div
      class="flex flex-col max-h-52 relative overflow-auto my-2 bg-gray-100 px-4 py-2 rounded-xl"
      v-if="iAmAdmin"
    >
      <h2 class="text-center">Add new members</h2>
      <div class="h-full">
        <div v-if="!contacts.length">
          <p class="text-gray-300 text-center py-4">
            Not able to add any contacts to this group
          </p>
        </div>
        <div
          v-for="(contact, i) in contacts"
          :key="i"
          class="grid grid-cols-12 rounded-lg mb-2 py-2"
        >
          <div class="col-span-2 place-items-center grid">
                      <AvatarImg :id="contact.id" />

          </div>
          <div class="col-span-8 pl-4 flex flex-col justify-center">
            {{ contact.id }}
          </div>
          <div class="col-span-2 place-items-center grid">
            <button class="h-12 rounded-full" @click="addToGroup(contact)">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed } from "vue";
import { statusList } from "@/store/statusStore";
import { GroupChat } from "../types/index";
import AvatarImg from "@/components/AvatarImg.vue";
import { usechatsActions } from "../store/chatStore";
import { useContactsState } from "../store/contactStore";
import { useAuthState } from "../store/authStore";
export default {
  name: "GroupManagementBlock",
  props: {
    groupChat: { required: true },
  },
  components: { AvatarImg },
  setup(props) {
    const { contacts } = useContactsState();
    const removeFromGroup = (contact) => {
      const { updateContactsInGroup } = usechatsActions();
      //@ts-ignore
      updateContactsInGroup(props.groupChat.chatId, contact, true);
    };
    const addToGroup = (contact) => {
      const { updateContactsInGroup } = usechatsActions();
      //@ts-ignore
      updateContactsInGroup(props.groupChat.chatId, contact, false);
    };
    const filteredContacts = computed(() => {
      //@ts-ignore
      return contacts.filter(
        (c) => !props.groupChat.contacts.map((x) => x.id).includes(c.id)
      );
    });

    const iAmAdmin = computed(() => {
      const { user } = useAuthState();
      //@ts-ignore
      return props.groupChat.adminId == user.id;
    });

    return {
      groupChat: props.groupChat,
      status: statusList,
      removeFromGroup,
      contacts: filteredContacts,
      addToGroup,
      iAmAdmin,
    };
  },
};
</script>
