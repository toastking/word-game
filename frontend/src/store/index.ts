import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

/** State for the game frontend */
export interface GameState {
  currenTurn: string;
  gameStarted: boolean;
}

export default new Vuex.Store<GameState>({
  state: {
    currenTurn: '',
    gameStarted: false,
  },
  mutations: {
    updateGameStarted(state, newVal: boolean) {
      state.gameStarted = newVal;
    },
    updateCurrentTurn(state, turn: string) {
      state.currenTurn = turn;
    },
  },
  actions: {},
  modules: {},
});
