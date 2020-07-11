<template>
  <section>
    <div class="container game-grid">
      <div class="player-3-area">
        <!-- Player 3 -->
        <player-card
          v-if="playerCount > 2"
          :playerId="nonUserPlayersIds[1]"
          :currentTurn="currentTurn"
        ></player-card>
      </div>
      <!-- Game board and player areas-->
      <div class="player-2-area">
        <!-- Player 2 -->
        <player-card
          v-if="playerCount > 1"
          :playerId="nonUserPlayersIds[0]"
          :currentTurn="currentTurn"
        ></player-card>
      </div>
      <div class="game-board-area">
        <game-board></game-board>
      </div>
      <div class="player-4-area">
        <!-- Player 4 -->
        <player-card
          v-if="playerCount > 3"
          :playerId="nonUserPlayersIds[2]"
          :currentTurn="currentTurn"
        ></player-card>
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

export default Vue.extend({
  created() {
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

      room.state.onChange = changes => {
        changes.forEach(change => {
          switch (change.field) {
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

      //TODO: remove this!!
      this.$store.commit('gameOver');
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
    ...mapGetters(['nonUserPlayerIds', 'playerCount', 'hasUserPlayer']),
  },
  components: {
    PlayerCard,
    GameTiles,
    GameButtons,
    GameBoard,
    GameOverModal,
  },
});
</script>

<style scoped>
.game-grid {
  display: grid;
  grid-template-areas:
    '. . player-3 . .'
    'player-2 game-board  game-board game-board player-4'
    '. . player-1 . .';
  grid-template-columns: repeat(5, 1fr);
  row-gap: 10px;
  column-gap: 10px;
}

.player-3-area {
  grid-area: player-3;
}

.player-2-area {
  grid-area: player-2;
}

.player-4-area {
  grid-area: player-4;
}

.player-1-area {
  grid-area: player-1;
}

.game-board-area {
  grid-area: game-board;
}
</style>
