<template>
  <div class="grid grid-cols-3 md:grid-cols-7 h-12 items-center">
    <img src="/TFN-black.svg" alt="TF-Logo" class="h-full" />
    <div
      class="col-end-13 text-right text-gray-500 flex items-center justify-end"
    >
      <AvatarImg :id="user.id"/>
      <span class="mr-2">{{ user.id }}</span>
      <button @click="showDialog = true">
        <i class="fas fa-cog text-gray-500"></i>
      </button>
    </div>
    <jdialog v-model="showDialog" @close="showDialog = false" noActions>
      <template v-slot:title>
        <h1>Profile settings</h1>
      </template>

      <div>Username: {{ user.id }}</div>
      <div>
        Status: {{user.status}}
        <input v-model="userStatus" />
      </div>
      <div>
        Avatar:
        <img :src="user.image" />
      </div>
      <!-- <template> -->
        <div class="flex">
          <button class="px-2 py-8 " @click.stop="selectFile">
            <i
              class="fas fa-paperclip text-gray-500 transform"
              style="--tw-rotate: -225deg"
            ></i>
          </button>
          <input
            class="hidden"
            type="file"
            id="fileinput"
            ref="fileinput"
            @change="changeFile"
          />
          <div
            class="file-message col-span-6 w-full h-full pl-4 bg-blue-100"
            v-if="file"
          >
            <span class="truncate"> {{ file.name }}</span>
            <button class="px-2 py-8" @click.stop="removeFile">
              <i class="fas fa-minus-circle text-gray-500"></i>
            </button>
          </div>
          <button class="px-2 py-8" @click="sendNewAvatar">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      <!-- </template> -->

      <!-- @closeDialog="showDialog = false"> -->
    </jdialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useAuthState } from "../store/authStore";
import { useSocketActions } from "../store/socketStore"
import Dialog from "./Dialog.vue";
import AvatarImg from "@/components/AvatarImg.vue";

export default defineComponent({
  name: "Topbar",
  components: {AvatarImg, jdialog: Dialog },
  setup() {
    const { user } = useAuthState();
    const showDialog = ref(false);
    const fileinput = ref();
    const file = ref();
    const userStatus = ref(user.status)

    const selectFile = () => {
      fileinput.value.click();
    };
    const changeFile = () => {
      file.value = fileinput.value?.files[0];
    };
    const removeFile = () => {
      file.value = null;
    };

    const sendNewAvatar =  async () => {
      const {sendSocketAvatar} = useSocketActions()
      const buffer = await file.value.arrayBuffer()
      sendSocketAvatar(buffer)
    };

    return {
      user,
      showDialog,
      fileinput,
      file,
      selectFile,
      changeFile,
      removeFile,
      sendNewAvatar,
      userStatus
    };
  },
});
</script>

<style scoped>
</style>
