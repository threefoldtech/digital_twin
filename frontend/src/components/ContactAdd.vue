<template>
  <div class="flex flex-col place-items-start">
    <ul class="nav nav-tabs nav-justified">
      <li class="nav-item">
        <a class="nav-link active" @click.prevent="setActive('user')" :class="{ active: isActive('user') }" href="#">Add an user</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" @click.prevent="setActive('group')" :class="{ active: isActive('group') }" href="#">Create a group</a>
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
          v-model="usernameAdd"
          id="username"
          class="mb-2"
          placeholder="Group mane"
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

      <div class="flex place-items-center">
        <label class="mr-2" for="location">Users: </label>
        <input
          id="location"
          class="mb-2"
          placeholder="User name"
          v-model="usernameInGroupAdd"
        />

        <button
          @click="
            usersInGroup.push(usernameInGroupAdd);
            usernameInGroupAdd = null;
          "
        >
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div
        class="flex flex-col max-h-52 relative overflow-auto my-2 bg-gray-100 px-4 py-2 rounded-xl"
      >
        <div class="h-full">
          <div v-if="!usersInGroup.length">
            <p class="text-gray-300 text-center py-4">No users in group yet</p>
          </div>
          <div
            v-for="(user, i) in usersInGroup"
            :key="i"
            class="grid grid-cols-12 rounded-lg mb-2 py-2"
          >
            <div class="col-span-2 place-items-center grid">
              <img
                :src="`https://avatars.dicebear.com/4.5/api/avataaars/${encodeURI(
                  user
                )}.svg`"
                alt="User image"
                class="h-12 bg-icon rounded-full"
              />
            </div>
            <div class="col-span-8 pl-4 flex flex-col justify-center">
              {{ user }}
            </div>
            <div class="col-span-2 place-items-center grid">
              <button
                class="h-12 rounded-full"
                @click="usersInGroup = usersInGroup.filter((u) => u != user)"
              >
                <i class="fas fa-times"></i>
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
import { defineComponent, ref, computed } from "vue";
import { useContactsActions } from "../store/contactStore";

export default defineComponent({
  name: "ContactAdd",
  setup(props, { emit }) {
    const { addContact } = useContactsActions();
    let addGroup = ref(false);
    let usernameAdd = ref("");
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
    const forceAddContact = () => {
      addContact(usernameAdd.value, location.value, true);
      usernameAdd.value = "";
      contactAddError.value = "";
      emit("closeDialog");
    };

    const location = computed(() => {
      return `${usernameAdd.value}-chat`;
    });

    let activeItem = ref("user")
    const isActive =  (menuItem) => {
      return activeItem.value === menuItem
    } 

    const setActive =  (menuItem) => {
      activeItem.value = menuItem
    }

    return {
      addGroup,
      usernameAdd,
      usernameInGroupAdd,
      location,
      contactAdd,
      forceAddContact,
      contactAddError,
      usersInGroup,
      isActive,
      setActive
    };
  },
});
</script>

<style scoped>
</style>