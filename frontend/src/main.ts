import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import * as Colyseus from "colyseus.js";
import Buefy from "buefy";
import "buefy/dist/buefy.css";

Vue.config.productionTip = false;

Vue.use(Buefy);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

// Initialize the game client
/** Game server client */
export const client = new Colyseus.Client("ws://localhost:2567");
