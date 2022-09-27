import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from '@/App.vue';
import router from '@/routers/index';

import VueGoogleMaps from '@fawmi/vue-google-maps';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);
const pinia = createPinia();

app.use(VueGoogleMaps, {
    load: {
        key: import.meta.env.VITE_GOOGLE_MAPS_KEY,
        libraries: 'places',
        autobindAllEvents: true,
    },
});

app.use(pinia);
app.use(router);

app.mount('#app');
