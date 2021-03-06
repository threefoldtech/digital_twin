import { createApp } from 'vue';
import App from './App.vue';
import './assets/index.css';
import router from "./router";
import '@fortawesome/fontawesome-free/js/all'
import socketIo from './plugins/SocketIo'
import config from "../public/config/config"


// console.log(Socketio)
// const a = Socketio.install


const clickOutside = {
    beforeMount: (el, binding) => {
        el.clickOutsideEvent = event => {
            // here I check that click was outside the el and his children
            if (!(el == event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                binding.value();
            }
        };
        document.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted: el => {
        document.removeEventListener("click", el.clickOutsideEvent);
    },
};

const app = createApp(App)
    .directive("click-outside", clickOutside)
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
