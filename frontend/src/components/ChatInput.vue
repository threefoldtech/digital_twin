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
      <button class="px-2 py-8" @click.stop="startRecording" v-if="!stopRecording">
        <i class="fas fa-microphone text-gray-500"></i>
      </button>
      <button class="px-2 py-8" @click.stop="stopRecording" v-else>
        <i class="fas fa-circle text-red-600"></i>
      </button>
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
    selectedid: {},
  },
  setup(props, {emit}) {

    const {sendMessage, sendFile} = usechatsActions();

    const message = ref("");
    const messageBox = ref(null);
    const fileinput = ref();
    const file = ref(null)

    const stopRecording = ref(null)


    const chatsend = (e) => {
      if (message.value != "") {
        sendMessage(props.selectedid, message.value);
        message.value = "";
      }
      if (fileinput.value.files.length > 0) {
        sendFile(props.selectedid, fileinput.value.files[0].name, fileinput.value.files[0].arrayBuffer());
        removeFile()
      }
      emit('messageSend')
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

    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});


      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.start()

      stopRecording.value = () => {
        mediaRecorder.addEventListener("stop", async () => {
          const audioBlob = new Blob(audioChunks);
          const arrayBuffer = await audioBlob.arrayBuffer()
          console.log(props.selectedid)
          sendFile(props.selectedid, `recording-${Date.now()}.WebM`, arrayBuffer)
          stopRecording.value = null;
        });

        mediaRecorder.stop();
        stream.getAudioTracks().forEach(at => at.stop())
      }

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
      startRecording,
      stopRecording,
    }
  }
}
</script>
