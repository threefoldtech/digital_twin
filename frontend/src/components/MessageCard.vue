<template>
  <div
      class=" flex "
      :class="{
      'justify-end': isMine(message),
      'my-2': !disabled
    }"
  >
    <div class="bg-white  rounded-lg truncate"
         :class="{
      'bg-gray-100': disabled,
      'p-4': !disabled
    }">
      <pre v-if="config.showdebug">{{ message }}</pre>
      <div class="btn-group">
        <button
            v-if="(message.type == 'EDIT' || message.type == 'STRING') && !disabled"
            @click="setEditMessage"
        >
          <i class="fas fa-pen text-gray-500"></i>
        </button>
        <button @click="setQuoteMessage" v-if="!disabled">
          <i class="fas fa-reply-all text-gray-500"></i>
        </button>
        <button v-if="message.type !== 'DELETE' && !disabled" @click="sendUpdateMessage(true)">
          <i class="fas fa-minus-circle text-gray-500"></i>
        </button>
      </div>
      <br/>
      <span v-if="message.type === 'FILE'">
        <audio
            controls
            v-if="message.body.filename.indexOf('.WebM') !== -1"
            :src="`https://${message.from.replace(
            'localhost:8080',
            'localhost:3000'
          )}.digitaltwin.jimbertesting.be/api/files/${message.to}/${message.body.filename}`
          .replace(
            'https://localhost:3000.digitaltwin.jimbertesting.be/',
            'http://localhost:3000/'
          )"
        ></audio>

        <img

            v-if="message.body.filename.indexOf('.gif') !== -1"
            :src="`http://${message.from.replace(
            'localhost:8080',
            'localhost:3000'
          )}/api/files/${message.to}/${message.body.filename}`"
        />
        <br/>
        <a
            class="py-2 px-2 bg-green-200 border-r-2"
            :href="`http://${message.from.replace(
            'localhost:8080',
            'localhost:3000'
          )}/api/files/${message.to}/${message.body.filename}`"
            download
        >{{ message.body.filename }}</a
        >
      </span>
      <div v-else-if="message.type === 'QUOTE'">
        <b> {{ message.body.quotedMessage.from }} said: </b> <br/>
        <MessageCard :message="message.body.quotedMessage" :chat-id="chatId" disabled/>
        {{ message.body.message }}
      </div>
      <div v-else>
        {{ message.body }}
      </div>
      <div v-if="quoteMessage" class="flex">
        <input class="col-span-6" stype="text" v-model="quoteMessageValue"/>
        <button class="px-2 py-8" @click="sendQuoteMessage(false)">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
      <div v-if="editMessage" class="flex">
        <input class="col-span-6" stype="text" v-model="editMessageValue"/>
        <button class="px-2 py-8" @click="sendUpdateMessage(false)">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
      <p
          class="font-thin"
          :class="{
          'text-right': isMine(message),
        }"
      >
        <span v-if="message.type == 'EDIT'"> edited - </span>
        <span v-if="message.type == 'DELETE'"> deleted - </span>

        <small class="font-thin text-right " v-if="isread">is read</small>
        {{ m(message.timeStamp).fromNow() }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, nextTick, ref} from "vue";
import {useAuthState} from "../store/authStore";
import moment from "moment";
import {usechatsActions} from "../store/chatStore";
import {Message, MessageBodyType, QuoteBodyType} from "../types/index";
import {uuidv4} from "@/common";
import config from "../../public/config/config";

export default defineComponent({
  name: "MessageCard",
  props: {
    message: Object,
    chatId: String,
    disabled: {
      type: Boolean,
      default: false
    },
    isread: {
      type: Boolean,
      default: false
    },
    isreadbyme: {
      type: Boolean,
      default: false
    },
  },
  setup(props) {
    const {user} = useAuthState();

    const isMine = (message) => {
      return message.from == user.id;
    };

    const m = (val) => moment(val);

    const editMessage = ref(false);
    const editMessageValue = ref("");

    const quoteMessage = ref(false);
    const quoteMessageValue = ref("");
    const {sendMessageObject} = usechatsActions();


    const setEditMessage = () => {
      editMessage.value = true;
      editMessageValue.value = props.message.body;
    };
    const sendUpdateMessage = (isDelete: Boolean) => {
      editMessage.value = false;
      if (props.message.value != editMessageValue.value) {
        const {sendMessageObject} = usechatsActions();
        const oldmessage = props.message;
        console.log(props.message);
        const updatedMessage: Message<String> = {
          id: oldmessage.id,
          from: oldmessage.from,
          to: oldmessage.to,
          body: isDelete ? "Message has been deleted" : editMessageValue.value,
          timeStamp: oldmessage.timeStamp,
          type: isDelete ? "DELETE" : "EDIT",
        };
        sendMessageObject(props.chatId, updatedMessage);
        console.log(props.chatId);
        console.log(props.message);
      }
      props.message.value = editMessageValue.value;
    };
    const setQuoteMessage = () => {
      quoteMessage.value = true;
    };
    const sendQuoteMessage = () => {
      console.log("quote");
      if (quoteMessageValue.value !== "") {
        quoteMessage.value = false;
        const {user} = useAuthState();
        const messageToQuote = props.message;
        // from: user.id,
        // to: chatId,
        // timeStamp: new Date(),
        // type: "STRING"

        const newMessage: Message<QuoteBodyType> = {
          id: uuidv4(),
          from: user.id,
          to: props.chatId,
          body: <QuoteBodyType>{
            message: quoteMessageValue.value,
            quotedMessage: <Message<MessageBodyType>>messageToQuote,
          },
          timeStamp: new Date(),
          type: "QUOTE",
        };
        sendMessageObject(props.chatId, newMessage);
      }
      props.message.value = editMessageValue.value;
    };

    const read = () => {
      const {readMessage} = usechatsActions()
      readMessage(props.chatId, props.message.id)
    }
    nextTick(() => {
      if (!props.isreadbyme){
        read()
      }
    })

    return {
      isMine,
      m,
      setEditMessage,
      setQuoteMessage,
      editMessage,
      editMessageValue,
      sendUpdateMessage,
      quoteMessage,
      quoteMessageValue,
      sendQuoteMessage,
      config,
      read
    };
  },
});
</script>

