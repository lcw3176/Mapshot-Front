import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from "pinia";
import VueMobileDetection from 'vue-mobile-detection'

createApp(App).use(createPinia()).use(router).use(VueMobileDetection).mount('#app')
