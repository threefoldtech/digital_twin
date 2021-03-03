<template>
    <div class="flex">
        <div class="flex justify-center w-18 mr-4">
            <AvatarImg :id="message.from" />
        </div>
        <div class="card w-full bg-white rounded-md mb-4 overflow-hidden">
            <header class="flex justify-between pl-2 pt-2 text-xs items-center">
                <div class="title">
                    <div class="name inline-block pr-5">
                        {{ message.from }}
                    </div>
                    <div class="date inline-block font-thin">
                        {{ moment(message.timestamp).fromNow() }}
                    </div>
                </div>
                <div class="header-actions align-end">
                    <button>
                        <i class="fa fa-ellipsis-v"></i>
                    </button>
                </div>
            </header>
            <main class="px-4 pb-4">
                <MessageContent :message="message"></MessageContent>
            </main>
            <footer
                :class="{
                    'hidden h-8': showActionButtons !== true,
                    'h-20':
                        showActionButtons === true && showEditMessage === true,
                }"
                class="bg-gray-200 font-light text-xs justify-between p-1"
            >
                <!-- <button>
                    <i class="fa fa-thumbs-up"></i>
                    Like
                </button> -->

                <div class="flex">
                    <!-- <button class="hover" @click="toggleEditMessage">
                        <i class="fa fa-pencil-alt"></i>
                        Edit
                    </button>

                    <button class="hover" @click="toggleSendForwardMessage">
                        <i class="fa fa-share"></i>
                        Forward
                    </button> -->

                    <button class="hover" @click="toggleSendReplyMessage">
                        <i class="fa fa-reply"></i>
                        Reply
                    </button>
                </div>

                <div class="flex" :class="showEditMessage ? '' : 'hidden'">
                    <input v-model="reply" type="text" />
                    <button @click="sendReplyMessage">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </footer>
            <div id="replies">
                <div v-for="reply in message.replies" :key="reply.id">
                    <MessageCard
                        :message="reply"
                        showActionButtons="false"
                    ></MessageCard>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import moment from 'moment';
import AvatarImg from '@/components/AvatarImg.vue';
import MessageContent from '@/components/MessageContent.vue';
import { Message, StringMessageType } from '@/types';
import { uuidv4 } from '@/common';
import { useAuthState } from '@/store/authStore';
import { usechatsActions } from '@/store/chatStore';

export default defineComponent({
    name: 'MessageCard',
    components: { MessageContent, AvatarImg },
    props: {
        message: Object,
        showActionButtons: {
            type: Boolean,
            default: true,
        },
        chatId: String,
    },
    setup(props) {
        const reply = ref('');

        const toggleEditMessage = () => {
            console.log('toggleEditMessage');
        };

        const editMessage = () => {
            console.log('editMessage');
        };

        const toggleSendForwardMessage = () => {
            console.log('toggleSendForwardMessage');
        };

        const sendForwardMessage = () => {
            console.log('sendQuoteMessage');
            // console.log('quote');
            // if (quoteMessageValue.value !== '') {
            //     quoteMessage.value = false;
            //     const { user } = useAuthState();
            //     const messageToQuote = props.message;
            //     // from: user.id,
            //     // to: chatId,
            //     // timeStamp: new Date(),
            //     // type: "STRING"
            //     const newMessage: Message<QuoteBodyType> = {
            //         id: uuidv4(),
            //         from: user.id,
            //         to: props.chatId,
            //         body: <QuoteBodyType>{
            //             message: quoteMessageValue.value,
            //             quotedMessage: <Message<MessageBodyType>>messageToQuote,
            //         },
            //         timeStamp: new Date(),
            //         type: 'QUOTE',
            //         replys: [],
            //         subject: null,
            //     };
            //     sendMessageObject(props.chatId, newMessage);
            //     quoteMessageValue.value = '';
            // }
            // props.message.value = editMessageValue.value;
        };

        const showEditMessage = ref(false);

        const toggleSendReplyMessage = () => {
            console.log('toggleSendReplyMessage');
            showEditMessage.value = !showEditMessage.value;
        };

        const sendReplyMessage = () => {
            console.log('sendReplyMessage');

            const { user } = useAuthState();

            const newMessage: Message<StringMessageType> = {
                id: uuidv4(),
                from: user.id,
                to: props.chatId,
                body: <StringMessageType>reply.value,
                timeStamp: new Date(),
                type: 'STRING',
                replies: [],
                subject: props.message.id,
            };

            const { sendMessageObject } = usechatsActions();

            console.log('Sending new message: ', newMessage);
            sendMessageObject(props.chatId, newMessage);
            showEditMessage.value = !showEditMessage.value;
            reply.value = '';
        };

        return {
            moment,
            toggleSendForwardMessage,
            sendReplyMessage,
            toggleSendReplyMessage,
            toggleEditMessage,
            showEditMessage,
            reply,
        };
    },
});
</script>
<style lang="css">
.text-message * {
    word-wrap: break-word;
    max-width: 100%;
    white-space: pre-wrap;
}
.hover:hover {
    text-decoration: underline;
}
</style>
