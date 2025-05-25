import { createRouter, createWebHistory } from 'vue-router';
import Homepage from "@/views/Homepage.vue";
import Analytics from './views/Analytics.vue';
import Register from './views/Register.vue';
import LogIn from './views/Log-in.vue';


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Homepage,
    },
    {
        path: '/Analytics',
        name: 'Analytics',
        component: Analytics
    },
    {
        path: '/Register-User',
        name: '/Register-User',
        component: Register
    },
    {
        path: '/Log-in',
        name: '/Log-in',
        component: LogIn
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;