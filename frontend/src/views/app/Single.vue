<template>
    <appLayout>
        <template v-slot:top>
            <div class="w-full flex md:px-4" v-if="chat">
                <div class="place-items-center grid mr-4">
                    <AvatarImg
                        :id="chat.chatId"
                        :showOnlineStatus="false"
                    ></AvatarImg>
                </div>
                <div class="py-4 pl-2">
                    <p class="font-bold font overflow-hidden overflow-ellipsis">
                        {{ chat.name }}
                    </p>
                    <p class="font-thin" v-if="!chat.isGroup">
                        {{
                            statusList[chat.chatId]?.isOnline
                                ? 'Is online'
                                : 'Is offline'
                        }}
                    </p>
                    <p class="font-thin" v-if="chat.isGroup">Group chat</p>
                </div>
            </div>
            <div v-else>Loading</div>
        </template>

        <template v-slot:actions>
            <div class="">
                <!-- <button class="text-lg text-white">
                    <i class="fas fa-search"></i>
                </button> -->
                <div class="relative">
                    <button
                        class="text-lg text-white md:hidden"
                        @click="showMenu = true"
                    >
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div
                        class="backdrop"
                        v-if="showMenu"
                        @click="showMenu = false"
                    ></div>
                    <div
                        class="right-2 z-20 -top-2 flex flex-col bg-white shadow-sm w-40 rounded absolute py-2 pl-2"
                        v-if="showMenu"
                    >
                        <button @click="popupMeeting" class="flex align-center">
                            <div class="w-8 justify-center align-center">
                                <i class="fas fa-video"></i>
                            </div>
                            <span class="ml-1 text-left">Call</span>
                        </button>

                        <button @click="null" class="flex">
                            <div class="w-8">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <span class="ml-1 text-left">Info</span>
                        </button>

                        <button @click="blockChat" class="flex">
                            <div class="w-8">
                                <i class="fas fa-minus-circle"></i>
                            </div>
                            <span class="ml-1 text-left">Block chat</span>
                        </button>
                        <button @click="deleteChat" class="flex">
                            <div class="w-8">
                                <i class="fas fa-trash"></i>
                            </div>
                            <span class="ml-1 text-left">Delete chat</span>
                        </button>
                    </div>
                </div>
            </div>
        </template>

        <template v-slot:default>
            <div
                class="grid grid-cols-1 md:singleGrid relative h-full w-full"
                v-if="chat"
                :key="chat.id + selectedId"
            >
                <div
                    class="hidden md:block relative h-full flex-col overflow-y-auto"
                >
                    <ChatList />
                </div>
                <div class="relative h-full flex flex-col">
                    <div
                        class="flex-grow relative overflow-y-auto"
                        ref="messageBox"
                    >
                        <div class="absolute w-full mt-8 px-4">
                            <div
                                v-for="(message, i) in chat?.messages"
                                :key="
                                    `${message.id}-${message.type}-${message.timeStamp}`
                                "
                            >
                                <div
                                    v-if="showDivider(message, i)"
                                    class="text-center px-4"
                                >
                                    <span class="font-thin">
                                        {{ m(message.timeStamp).fromNow() }}
                                    </span>
                                </div>
                                <MessageCard
                                    :isread="i <= lastRead"
                                    :isreadbyme="i <= lastReadByMe"
                                    :message="message"
                                    :chatId="chat.chatId"
                                    :isGroup="chat.isGroup"
                                    :isMine="message.from === user.id"
                                    v-on:scroll="scrollToBottom"
                                />
                                <div
                                    class="font-thin text-right align-middle"
                                    v-if="reads[message.id]"
                                >
                                    <div
                                        class="inline-block justify-end align-bottom"
                                        v-for="(value, key) in reads[
                                            message.id
                                        ].slice(0, 3)"
                                        :key="key"
                                    >
                                        <AvatarImg
                                            xsmall
                                            :id="value"
                                        ></AvatarImg>
                                    </div>
                                    <span v-if="reads[message.id].length > 3">
                                        + {{ reads[message.id].length - 3 }}
                                    </span>
                                </div>
                            </div>

                            <div
                                id="viewAnchor"
                                ref="viewAnchor"
                                style="
                                    height: 40vh;
                                    position: absolute;
                                    bottom: 0;
                                    width: 50%;
                                    pointer-events: none;
                                "
                            ></div>
                        </div>
                    </div>
                    <ChatInput
                        class="chatInput"
                        :selectedid="chat.chatId"
                        @messageSend="scrollToBottom(true)"
                    />
                    <jdialog v-model="showDialog" noActions class="max-w-10">
                        <template v-slot:title class="center">
                            <h1 class="text-center">Blocking</h1>
                        </template>
                        <div>
                            Do you really want to block
                            <b> {{ chat.name }} </b>?
                        </div>
                        <div class="grid grid-cols-2 mt-2">
                            <button
                                @click="doBlockChat"
                                class="bg-red-500 p-2 text-white font-bold"
                            >
                                YES
                            </button>
                            <button @click="showDialog = false" class="p-2">
                                NO
                            </button>
                        </div>
                    </jdialog>
                </div>
                <aside
                    class="hidden md:flex relative h-full flex-col overflow-y-auto"
                >
                    <div class="absolute max-w-full w-full p-4 pt-8">
                        <div
                            class="bg-white p-2 pb-6 w-full relative rounded-lg mb-4 mt-0 md:grid place-items-center grid-cols-1 md:px-4"
                        >
                            <div class="place-items-center grid relative">
                                <AvatarImg
                                    class="-mt-7"
                                    :id="chat.chatId"
                                    :showOnlineStatus="!chat.isGroup"
                                />
                            </div>
                            <h2
                                class="my-3 break-words text-center w-full overflow-y-auto max-h-28"
                            >
                                {{ chat.name }}
                            </h2>
                            <p
                                class="break-words w-full overflow-y-auto font-bold text-center text-gray-300"
                                v-if="!chat.isGroup"
                            >
                                {{ status?.status || 'No status found' }}
                            </p>
                        </div>
                        <group-management
                            :group-chat="chat"
                            @app-call="popupMeeting"
                            @app-block="blockChat"
                            @app-delete="deleteChat"
                        ></group-management>
                    </div>
                </aside>
            </div>

            <div class="grid h-full w-full place-items-center" v-else>
                <h2>Loading</h2>
            </div>
        </template>
    </appLayout>
