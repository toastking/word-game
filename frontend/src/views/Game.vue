<template>
  <div class="container">
    <div class="tile is-ancestor">
      <div class="tile is-parent is-vertical">
        <div class="tile is-child">
          <!-- Player 3 -->
          <player-card
            v-if="playerCount > 2"
            :player="players[nonUserPlayersIds[1]]"
            :playerId="nonUserPlayersIds[1]"
            :currentTurn="currentTurn"
          ></player-card>
        </div>
        <div class="tile is-child is-10">
          <!-- Game board and player areas-->
          <div class="tile is-3">
            <!-- Player 2 -->
            <player-card
              v-if="playerCount > 1"
              :player="players[nonUserPlayersIds[0]]"
              :playerId="nonUserPlayersIds[0]"
              :currentTurn="currentTurn"
            ></player-card>
          </div>
          <div class="tile game-board"></div>
          <div class="tile is-3">
            <!-- Player 4 -->
            <player-card
              v-if="playerCount > 3"
              :player="players[nonUserPlayersIds[2]]"
              :playerId="nonUserPlayersIds[2]"
              :currentTurn="currentTurn"
            ></player-card>
          </div>
        </div>
        <div class="tile is-child">
          <!-- User Player (Player 1) -->
          <player-card
            v-if="userPlayer !== null"
            :player="userPlayer"
            :playerId="sessionId"
          ></player-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PlayerCard from '../components/PlayerCard.vue';
import { Player } from '../schema/Player';
import { colyseusService } from '../main';
export default Vue.extend({
  data() {
    const players: { [id: string]: Player } = {};
    const currentTurn = '';
    const sessionId = '';
    return { players, currentTurn, sessionId };
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
          if (change.field === 'currentTurn') {
            this.currentTurn = change.value;
          }
        });
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
  },
  components: {
    PlayerCard,
  },
});
</script>
