import Vue from 'vue';
import Vuex from 'vuex';
import { Tile } from '@/schema/Tile';
import { Player } from '@/schema/Player';
import { PlacedTile } from '@/schema/PlacedTile';

Vue.use(Vuex);

/** Size of the game board */
export const BOARD_SIZE = 15;

export interface PlayerState {
  name: string;
  score: number;
}

/** State for the game frontend */
export interface GameState {
  /** id of the current player who's turn it is */
  currentTurn: string;
  gameStarted: boolean;
  /** The tiles in play on the board */
  gameBoard: Tile[];
  /** The tiles in players hand */
  playerHand: Tile[];
  /** Index of the selected tile in a players hand */
  selectedTile: number;
  /** Map of player data */
  players: {
    [id: string]: PlayerState;
  };
  /** playerId for the currently selected user */
  playerId: string;

  gameOver: boolean;

  /** The tiles placed by a user */
  placedTiles: PlacedTile[];

  playerAlertMessage: string;
}

export default new Vuex.Store<GameState>({
  state: {
    currentTurn: '',
    gameStarted: false,
    gameBoard: [],
    playerHand: [],
    selectedTile: -1,
    playerId: '',
    players: {},
    gameOver: false,
    placedTiles: [],
    playerAlertMessage: '',
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
    resetSelectedTile(state) {
      state.selectedTile = -1;
    },
    updatePlayer(state, { player, id }: { player: Player; id: string }) {
      const updatedPlayerState: PlayerState = {
        name: player.name,
        score: player.score,
      };
      Vue.set(state.players, id, updatedPlayerState);

      if (id === state.playerId) {
        //update the hand of the user player
        Vue.set(state, 'playerHand', [...player.hand]);
      }
    },
    removePlayer(state, id: string) {
      Vue.delete(state.players, id);
    },
    setPlayerId(state, playerId: string) {
      state.playerId = playerId;
    },
    gameOver(state) {
      state.gameOver = true;
    },
    resetGame(state) {
      const initialState: GameState & { [key: string]: unknown } = {
        currentTurn: '',
        gameStarted: false,
        gameBoard: [],
        playerHand: [],
        selectedTile: -1,
        playerId: '',
        players: {},
        gameOver: false,
        placedTiles: [],
        playerAlertMessage: '',
      };
      for (const key in initialState) {
        Vue.set(state, key, initialState[key]);
      }
    },
    updatePlacedTile(
      state,
      { placedTile, idx }: { placedTile: PlacedTile; idx: number }
    ) {
      Vue.set(state.placedTiles, idx, placedTile);
    },
    removePlacedTile(state, idx: number) {
      Vue.delete(state.placedTiles, idx);
    },
    setPlayerAlertMessage(state, message: string) {
      state.playerAlertMessage = message;
    },
  },
  getters: {
    /** Get the tile at a specified row and column in the grid */
    getTile(state) {
      return (idx: number) => {
        return state.gameBoard[idx];
      };
    },
    /** Returns a getter for there's a placed tile at coordinates in the board */
    isPlacedTile(state) {
      return (row: number, column: number) => {
        return state.placedTiles.some(placedTile => {
          return placedTile.row === row && placedTile.column === column;
        });
      };
    },
    getSelectedTile(state): Tile {
      return state.playerHand[state.selectedTile];
    },
    /** Get the player ids for everyone but the current user */
    nonUserPlayerIds(state): string[] {
      return Object.keys(state.players).filter(id => id !== state.playerId);
    },
    /** Number of players in the game */
    playerCount(state) {
      return Object.keys(state.players).length;
    },
    hasUserPlayer(state): boolean {
      return state.playerId in state.players;
    },
    playersInScoreOrder(state): PlayerState[] {
      return Object.values(state.players).sort((player1, player2) => {
        if (player1.score < player2.score) {
          return -1;
        }
        if (player1.score === player2.score) {
          return 0;
        }
        return 1;
      });
    },
    /** Get the alerts for the current player */
    getPlayerAlert(state): string {
      if (state.currentTurn === state.playerId) {
        return state.playerAlertMessage;
      }
      return '';
    },
  },
  actions: {},
  modules: {},
});
