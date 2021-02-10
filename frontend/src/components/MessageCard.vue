<template>
  <div
      @mouseover="showActions = true"
      @mouseleave="showActions = false"
      class="flex"
      :class="{
      'justify-end': isMine,
      'my-1': !disabled,
    }"
  >
    <AvatarImg small class="mr-2 self-center" v-if="!isMine && isGroup && !disabled" :id="message.from"></AvatarImg>
    <div
        class=" relative rounded-lg"
        :class="{
        'p-2': !disabled,
        'bg-white': !disabled,
        'bg-gray-100': disabled,
        'bg-gray-200': message.type === 'SYSTEM',
        'bg-blue-200': !disabled && isMine && message.type !== 'SYSTEM',
      }"
        style="min-width: 5rem; max-width: 60%"
    >
      <pre v-if="config.showdebug">{{ message }}</pre>
      <div v-if="isGroup &&  !isMine && !disabled">
        <b>{{ message.from }}</b>
      </div>
      <div
          v-if="showActions"
          class="btn-group absolute -bottom-2 right-0 text-xs rounded-full bg-icon text-white px-2"
      >
        <button
            class="mx-0"
            v-if="
               isMine && (message.type == 'EDIT' || message.type == 'STRING') && !disabled
            "
            @click="setEditMessage"
        >
          <i class="fas fa-pen"></i>
        </button>
        <button class="mx-0" @click="setQuoteMessage" v-if="!disabled">
          <i class="fas fa-reply-all"></i>
        </button>
        <button
            class="mx-0"
            v-if="isMine && message.type !== 'DELETE' && !disabled && ! message.type ==='SYSTEM'"
            @click="sendUpdateMessage(true)"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <span v-if="message.type === 'FILE'">
        <audio
            controls
            class="max-w-full"
            v-if="message.body.filename.indexOf('.WebM') !== -1"
            :src="fileUrl"
        ></audio>

        <img
            v-if="message.body.filename.indexOf('.gif') !== -1"
            :src="fileUrl"
        />
        <br/>
        <a
            class="py-2 px-2 bg-blue-300 border-r-2"
            :href="fileUrl"
            download
        >{{ message.body.filename }}</a
        >
      </span>
      <div v-else-if="message.type === 'GIF'">
        <img :src="message.body"/>
      </div>
      <div v-else-if="message.type === 'SYSTEM'">
       <span>{{ message.body }}</span>
      </div>
      <div v-else-if="message.type === 'GROUP_UPDATE'">
        <span v-if="message.body.type === 'REMOVEUSER'">
          <b>{{ message.body.contact.id }}</b> removed from the group.
        </span>
        <span v-else-if="message.body.type === 'ADDUSER'">
          <b>{{ message.body.contact.id }}</b> added to the group.
        </span>
      </div>
      <div v-else-if="message.type === 'QUOTE'">
        <div class="bg-gray-100 py-1 px-1" v-if="showQuoted">
          <b>{{ message.body.quotedMessage.from }} said: </b> <br/>
          <MessageCard
              :message="message.body.quotedMessage"
              :chat-id="chatId"
              disabled
              isGroup="false"
              :showQuoted="false"
          />
        </div>
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
          'text-right': isMine,
        }"
      >
        <span v-if="message.type == 'EDIT'"> edited </span>
        <span v-if="message.type == 'DELETE'"> deleted  </span>

<!--        <small class="font-thin text-right" v-if="isread">is read</small>-->
        <!--        {{ m(message.timeStamp).fromNow() }}-->
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, nextTick, ref, watch} from "vue";
import {useAuthState} from "../store/authStore";
import moment from "moment";
import {usechatsActions} from "../store/chatStore";
import {Message, MessageBodyType, QuoteBodyType} from "../types/index";
import {uuidv4} from "@/common";
import config from "../../public/config/config";
import AvatarImg from "@/components/AvatarImg.vue";

export default defineComponent({
  name: "MessageCard",
  components: {AvatarImg},
  props: {
    message: Object,
    chatId: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    isread: {
      type: Boolean,
      default: false,
    },
    isreadbyme: {
      type: Boolean,
      default: false,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    isMine: {
      type: Boolean,
      default: false,
    },
    showQuoted: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const showActions = ref(false);
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
      const {readMessage} = usechatsActions();
      readMessage(props.chatId, props.message.id);
    };
    if (!props.isreadbyme) {
      read();
    }


    const fileUrl = props.message.body?.filename ?
        `https://${props.message.from.replace(
            'localhost:8080',
            'localhost:3000'
        )}.digitaltwin.jimbertesting.be/api/files/${props.message.to}/${
            props.message.body.filename
        }`.replace(
            'https://localhost:3000.digitaltwin.jimbertesting.be/',
            'http://localhost:3000/'
        ) : false

    return {
      showActions,
      isMine: props.isMine,
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
      read,
      fileUrl,
      isGroup: props.isGroup,
      showQuoted: props.showQuoted
    };
  },
});
</script>

