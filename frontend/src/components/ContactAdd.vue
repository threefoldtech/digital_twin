<template>
  <div class="flex flex-col place-items-start">
    <ul class="nav nav-tabs nav-justified">
      <li class="nav-item">
        <a
          class="nav-link active"
          @click.prevent="setActive('user')"
          :class="{ active: isActive('user') }"
          href="#"
          >Add an user</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          @click.prevent="setActive('group')"
          :class="{ active: isActive('group') }"
          href="#"
          >Create a group</a
        >
      </li>
    </ul>

    <form @submit.prevent="contactAdd" class="w-full" v-if="isActive('user')">
      <div class="flex place-items-center">
        <label class="mr-2" for="username">Username: </label>
        <input
          v-model="usernameAdd"
          id="username"
          class="mb-2"
          placeholder="Username"
        />
      </div>
      <div class="flex place-items-center">
        <label class="mr-2" for="location">Location: </label>
        <input
          id="location"
          disabled="true"
          class="mb-2"
          :placeholder="location"
        />
      </div>

      <div class="flex mt-4 justify-end w-full">
        <button @click="$emit('closeDialog')">Cancel</button>
        <button>Add contact</button>
      </div>
    </form>
    <form @submit.prevent="groupAdd" class="w-full" v-if="isActive('group')">
      <div class="flex place-items-center">
        <label class="mr-2" for="username">Group name: </label>
        <input
          v-model="groupnameAdd"
          id="username"
          class="mb-2"
          placeholder="Group name"
        />
      </div>
      <div class="flex place-items-center">
        <label class="mr-2" for="location">Location: </label>
        <input
          id="location"
          disabled="true"
          class="mb-2"
          :placeholder="location"
        />
      </div>
      <div
        class="flex flex-col max-h-52 relative overflow-auto my-2 bg-gray-100 px-4 py-2 rounded-xl"
      >
        <div class="h-full">
          <div v-if="!contacts.length">
            <p class="text-gray-300 text-center py-4">No users in group yet</p>
          </div>
          <div
            v-for="(contact, i) in contacts"
            :key="i"
            class="grid grid-cols-12 rounded-lg mb-2 py-2"
          >
            <div class="col-span-2 place-items-center grid">
              <img
                :src="`https://avatars.dicebear.com/4.5/api/avataaars/${encodeURI(
                  contact
                )}.svg`"
                alt="contact image"
                class="h-12 bg-icon rounded-full"
              />
            </div>
            <div class="col-span-8 pl-4 flex flex-col justify-center">
              {{ contact }}
            </div>
            <div class="col-span-2 place-items-center grid">
              <button
                class="h-12 rounded-full"
                @click="removeUserFromGroup(contact)"
                v-if="userIsInGroup(contact)"
              >
                <i class="fas fa-times"></i>
              </button>
              <button
                class="h-12 rounded-full"
                @click="usersInGroup.push(contact)"
                v-if="!userIsInGroup(contact)"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex mt-4 justify-end w-full">
        <button @click="$emit('closeDialog')">Cancel</button>
        <button>Add Group</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { usechatsActions } from "@/store/chatStore";
import { defineComponent, ref, computed } from "vue";
import { useContactsActions, useContactsState } from "../store/contactStore";
import { Contact } from "../types/index"

export default defineComponent({
  name: "ContactAdd",
  setup(props, { emit }) {
    const { addContact } = useContactsActions();
    const { contacts } = useContactsState();
    let addGroup = ref(false);
    let usernameAdd = ref("");
    let groupnameAdd = ref("")
    let usernameInGroupAdd = ref("");
    let usersInGroup = ref([]);
    let contactAddError = ref("");

    const contactAdd = () => {
      try {
        addContact(usernameAdd.value, location.value, false);
        usernameAdd.value = "";
        contactAddError.value = "";
        emit("closeDialog");
      } catch (err) {
        console.log("adding contact failed");
        contactAddError.value = err;
      }
    };

    const location = computed(() => {
      return `${usernameAdd.value}-chat`;
    });

    let activeItem = ref("user");
    const isActive = (menuItem) => {
      return activeItem.value === menuItem;
    };

    const setActive = (menuItem) => {
      activeItem.value = menuItem;
    };

    const groupAdd = () => {
      const { addGroupchat } = usechatsActions();
      
      const contacts:Contact[] = usersInGroup.value.map((id) =>{
        const contact:Contact  = {
          id,
          location: `${usernameAdd.value}-chat`
        }
        return contact
      })
      addGroupchat(groupnameAdd.value,contacts)
      console.log("ADDING GROUP TO CHATS");
    };

    const userIsInGroup = (username) => {
      const user = usersInGroup.value.find((uname) => uname == username);
      if (user) {
        return true;
      }
      return false;
    };

    const removeUserFromGroup = (username) => {
      console.log("inremoveuserfromgroup")
      const index = usersInGroup.value.findIndex(u => u == username)
      console.log(index)
      usersInGroup.value.splice(index,1)
      
    }

    return {
      addGroup,
      usernameAdd,
      groupnameAdd,
      usernameInGroupAdd,
      location,
      contactAdd,
      usersInGroup,
      isActive,
      setActive,
      groupAdd,
      contacts,
      userIsInGroup,
      removeUserFromGroup
    };
  },
});
</script>

<style scoped>
</style>