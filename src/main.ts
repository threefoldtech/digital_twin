import { createApp } from 'vue';
import App from './App.vue';
import './assets/index.css';
import router from "./router";

import socketIo from './plugins/SocketIo'
import config from './common/config'


// console.log(Socketio)
// const a = Socketio.install
const app = createApp(App)
    .use(router)
    .use(socketIo, {
        connection: config.baseUrl,
        options: {
            debug: true
        }
    })
    .mount('#app');

export default app