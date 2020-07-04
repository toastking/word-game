import Vue from 'vue';
import Vuex from 'vuex';
import { Tile } from '@/schema/Tile';

Vue.use(Vuex);

/** Size of the game board */
export const BOARD_SIZE = 15;

/** Helper function to calculate the index of the flat array value from Colyseus */
function calculateIndex(row: number, column: number): number {
  return BOARD_SIZE * row + column;
}

/** State for the game frontend */
export interface GameState {
  currenTurn: string;
  gameStarted: boolean;
  gameBoard: Tile[];
}

export default new Vuex.Store<GameState>({
  state: {
    currenTurn: '',
    gameStarted: false,
    gameBoard: [],
  },
  mutations: {
    updateGameStarted(state, newVal: boolean) {
      state.gameStarted = newVal;
    },
    updateCurrentTurn(state, turn: string) {
      state.currenTurn = turn;
    },
    setGameBoard(state, board: Tile[]) {
      Vue.set(state, 'gameBoard', [...board]);
    },
    updateTile(state, { idx, tile }: { idx: number; tile: Tile }) {
      Vue.set(state.gameBoard, idx, tile);
    },
    removeTile(state, idx) {
      Vue.delete(state.gameBoard, idx);
    },
  },
  getters: {
    /** Get the tile at a specified row and column in the grid */
    getTile(state) {
      return (row: number, column: number) => {
        const idx = calculateIndex(row, column);
        return state.gameBoard[idx];
      };
    },
  },
  actions: {},
  modules: {},
});
