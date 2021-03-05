<template>
    <nav>
        <div class="flex flex-col h-full items-center mx-2">
            <div
                v-for="app in apps"
                :key="app.name"
                class="mb-4 grid text-center text-white"
                :class="{
                    'text-gray-300': !app?.enabled,
                    'cursor-pointer': app.enabled,
                }"
            >
                <div
                    class="h-20 w-20 rounded-full grid place-items-center mb-1"
                    style="position: relative"
                    @click="changePage(app.name)"
                >
                    <i :class="`fas ${app.icon} text-2xl`"></i>
                    <h3>
                        {{ app.name }}
                    </h3>
                </div>
            </div>
            <div class="grid place-items-end flex-grow">
                <div
                    class="w-20 h-20 grid cursor-pointer items-center justify-center justify-items-center"
                    @click="showUserConfigDialog = true"
                >
                    <AvatarImg :id="user.id" />
                    <!--<h3 class="truncate w-full text-sm">{{ user.id }}</h3>-->
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import AvatarImg from '@/components/AvatarImg.vue';
    import { useAuthState } from '@/store/authStore';
    import { showUserConfigDialog } from '@/services/dialogService';

    export default defineComponent({
        name: 'Sidebar',
        components: { AvatarImg },
        setup() {
            const apps = [
                {
                    name: 'chat',
                    icon: 'fas fa-comments',
                    enabled: true,
                },
                {
                    name: 'filebrowser',
                    icon: 'fas fa-file-alt',
                    enabled: true,
                },
                {
                    name: 'forum',
                    icon: 'fas fa-stream',
                    enabled: false,
                },
                {
                    name: 'meetings',
                    icon: 'fas fa-video',
                },
            ];
            const router = useRouter();

            const currentRoute = computed(() => router.currentRoute.value);

            const changePage = (page: any) => {
                router.push({ name: page });
            };

            const { user } = useAuthState();

            return {
                currentRoute,
                apps,
                changePage,
                user,
                showUserConfigDialog,
            };
        },
    });
</script>

<style scoped>
    .active {
        position: relative;
    }

    .active::after {
        position: absolute;
        content: '';
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: #e69b5950;
        border-left: 8px solid #e69b59;
    }
</style>
