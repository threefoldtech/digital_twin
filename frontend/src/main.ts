import { createApp } from 'vue';
import App from './App.vue';
import './assets/index.css';
import router from "./router";
import '@fortawesome/fontawesome-free/js/all'
import socketIo from './plugins/SocketIo'
import config from "../public/config/config"


// console.log(Socketio)
// const a = Socketio.install
const app = createApp(App)
    .use(router)
    .use(socketIo, {
        connection: config.baseUrl,
        options: {
            debug: true,
        },
        transports: ['websocket']
    })
    .mount('#app');

export default app
