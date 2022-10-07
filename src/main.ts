import { createHead } from '@vueuse/head';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/routers/index';

import VueGoogleMaps from '@fawmi/vue-google-maps';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);
const pinia = createPinia();
const head = createHead();

app.use(VueGoogleMaps, {
    load: {
        key: import.meta.env.VITE_GOOGLE_MAPS_KEY,
        libraries: 'places',
        autobindAllEvents: true,
    },
});

app.use(pinia);
app.use(head);
app.use(router);

app.mount('#app');
