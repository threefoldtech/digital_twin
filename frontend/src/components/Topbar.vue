<template>
    <div
        class="items-center bg-gradient flex justify-between md:topgrid relative h-full px-4 md:px-0"
    >
        <div class="flex">
            <div class="h-5 ml-4 items-center">
                <button
                    class="text-lg text-white md:hidden w-12"
                    @click="backOrMenu"
                    :class="{ 'md:hidden': !(route.meta && route.meta.back) }"
                >
                    <i
                        :class="`fas ${
                            route.meta && route.meta.back
                                ? 'fa-chevron-left'
                                : 'fa-bars'
                        }`"
                    ></i>
                </button>
                <img
                    src="/TFN.svg"
                    alt="TF-Logo"
                    class="md:ml-4 h-full hidden md:flex"
                />
            </div>

            <div class="h-5 flex items-center col-span-3 md:col-span-1">
                <slot>
                    <img
                        src="/TFN.svg"
                        alt="TF-Logo"
                        class="md:hidden md:ml-4 h-full"
                    />
                </slot>
            </div>
        </div>

        <div
            class="pr-4 text-right text-gray-500 flex items-center justify-end"
        >
            <slot name="actions">
                <button class="text-lg text-white md-hidden" @click="addUser">
                    <i class="fas fa-plus"></i>
                </button>
                <!-- <button class="text-lg text-white">
                    <i class="fas fa-search"></i>
                </button> -->
                <!-- <input class="hidden md:block" type="text"/> -->
            </slot>
        </div>

        <jdialog v-model="showDialog" noActions>
            <template v-slot:title>
                <h1>Profile settings</h1>
            </template>
            <div>
                <div
                    class="relative flex justify-center h-52"
                    @mouseover="showEditPic = true"
                    @mouseleave="showEditPic = false"
                >
                    <transition name="fade">
                        <div
                            @click.stop="selectFile"
                            v-if="showEditPic"
                            class="grid cursor-pointer place-items-center bg-black bg-opacity-75 absolute w-full h-full top-0 left-0"
                        >
                            <button class="text-white">
                                <i class="fas fa-pen"></i>
                            </button>
                        </div>
                    </transition>
                    <img class="h-full w-52 bg-black" :src="user.image" />
                </div>
                <h1 class="text-center my-4">{{ user.id }}</h1>
                <div
                    class="relative w-full h-full"
                    @mouseover="showEdit = true"
                    @mouseleave="showEdit = false"
                >
                    <transition name="fade">
                        <button
                            v-if="!isEditingStatus"
                            :class="showEdit ? 'block' : 'hidden'"
                            class="absolute top-0 right-0"
                            @click="setEditStatus(true)"
                        >
                            <i class="fas fa-pen"></i>
                        </button>
                    </transition>

                    <transition name="fade">
                        <button
                            v-if="isEditingStatus"
                            class="absolute top-1 right-0"
                            @click="sendNewStatus"
                        >
                            <i class="fas fa-check"></i>
                        </button>
                    </transition>
                    <textarea
                        v-model="userStatus"
                        class="w-full"
                        :disabled="!isEditingStatus"
                        :placeholder="user.status"
                    ></textarea>
                </div>
                <input
                    class="hidden"
                    type="file"
                    id="fileinput"
                    ref="fileinput"
                    accept="image/*"
                    @change="changeFile"
                />

                <div>
                    <h2>Blocked Users</h2>
                    <ul class="max-h-28 overflow-y-auto">
                        <template v-for="blockedUser in blockedUsers">
                            <li>
                                {{ blockedUser }}
                                <button
                                    class="px-4 py-2 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:border-blue-700 active:bg-blue-700 ease-in-out duration-150 cursor-pointer uppercase"
                                    @click="unblockUser(blockedUser)"
                                >
                                    unblock
                                </button>
                            </li>
                        </template>

                        <li
                            v-if="
                                blockedUsers.length === 0 && blockedUsersLoading
                            "
                        >
                            ...
                        </li>
                        <li
                            v-if="
                                blockedUsers.length === 0 &&
                                !blockedUsersLoading
                            "
                        >
                            No blocked users
                        </li>
                    </ul>
                </div>
            </div>
        </jdialog>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import { useAuthState } from '../store/authStore';
import { useSocketActions } from '../store/socketStore';
import Dialog from './Dialog.vue';
import AvatarImg from '@/components/AvatarImg.vue';
import {
    deleteBlockedEntry,
    getBlockList,
    initBlocklist,
} from '@/store/blockStore';
import { setNewavater } from '@/store/userStore';
import { fetchStatus } from '@/store/statusStore';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
    name: 'Topbar',
    components: { AvatarImg, jdialog: Dialog },
    setup({}, ctx) {
        const { user } = useAuthState();
        const showDialog = ref(false);
        const showEdit = ref(false);
        const showEditPic = ref(false);
        const fileinput = ref();
        const file = ref();
        const userStatus = ref('');
        const isEditingStatus = ref(false);
        const router = useRouter();
        const route = useRoute();
        const backOrMenu = () => {
            if (route.meta && route.meta.back) {
                router.push({ name: route.meta.back });
                return;
            }
            showDialog.value = true;
        };

        const selectFile = () => {
            fileinput.value.click();
        };
        const changeFile = () => {
            file.value = fileinput.value?.files[0];
            sendNewAvatar();
        };
        const removeFile = () => {
            file.value = null;
        };

        const sendNewAvatar = async () => {
            const newUrl = await setNewavater(file.value);
            await fetchStatus(user.id);
            showDialog.value = false;
        };

        const setEditStatus = (edit: boolean) => {
            console.log(edit);
            isEditingStatus.value = edit;
            userStatus.value = user.status;
        };
        const sendNewStatus = async () => {
            const { sendSocketUserStatus } = useSocketActions();
            sendSocketUserStatus(userStatus.value);
            user.status = userStatus.value;
            isEditingStatus.value = false;
        };

        const blockedUsers = computed(() => {
            return getBlockList();
        });
        // @todo: config

        onBeforeMount(() => {
            initBlocklist();
        });

        const unblockUser = async user => {
            await deleteBlockedEntry(user);
            showDialog.value = false;
        };

        const addUser = () => {
            ctx.emit('addUser');
        };

        return {
            addUser,
            backOrMenu,
            user,
            showEditPic,
            showEdit,
            showDialog,
            fileinput,
            file,
            selectFile,
            changeFile,
            removeFile,
            sendNewAvatar,
            sendNewStatus,
            userStatus,
            setEditStatus,
            isEditingStatus,
            blockedUsers,
            unblockUser,
            route,
        };
    },
});
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
    @variants responsive {
        .topgrid {
            display: grid !important;
            grid-template-columns: 500px 2fr 1fr !important;
        }
    }
}
</style>
