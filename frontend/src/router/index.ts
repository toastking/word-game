import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import CreateGame from '../views/CreateGame.vue';
import LobbyList from '../views/LobbyList.vue';
import Game from '../views/Game.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  { path: '/create', name: 'CreateGame', component: CreateGame },
  { path: '/lobby', name: 'Lobby', component: LobbyList },
  { path: '/game/:roomId', name: 'Game', component: Game },
];

const router = new VueRouter({
  routes,
});

export default router;
