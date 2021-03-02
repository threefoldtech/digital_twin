<template>
    <section class="h-full">
        <div
            class="relative overflow-y-auto w-full max-h-full h-full pt-4"
            v-if="filteredChats && filteredChats.length"
        >
            <div class="absolute w-full">
                <ChatCard
                    v-for="chat in filteredChats"
                    :key="`${chat.chatId}-${chat.messages.length}-${
                        chat.read[user.id]
                    }`"
                    class="grid grid-cols-12 rounded-lg mb-2 py-2 cursor-pointer"
                    @click="setSelected(chat.chatId)"
                    :chat="chat"
                />
            </div>
        </div>
        <div v-else class="text-center">
            <p>It feels lonely over here :(</p>
            <button
                @click="sendUpdate(true)"
                class="mt-2 border rounded-full px-4"
            >
                Add a contact
            </button>
        </div>

        <jdialog
            :modelValue="modelValue"
            @update:modelValue="sendUpdate"
            noActions
        >
            <template v-slot:title>
                <h1>Create a new chat {{ modelValue }}</h1>
            </template>
            <add-contact @closeDialog="sendUpdate(false)"> </add-contact>
        </jdialog>
    </section>
</template>

<script lang="ts">
    import moment from 'moment';
    import { useSocketActions } from '@/store/socketStore';
    import { defineComponent, ref, computed, onBeforeMount, watch } from 'vue';
    import { usechatsState, usechatsActions } from '@/store/chatStore';
    import { useAuthState, useAuthActions } from '@/store/authStore';
    import addContact from '@/components/ContactAdd.vue';
    import AvatarImg from '@/components/AvatarImg.vue';
    import Dialog from '@/components/Dialog.vue';
    // import contactpopup from "@/components/ContactPopup.vue";
    import ChatCard from '@/components/ChatCard.vue';
    import { startFetchStatusLoop } from '@/store/statusStore';
    import { statusList } from '@/store/statusStore';
    import { uniqBy } from 'lodash';
    import { useRouter } from 'vue-router';
    import { mode } from 'crypto-js';

    export default defineComponent({
        name: 'Apps',
        props: {
            modelValue: {
                type: Boolean,
                default: false,
            },
        },
        components: {
            addContact,
            jdialog: Dialog,
            ChatCard,
            AvatarImg,
        },
        setup(props, context) {
            const { chats, chatRequests } = usechatsState();
            const { retrievechats } = usechatsActions();
            let selectedId = ref('');
            const status = computed(() => {
                return statusList[selectedId.value];
            });
            const { initializeSocket } = useSocketActions();
            const { user } = useAuthState();

            const m = val => moment(val);
            const searchValue = ref('');
            let showContacts = ref(false);

            const router = useRouter();

            const setSelected = id => {
                router.push({ name: 'single', params: { id } });
            };

            const filteredChats = computed(() => {
                if (searchValue.value == '') {
                    return chats.value;
                }
                console.log('filtered', chats.value);
                return chats.value.filter(c =>
                    c.name
                        .toLowerCase()
                        .includes(searchValue.value.toLowerCase())
                );
            });
            onBeforeMount(() => {
                initializeSocket(user.id.toString());
            });
            onBeforeMount(retrievechats);

            const selectedChat = computed(() =>
                chats.value.find(chat => chat.chatId == selectedId.value)
            );

            // startFetchStatusLoop(user.id);

            const filteredChatRequests = computed(() => {
                chatRequests.value = chatRequests.value.filter(
                    cr => !chats.value.find(c => c.chatId === cr.chatId)
                );
                const filteredChats = chatRequests.value.filter(
                    cr => !chats.value.find(c => c.chatId === cr.chatId)
                );
                //@ts-ignore
                return uniqBy(filteredChats, c => c.chatId);
            });

            const sendUpdate = newVal => {
                console.log('update it');
                context.emit('update:modelValue', newVal);
            };

            return {
                status,
                selectedId,
                selectedChat,
                setSelected,
                chats,
                filteredChatRequests,
                searchValue,
                filteredChats,
                showContacts,
                user,
                m,
                sendUpdate,
            };
        },
    });
</script>
