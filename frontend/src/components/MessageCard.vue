<template>
    <div
        class="flex flex-col items-start"
        :class="{
            'items-start': messageBlock.user !== user?.id,
            'items-end': messageBlock.user === user?.id,
        }"
    >
        <div
            class="flex justify-start pt-4 pb-2"
            :class="{
                'w-18 mr-4': showActionButtons,
                'w-8 mr-2': !showActionButtons,
            }"
        >
            <AvatarImg :id="messageBlock.user" :showOnlineStatus="false" />
        </div>

        <div v-for="message in messageBlock.messages" :key="message">
            <div
                style="position: relative;"
                class="card flex flex-row"
                :class="{
                    'flex-row-reverse': messageBlock.user === user?.id,
                }"
            >
                <div
                    class="flex rounded-xl mb-1 overflow-hidden pr-4"
                    :class="{
                        'bg-gray-200': messageBlock.user === user?.id,
                        'bg-white': messageBlock.user !== user?.id,
                        'bg-red-200': messageToReplyTo?.id === message?.id,
                    }"
                >
                    <main
                        class="msgcard flex justify-between pt-2 pl-4 pb-2"
                        :class="{
                            'flex-row-reverse': messageBlock.user === user?.id,
                        }"
                    >
                        <MessageContent :message="message"></MessageContent>
                    </main>
                </div>

                <div
                    style="margin-top: auto;"
                    class="actions pb-4 pl-4"
                    :class="{
                        hidden: showActionButtons !== true,
                    }"
                >
                    <div class="pr-4 text-gray-600 date inline-block text-xs">
                        {{ moment(message.timeStamp).fromNow() }}
                        <!-- {{ message }} -->
                    </div>
                    <span
                        class="reply text-xs pr-4"
                        @click="toggleSendReplyMessage(message)"
                    >
                        <i class="fa fa-reply"></i>
                        <span class="text-gray-600"> Reply</span>
                    </span>
                </div>
            </div>

            <div
                v-for="reply in message.replies"
                :key="reply.id"
                class="flex flex-col"
            >
                <!-- <div
                        class="flex justify-start pt-4 pb-2"
                        :class="{
                            'w-18 mr-4': showActionButtons,
                            'w-8 mr-2': !showActionButtons,
                        }"
                    >
                        <AvatarImg :id="reply.from" :showOnlineStatus="false" />
                    </div> -->
                <!-- <MessageContent :message="reply"></MessageContent> -->
                <div
                    :class="{
                        'ml-auto': messageBlock.user === user?.id,
                        'mr-auto': messageBlock.user !== user?.id,
                    }"
                >
                    {{ reply.body }}
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
    import { messageToReplyTo } from '@/services/replyService';

    export default defineComponent({
        name: 'MessageCard',
        components: { MessageContent, AvatarImg },
        props: {
            message: Object,
            messageBlock: Object,
            showActionButtons: {
                type: Boolean,
                default: true,
            },
            chatId: String,
        },
        setup(props) {
            const { user } = useAuthState();

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
            };

            const toggleSendReplyMessage = message => {
                if (
                    messageToReplyTo.value &&
                    messageToReplyTo.value.id === message.id
                ) {
                    messageToReplyTo.value = '';
                } else {
                    messageToReplyTo.value = message;
                }
            };

            const sendReplyMessage = () => {
                console.log('sendReplyMessage');

                const { user } = useAuthState();

                const newMessage: Message<StringMessageType> = {
                    id: uuidv4(),
                    from: user.id,
                    to: props.chatId,
                    // body: <StringMessageType>reply.value.value,
                    body: <StringMessageType>null,
                    timeStamp: new Date(),
                    type: 'STRING',
                    replies: [],
                    subject: props.message.id,
                };

                const { sendMessageObject } = usechatsActions();

                sendMessageObject(props.chatId, newMessage);
                messageToReplyTo.value = null;
            };

            return {
                moment,
                toggleSendForwardMessage,
                sendReplyMessage,
                toggleSendReplyMessage,
                toggleEditMessage,
                user,
                messageToReplyTo,
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

    .threefold-color {
        background: #44a687;
    }

    .actions {
        visibility: hidden;
    }

    .card:hover > .actions {
        visibility: visible;
    }

    .reply:hover {
        text-decoration: underline;
        cursor: pointer;
    }
</style>
