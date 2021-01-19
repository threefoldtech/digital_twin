import { createApp } from 'vue';
import App from './App.vue';
import './assets/index.css';
import router from "./router";

import socketIo from './plugins/SocketIo'


// console.log(Socketio)
// const a = Socketio.install
const app = createApp(App)
    .use(router)
    .use(socketIo, {
        connection: 'http://localhost:3000',
        options: {
            debug: true
        }
    })
    .mount('#app');

export default app