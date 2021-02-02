<template>
  <div class="flex">
    <form @submit.prevent="contactAdd" class="w-full">
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
    <div v-if="contactAddError">
      <span class="red"
        >Failed to reach digitaltwin of the contact. Do you still want to add
        the contact?</span>
      <button @click="forceAddContact">Add</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useContactsActions } from "../store/contactStore";

export default defineComponent({
  name: "ContactAdd",
  setup(props, {emit}) {
    const { addContact } = useContactsActions();
    let usernameAdd = ref("");
    let contactAddError = ref("");

    const contactAdd = () => {
      try {
        addContact(usernameAdd.value, location.value, false);
        usernameAdd.value = "";
        contactAddError.value = "";
        emit("closeDialog")
      } catch (err) {
        console.log("adding contact failed");
        contactAddError.value = err;
      }
    };
    const forceAddContact = () => {
      addContact(usernameAdd.value, location.value, true);
      usernameAdd.value = "";
      contactAddError.value = "";
      emit("closeDialog")
    };

    const location = computed(() => {
      return `${usernameAdd.value}-chat`;
    });

    return {
      usernameAdd,
      location,
      contactAdd,
      forceAddContact,
      contactAddError
    };
  },
});
</script>

<style scoped>
</style>