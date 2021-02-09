<template>
  <div class="place-items-start">
    <div class="grid grid-cols-2">
      <a
        class="nav-link grid-cols-6 text-center py-2"
        @click.prevent="setActive('user')"
        :class="{ active: isActive('user') }"
        href="#"
      >
        Add an user
      </a>
      <a
        class="nav-link grid-cols-6 text-center py-2"
        @click.prevent="setActive('group')"
        :class="{ active: isActive('group') }"
        href="#"
      >
        Create a group
      </a>
    </div>

    <form @submit.prevent="contactAdd" class="w-full" v-if="isActive('user')">
      <div class="flex place-items-center">
        <label class="mr-2" for="username">Username:</label>
        <auto-complete
          :data="possibleUsers"
          v-model="usernameAdd"
          placeholder="Search for user..."
        ></auto-complete>
      </div>
      <div class="flex place-items-center">
        <label class="mr-2" for="location">Location:</label>
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
                  contact.id
                )}.svg`"
                alt="contact image"
                class="h-12 bg-icon rounded-full"
              />
            </div>
            <div class="col-span-8 pl-4 flex flex-col justify-center">
              {{ contact.id }}
            </div>
            <div class="col-span-2 place-items-center grid">
              <button
                class="h-12 rounded-full"
                @click="removeUserFromGroup(contact.id)"
                v-if="userIsInGroup(contact.id)"
              >
                <i class="fas fa-times"></i>
              </button>
              <button
                class="h-12 rounded-full"
                @click="usersInGroup.push(contact.id)"
                v-if="!userIsInGroup(contact.id)"
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
import { selectedId, usechatsActions } from "@/store/chatStore";
import { defineComponent, ref, computed, nextTick } from "vue";
import { useContactsActions, useContactsState } from "../store/contactStore";
import { useAuthState } from "../store/authStore";
import { Contact } from "../types/index";
import axios from "axios";
import config from "../../public/config/config";
import autoComplete from "./AutoComplete.vue";

export default defineComponent({
  name: "ContactAdd",
  components: { autoComplete },
  setup(props, { emit }) {
    const { addContact } = useContactsActions();
    const { contacts } = useContactsState();
    let addGroup = ref(false);
    let usernameAdd = ref("");
    let groupnameAdd = ref("");
    let usernameInGroupAdd = ref("");
    let usersInGroup = ref([]);
    let possibleUsers = ref([]);
    let contactAddError = ref("");

    const contactAdd = () => {
      try {
        let userId = usernameAdd.value;
        console.log(userId);
        addContact(userId, location.value, false);
        usernameAdd.value = "";
        contactAddError.value = "";
        emit("closeDialog");

        //@todo: setTimeout is dirty should be removed
        // next tick was not possible reason: chat was not loaded yet
        setTimeout(() => {
          selectedId.value = userId;
        }, 1000);
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
      const { user } = useAuthState();
      usersInGroup.value.push(user.id);
      const contacts: Contact[] = usersInGroup.value.map((id) => {
        const contact: Contact = {
          id,
          location: `${id}-chat`,
        };
        return contact;
      });

      addGroupchat(groupnameAdd.value, contacts);
      //@todo: setTimeout is dirty should be removed
      // next tick was not possible reason: chat was not loaded yet
      setTimeout(() => {
        selectedId.value = groupnameAdd.value;
      }, 1000);
      usersInGroup.value = [];
      emit("closeDialog");
    };

    const userIsInGroup = (username) => {
      const user = usersInGroup.value.find((uname) => uname == username);
      if (user) {
        return true;
      }
      return false;
    };

    const removeUserFromGroup = (username) => {
      console.log("inremoveuserfromgroup");
      const index = usersInGroup.value.findIndex((u) => u == username);
      console.log(index);
      usersInGroup.value.splice(index, 1);
    };

    // @todo: config
    axios.get(`${config.spawnerUrl}api/v1/list`, {}).then((r) => {
      console.log(r.data);
      possibleUsers.value = r.data;
    });

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
      removeUserFromGroup,
      possibleUsers,
    };
  },
});
</script>

<style scoped>
a.active{
  background: #e5e7eb;
}
</style>
