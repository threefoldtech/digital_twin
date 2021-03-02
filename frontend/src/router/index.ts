import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import AppLayout from '@/layout/AppLayout.vue';
import Basic from '@/layout/Basic.vue';
import Chat from '@/views/app/Chat.vue';
import Single from '@/views/app/Single.vue';
import Callback from '@/views/Callback.vue';
import Unauthorised from '@/views/Unauthorised.vue';

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
        path: '/chat',
        component: Basic,
        children: [
            {
                path: '',
                name: 'chat',
                component: Chat,
            },
            {
                path: ':id',
                name: 'single',
                component: Single,
                meta: {
                    back: 'chat',
                },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
