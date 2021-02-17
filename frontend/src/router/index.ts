import {
    createRouter,
    createWebHistory,
    RouteRecordRaw
} from 'vue-router';
import Home from '@/views/Home.vue';
import AppLayout from '@/layout/AppLayout.vue';
import ForumLayout from '@/layout/ForumLayout.vue';
import Chat from '@/views/app/Chat.vue';
import Forum from '@/views/app/Forum.vue';
import Callback from "@/views/Callback.vue";
import Unauthorised from "@/views/Unauthorised.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/callback',
        name: 'Callback',
        component: Callback,
    },
    {
        path: '/unauthorized',
        name: 'Unauthorised',
        component: Unauthorised,
    },
    {
        path: '/app',
        name: 'app',
        component: AppLayout,
        children: [
            {
                path: '',
                name: 'app',
                component: Chat,
            }
        ]
    },
    {
        path: '/chat',
        name: 'chat',
        component: AppLayout,
        children: [
            {
                path: '',
                name: 'chat',
                component: Chat,
            }
        ]
    },
    {
        path: '/forum',
        name: 'forum',
        component: ForumLayout,
        children: [
            {
                path: '',
                name: 'forum',
                component: Forum,
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
