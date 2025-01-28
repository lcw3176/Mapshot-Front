import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

Sentry.init({
  App,
  dsn: 'https://1c1f8712a989433cb34416dd0bfde82e@o4505030048284672.ingest.sentry.io/4505030053330944',
  integrations: [
    Sentry.browserTracingIntegration({ router }),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  tracePropagationTargets: ['kmapshot.com', /^\//],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

})

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(createPinia()).use(router).use(vuetify).mount('#app')
