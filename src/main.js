import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from "pinia";
import VueMobileDetection from 'vue-mobile-detection'
import * as Sentry from "@sentry/vue";

Sentry.init({
    App,
    dsn: "https://1c1f8712a989433cb34416dd0bfde82e@o4505030048284672.ingest.sentry.io/4505030053330944",
    integrations: [
        new Sentry.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            tracePropagationTargets: ["kmapshot.com", /^\//],
        }),
    ],

    tracesSampleRate: 0.5,
});

createApp(App).use(createPinia()).use(router).use(VueMobileDetection).mount('#app')
