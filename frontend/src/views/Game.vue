<template>
  <div class="container game-grid">
    <div class="player-3-area">
      <!-- Player 3 -->
      <player-card
        v-if="playerCount > 2"
        :player="players[nonUserPlayersIds[1]]"
        :playerId="nonUserPlayersIds[1]"
        :currentTurn="currentTurn"
      ></player-card>
    </div>
    <!-- Game board and player areas-->
    <div class="player-2-area">
      <!-- Player 2 -->
      <player-card
        v-if="playerCount > 1"
        :player="players[nonUserPlayersIds[0]]"
        :playerId="nonUserPlayersIds[0]"
        :currentTurn="currentTurn"
      ></player-card>
    </div>
    <div class="game-board"></div>
    <div class="player-4-area">
      <!-- Player 4 -->
      <player-card
        v-if="playerCount > 3"
        :player="players[nonUserPlayersIds[2]]"
        :playerId="nonUserPlayersIds[2]"
        :currentTurn="currentTurn"
      ></player-card>
    </div>
    <div class="player-1-area">
      <!-- User Player (Player 1) -->
      <template v-if="userPlayer !== null">
        <game-buttons></game-buttons>
        <game-tiles
          v-if="gameStarted === true"
          :tiles="userPlayer.hand"
        ></game-tiles>
        <player-card :player="userPlayer" :playerId="sessionId"></player-card>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PlayerCard from '../components/PlayerCard.vue';
import { Player } from '../schema/Player';
import { colyseusService } from '../main';
import GameTiles from '../components/GameTiles.vue';
import GameButtons from '../components/GameButtons.vue';
import { mapState, mapMutations } from 'vuex';
import { GameState } from '../store';

export default Vue.extend({
  data() {
    const players: { [id: string]: Player } = {};
    const sessionId = '';
    return { players, sessionId };
  },
  created() {
    // Join the room and subsribe to colyseus updates
    const roomId = this.$route.params.roomId;
    const room = colyseusService.room;
    if (room) {
      //Setup player list
      room.state.players.onAdd = (player, idx) => {
        this.$set(this.players, idx, player);
      };
      room.state.players.onRemove = (_, idx) => {
        this.$delete(this.players, idx);
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

      this.sessionId = room.sessionId;
    }
  },
  computed: {
    playerCount(): number {
      return Object.keys(this.players).length;
    },
    nonUserPlayersIds(): string[] {
      return Object.keys(this.players).filter(key => key !== this.sessionId);
    },
    userPlayer(): Player | null {
      if (this.sessionId in this.players) {
        return this.players[this.sessionId];
      }
      return null;
    },
    ...mapState<GameState>({
      currentTurn: 'currentTurn',
      gameStarted: 'gameStarted',
    }),
  },
  components: {
    PlayerCard,
    GameTiles,
    GameButtons,
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

.game-board {
  grid-area: game-board;
}
</style>
