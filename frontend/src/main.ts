import { library } from '@fortawesome/fontawesome-svg-core';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import * as Colyseus from 'colyseus.js';
import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;
library.add(faCrown);

Vue.component('vue-fontawesome', FontAwesomeIcon);

Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');

// Initialize the game client
/** Game server client */
export const client = new Colyseus.Client('ws://localhost:2567');
