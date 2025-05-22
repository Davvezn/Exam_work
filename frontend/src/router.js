import { createRouter, createWebHistory } from 'vue-router';
import Homepage from "@/views/Homepage.vue";
import Analytics from './views/Analytics.vue';


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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;