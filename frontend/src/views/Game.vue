<template>
  <section>
    <div class="container game-grid">
      <div class="game-board-area">
        <game-board></game-board>
      </div>
      <div class="player-list-area">
        <player-list class="player-list"></player-list>
      </div>
      <div class="player-1-area">
        <!-- User Player (Player 1) -->
        <template v-if="hasUserPlayer === true">
          <game-buttons></game-buttons>
          <game-tiles v-if="gameStarted === true"></game-tiles>
          <player-card :playerId="playerId"></player-card>
        </template>
      </div>
    </div>
    <b-modal
      :active.sync="gameOver"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
      :can-cancel="[]"
    >
      <game-over-modal></game-over-modal>
    </b-modal>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import PlayerCard from '../components/PlayerCard.vue';
import { colyseusService } from '../main';
import GameTiles from '../components/GameTiles.vue';
import GameButtons from '../components/GameButtons.vue';
import { mapState, mapGetters } from 'vuex';
import { GameState } from '../store';
import GameBoard from '@/components/GameBoard.vue';
import GameOverModal from '@/components/GameOverModal.vue';
import PlayerList from '@/components/PlayerList.vue';
import { WordGameState } from '../schema/WordGameState';

export default Vue.extend({
  created() {
    //Reset the room state
    this.$store.commit('resetGame');

    // Join the room and subsribe to colyseus updates
    const roomId = this.$route.params.roomId;
    const room = colyseusService.room;
    if (room) {
      //Setup player list
      room.state.players.onAdd = (player, idx) => {
        this.$store.commit('updatePlayer', { player, id: idx });
      };
      room.state.players.onRemove = (_, idx) => {
        this.$store.commit('removePlayer', idx);
      };
      // Set the player hand and setup handlers
      room.state.players.onChange = (player, id) => {
        this.$store.commit('updatePlayer', { player, id });
      };

      //Setup updating the list of placed tiles
      room.state.placedTiles.onAdd = (placedTile, idx) => {
        this.$store.commit('updatePlacedTile', { placedTile, idx });
      };
      room.state.placedTiles.onChange = (placedTile, idx) => {
        this.$store.commit('updatePlacedTile', { placedTile, idx });
      };
      room.state.placedTiles.onRemove = (_, idx) => {
        this.$store.commit('removePlacedTile', idx);
      };

      room.state.onChange = changes => {
        changes.forEach(change => {
          switch (change.field as keyof WordGameState) {
            case 'gameStarted':
              this.$store.commit('updateGameStarted', change.value);
              break;
            case 'currentTurn':
              this.$store.commit('updateCurrentTurn', change.value);
              break;
            case 'gameOver':
              if (change.value === true) {
                this.$store.commit('gameOver');
              }
              break;
            case 'currentPlayerAlert':
              this.$store.commit('setPlayerAlertMessage', change.value);
              break;
          }
        });
      };

      // Set the initial value for the game board
      this.$store.commit('setGameBoard', room.state.gameBoard);

      //Setup Handler for the game board
      room.state.gameBoard.onAdd = (tile, idx) => {
        this.$store.commit('updateTile', { idx, tile });
      };
      room.state.gameBoard.onRemove = (_, idx) => {
        this.$store.commit('removeTile', idx);
      };
      room.state.gameBoard.onChange = (tile, idx) => {
        this.$store.commit('updateTile', { idx, tile });
      };

      this.$store.commit('setPlayerId', room.sessionId);
    }
  },
  computed: {
    ...mapState<GameState>([
      'currentTurn',
      'gameStarted',
      'players',
      'playerId',
      'gameOver',
    ]),
    ...mapGetters(['hasUserPlayer', 'getPlayerAlert']),
  },
  watch: {
    getPlayerAlert(newAlert) {
      if (newAlert !== '') {
        this.$buefy.dialog.alert({
          title: 'Issue with placed word',
          message: newAlert,
        });
      }
    },
  },
  components: {
    PlayerCard,
    GameTiles,
    GameButtons,
    GameBoard,
    GameOverModal,
    PlayerList,
  },
});
</script>

<style scoped>
.game-grid {
  display: grid;
  grid-template-areas:
    'game-board  game-board game-board player-list'
    'player-1 player-1 player-1 .';
  grid-template-columns: repeat(4, 1fr);
  row-gap: 10px;
  column-gap: 10px;
  margin-top: 1em;
}

.player-list-area {
  grid-area: player-list;
  display: flex;
}

.player-list {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 0px;
  margin-right: 0px;
  flex: 1;
}

.player-1-area {
  grid-area: player-1;
}

.game-board-area {
  grid-area: game-board;
}
</style>
