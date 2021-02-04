<template>
  <div class="p4 flex flex-col">
<!--    <p class="mx-6 pt-4 font-thin">-->
<!--      <span v-if="true"-->
<!--      >{{ contact.name }} is typing ...-->
<!--    </span>-->
<!--    </p>-->
    <div
        class="flex rounded-xl h place-items-center bg-white mx-4"
    >
      <button class="px-2 py-8" @click.stop="selectFile">
        <i class="fas fa-paperclip text-gray-500 transform" style="--tw-rotate: -225deg;"></i>
      </button>
      <input class="hidden" type="file" id="fileinput" ref="fileinput" @change="changeFile"/>
      <input
          class="col-span-6 w-full h-full pl-4"
          type="text"
          v-model="message"
          v-if="!file"
      />
      <div class="file-message col-span-6 w-full h-full pl-4 bg-blue-100" v-if="file">
        <span> {{ file.name }}</span>
        <button class="px-2 py-8" @click.stop="removeFile">
          <i class="fas fa-minus-circle text-gray-500"></i>
        </button>
      </div>
      <button class="px-2 py-8" @click="chatsend">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import {nextTick, ref} from "vue";
import {usechatsActions} from "@/store/chatStore";

export default {
  name: 'ChatInput',
  props: {
    chatsend: {},
    message: {}
  },
  setup(props) {

    const {sendMessage, sendFile} = usechatsActions();

    const message = ref("");
    const messageBox = ref(null);
    const fileinput = ref();
    const file = ref(null)


    const chatsend = (e) => {
      if (message.value != "") {
        sendMessage(props.selectedId, message.value);
        message.value = "";
      }
      if (fileinput.value.files.length > 0) {
        sendFile(props.selectedId, fileinput.value.files[0]);
        fileinput.value = null;
      }
      this.$emit('messageSend')
    };

    const selectFile = () => {
      fileinput.value.click()
    }

    const changeFile = () => {
      file.value = fileinput.value?.files[0];
    }

    const removeFile = () => {
      file.value = null;
    }

    return {
      sendMessage,
      message,
      chatsend,
      changeFile,
      selectFile,
      fileinput,
      file,
      removeFile,
    }
  }
}
</script>
