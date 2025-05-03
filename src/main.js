import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import VueSelect from "vue-select";// Import Pinia

import App from './App.vue'
import router from './router/router'

import './css/app.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import { initializeEcho } from './plugins/echo';
import { useAuthStore } from './stores/authStore';

const toastOptions = {
    position: 'top-right'
};

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Toast, toastOptions);

app.component("v-select", VueSelect);

const authStore = useAuthStore();
const token = authStore.access || localStorage.getItem('access');
initializeEcho(token);

app.mount('#app')