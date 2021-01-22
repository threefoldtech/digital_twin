import {
    createRouter,
    createWebHistory,
    RouteRecordRaw
} from 'vue-router';
import Home from '@/views/Home.vue';
import AppLayout from '@/layout/AppLayout.vue';
import Chat from '@/views/app/Chat.vue';
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
                name: 'Chat',
                component: Chat,
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
