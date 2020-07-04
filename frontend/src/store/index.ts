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
  currentTurn: string;
  gameStarted: boolean;
  gameBoard: Tile[];
  /** The tiles in players hand */
  playerHand: Tile[];
  /** Index of the selected tile in a players hand */
  selectedTile: number;
}

export default new Vuex.Store<GameState>({
  state: {
    currentTurn: '',
    gameStarted: false,
    gameBoard: [],
    playerHand: [],
    selectedTile: -1,
  },
  mutations: {
    updateGameStarted(state, newVal: boolean) {
      state.gameStarted = newVal;
    },
    updateCurrentTurn(state, turn: string) {
      state.currentTurn = turn;
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
    setHand(state, hand: Tile[]) {
      Vue.set(state, 'playerHand', [...hand]);
    },
    removeTileFromHand(state, idx) {
      Vue.delete(state.playerHand, idx);
    },
    addTileToHand(state, { idx, tile }: { idx: number; tile: Tile }) {
      Vue.set(state.playerHand, idx, tile);
    },
    updateSelectedTile(state, idx: number) {
      state.selectedTile = idx;
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
