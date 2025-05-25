import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('SW registered', reg))
        .catch(err => console.log('SW Registration failed', err));
    }); //is meant to handle PWA app "features"
}

createApp(App).use(router).mount('#app')
