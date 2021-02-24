<template>

  <GifSelector v-if="showGif" v-on:sendgif="sendGif" style="z-index: 10000" v-on:close="hideGif"/>
  <div class="md:p4 md:m-4 md:rounded-3xl flex flex-col bg-white grid grid-cols-12" @paste="onPaste">
    <div class="btns md:col-span-4 col-span-full md:grid grid-cols-4 md:bg-transparent bg-gray-200" :class="{'hidden': collapsed, 'grid': !collapsed}">
      <button @click="toggleGif"><h2>GIF</h2></button>
      <button class="px-2 md:py-8 py-2" @click.stop="selectFile">
        <i class="fas fa-paperclip text-gray-500 transform" style="--tw-rotate: -225deg;"></i>
      </button>
      <input class="hidden" type="file" id="fileinput" ref="fileinput" @change="changeFile"/>
      <button class="px-2 md:py-8 py-2" @click.stop="startRecording" v-if="!stopRecording">
        <i class="fas fa-microphone text-gray-500"></i>
      </button>
      <button class="px-2 md:py-8 py-2" @click.stop="stopRecording" v-else>
        <i class="fas fa-circle text-red-600"></i>
      </button>
      <emoji-picker
          ref="emojipicker"
          :class="{hidden: !showEmoji}"
          style="position: absolute; bottom: 140px; z-index: 10000"></emoji-picker>
      <button class="px-2 md:py-8 py-2" @click.stop="toggleEmoji" v-if="!file">
        😃
      </button>
    </div>
    <div class="input md:col-span-8 col-span-full grid grid-cols-12">
      <button class="col-span-2 md:hidden" @click="collapsed = !collapsed" :key="collapsed.toString()">
        <i v-if="collapsed" class="fas fa-chevron-up text-gray-500"></i>
        <i v-else class="fas fa-chevron-down text-gray-500"></i>
      </button>
      <form
          v-if="!file"
          class="md:col-span-10 col-span-8 py-3"
          @submit.prevent="chatsend">

        <input
            class="h-full"
            type="text"
            v-model="message"
            v-focus
        />

      </form>
      <div class="file-message md:col-span-10 col-span-8 w-full h-full pl-4 bg-blue-100" v-if="file">
        <span> {{ file.name }}</span>
        <button class="px-2 md:py-8 py-2" @click.stop="removeFile">
          <i class="fas fa-minus-circle text-gray-500"></i>
        </button>
      </div>
      <button class="col-span-2" @click="chatsend">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
    <!--    <p class="mx-6 pt-4 font-thin">-->
    <!--      <span v-if="true"-->
    <!--      >{{ contact.name }} is typing ...-->
    <!--    </span>-->
    <!--    </p>-->

  </div>
  <div class="overlay-emoji" :class="{hidden: !showEmoji}" @click="hideEmoji"
       style="position: fixed; width: 100vw; height: 100vh; background:transparent; top: 0; left: 0; z-index: 9999">

  </div>
  <div class="overlay-gif" :class="{hidden: !showGif}" @click="hideGif"
       style="position: fixed; width: 100vw; height: 100vh; background:transparent; top: 0; left: 0; z-index: 9999">
  </div>

</template>
<script lang="ts">
import {nextTick, ref} from "vue";
import {selectedId, usechatsActions} from "@/store/chatStore";
import GifSelector from "@/components/GifSelector.vue";

export default {
  name: 'ChatInput',
  components: {GifSelector},
  props: {
    selectedid: {},
  },
  setup(props, {emit}) {

    const {sendMessage, sendFile} = usechatsActions();

    const message = ref("");
    const messageBox = ref(null);
    const fileinput = ref();
    const file = ref(null)
    const emojipicker = ref()

    const stopRecording = ref(null)
    const showEmoji = ref(false)


    const chatsend = async (e) => {

      if (message.value != "") {
        sendMessage(props.selectedid, message.value);
        message.value = "";
      }
      if (file.value) {
        sendFile(props.selectedid, file.value);
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
          console.log(props.selectedid)
          console.log(audioBlob)
          sendFile(props.selectedid, audioBlob,true)
          stopRecording.value = null;
        });

        mediaRecorder.stop();
        stream.getAudioTracks().forEach(at => at.stop())
      }

    }
    const toggleEmoji = () => {
      showEmoji.value = !showEmoji.value
    }
    const hideEmoji = () => {
      if (!showEmoji) {
        return
      }
      showEmoji.value = false
    }

    const showGif = ref(false)
    const toggleGif = () => {
      showGif.value = !showGif.value
    }
    const sendGif = async (gif) => {
      showGif.value = false
      const {sendMessage} = usechatsActions()
      sendMessage(props.selectedid, gif, "GIF")
      emit('messageSend')
    }
    const hideGif = async (gif) => {
      showGif.value = false
    }

    nextTick(() => {
      emojipicker.value.addEventListener('emoji-click', event => {
        message.value = `${message.value}${event.detail.unicode}`;
      });
    })
    const onPaste = (e:ClipboardEvent) => {
      const item = e.clipboardData.items[0];

      console.log({files:e.clipboardData.files})

      if (item.type.indexOf("image") === 0) {
        const blob = item.getAsFile();
        file.value = blob
      }
    }

    const collapsed = ref(true)
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
      showEmoji,
      toggleEmoji,
      hideEmoji,
      emojipicker,
      showGif,
      toggleGif,
      sendGif,
      hideGif,
      collapsed,
      onPaste
    }
  }
}
</script>