</template>

<script lang="ts">
    import { useScrollActions, useScrollState } from '@/store/scrollStore';

    import appLayout from '../../layout/AppLayout.vue';
    import moment from 'moment';
    import {
        defineComponent,
        onMounted,
        watch,
        ref,
        toRefs,
        nextTick,
        computed,
        onBeforeMount,
        watchEffect,
    } from 'vue';
    import { findLastIndex, each } from 'lodash';

    import { statusList } from '@/store/statusStore';
    import { usechatsState, usechatsActions } from '@/store/chatStore';
    import { sendBlockChat, sendRemoveChat } from '@/store/socketStore';
    import { Contact } from '@/types/index';
    import { useContactsState } from '@/store/contactStore';
    import { useAuthState } from '@/store/authStore';
    import { popupCenter } from '@/services/popupService';
    import MessageCard from '@/components/MessageCard.vue';
    import ChatList from '@/components/ChatList.vue';
    import ChatInput from '@/components/ChatInput.vue';
    import AvatarImg from '@/components/AvatarImg.vue';
    import GroupManagement from '@/components/GroupManagement.vue';
    import Dialog from '@/components/Dialog.vue';
    import * as crypto from 'crypto-js';
    import { useIntersectionObserver } from '@/lib/intersectionObserver';
    import { useRoute, useRouter } from 'vue-router';

    export default defineComponent({
        name: 'ChatView',
        components: {
            AvatarImg,
            ChatInput,
            MessageCard,
            jdialog: Dialog,
            appLayout,
            GroupManagement,
            ChatList,
        },

        setup(props) {
            const route = useRoute();
            let selectedId = ref(<string>route.params.id);
            watch(
                () => route.params.id,
                id => {
                    selectedId.value = <string>id;
                }
            );
            const { retrievechats } = usechatsActions();
            onBeforeMount(retrievechats);

            const { chats } = usechatsState();
            const { sendMessage, sendFile } = usechatsActions();
            const { user } = useAuthState();
            const { contacts } = useContactsState();
            const m = val => moment(val);
            const messageBox = ref(null);
            const showMenu = ref(false);
            const file = ref();
            let showDialog = ref(false);

            const propRefs = toRefs(props);

            const lastRead = computed(() => {
                let id = <string>user.id;
                //@ts-ignore
                const { [id]: _, ...read } = chat.value.read;

                const reads = Object.values(read);

                return findLastIndex(chat.value.messages, message =>
                    reads.includes(<string>message.id)
                );
            });

            const lastReadByMe = computed(() => {
                return findLastIndex(
                    chat.value.messages,
                    message => chat.value.read[<string>user.id] === message.id
                );
            });

            const isMine = message => {
                return message.from == user.id;
            };
            const truncate = (value, limit = 20) => {
                if (value.length > limit) {
                    value = value.substring(0, limit - 3) + '...';
                }
                return value;
            };

            const scrollToBottom = (force = false) => {
                if (!force && !isIntersecting.value) {
                    return;
                }

                nextTick(() => {
                    messageBox.value.scrollTo(0, messageBox.value.scrollHeight);
                });
            };

            const message = ref('');

            const chat = computed(() => {
                return chats.value.find(c => c.chatId == selectedId.value);
            });

            onMounted(() => {
                nextTick(() => {
                    scrollToBottom(true);
                });
            });

            const popupMeeting = () => {
                sendMessage(
                    chat.value.chatId,
                    `${user.id} joined the video chat`,
                    'SYSTEM'
                );

                // @ts-ignore
                // const str = chat?.contacts ? chat.id : [user.id, chat.id].sort().join();
                const str: string = chat.value.isGroup
                    ? chat.value.chatId
                    : chat.value.contacts
                          .map(c => c.id)
                          .sort()
                          .join();

                console.log(`str = ${str}`);

                const id = crypto.SHA1(str);

                popupCenter(
                    `https://freeflowconnect.threefold.me/?roomName=${id}&username=${user.id}.3bot`,
                    'video chat',
                    800,
                    550
                );
            };

            const deleteChat = () => {
                sendRemoveChat(chat.value.chatId);
                const router = useRouter();
                // router is undefined?
                // router.push({ name: 'chat' });
                window.location.href = '/chat';
            };

            const blockChat = () => {
                showDialog.value = true;
                // const confirmed = confirm(`do you really want to block ${chat.value.name}?`);
                // if (confirmed == true) {
                // sendBlockChat(chat.value.chatId)
                // }
            };
            const doBlockChat = () => {
                showDialog.value = false;
                sendBlockChat(chat.value.chatId);
            };

            const showDivider = (message, index) => {
                const previousMessage = chat.value.messages[index - 1];
                if (!previousMessage) {
                    return true;
                }
                const time = moment(message.timeStamp);

                return time.diff(previousMessage.timeStamp, 'm') > 5;
            };

            const reads = computed(() => {
                const preReads = {};
                each(chat.value.read, (val: string, key: string) => {
                    console.log(key, val);
                    if (key === user.id) {
                        return;
                    }
                    preReads[val] = preReads[val]
                        ? [key, ...preReads[val]]
                        : [key];
                });
                return preReads;
            });

            const viewAnchor = ref(null);

            const {
                isIntersecting,
                intersectionRatio,
            } = useIntersectionObserver(viewAnchor);

            const status = computed(() => {
                return statusList[selectedId.value];
            });

            const { scrollEvents } = useScrollState();

            watch(scrollEvents, () => {
                nextTick(() => {
                    scrollToBottom(true);
                });
            });

            return {
                chats,
                selectedId,
                chat,
                truncate,
                message,
                file,
                isMine,
                m,
                messageBox,
                scrollToBottom,
                status,
                statusList,
                popupMeeting,
                lastRead,
                lastReadByMe,
                deleteChat,
                blockChat,
                doBlockChat,
                user,
                viewAnchor,
                showDivider,
                reads,
                showDialog,
                showMenu,
                ...propRefs,
            };
        },
    });
</script>

<style scoped type="text/css">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer utilities {
        @variants responsive {
            .singleGrid {
                grid-template-columns: 400px 2fr 1fr;
            }
        }
    }
</style>
