import {
    createRouter,
    createWebHistory,
    RouteRecordRaw
} from 'vue-router';
import Home from '@/views/Home.vue';
import AppLayout from '@/layout/AppLayout.vue';
import Basic from '@/layout/Basic.vue';
import Chat from '@/views/app/Chat.vue';
import Single from '@/views/app/Single.vue';
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
        path: '/chat',
        name: 'chat',
        component: Basic,
        children: [
            {
                path: '',
                name: '',
                component: Chat,
            }, {
                path: ':id',
                name: 'single',
                component: Single,
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
