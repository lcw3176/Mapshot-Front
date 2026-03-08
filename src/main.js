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
  replaysSessionSampleRate: 0.0,
  replaysOnErrorSampleRate: 1.0,

})

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#546E7A',
          success: '#43A047',
          info: '#039BE5',
          warning: '#FB8C00',
          error: '#E53935',
          surface: '#FFFFFF',
          background: '#F5F5F5',
        },
      },
      dark: {
        colors: {
          primary: '#42A5F5',
          secondary: '#78909C',
          success: '#66BB6A',
          info: '#29B6F6',
          warning: '#FFA726',
          error: '#EF5350',
          surface: '#1E1E1E',
          background: '#121212',
        },
      },
    },
  },
})

createApp(App).use(createPinia()).use(router).use(vuetify).mount('#app')
