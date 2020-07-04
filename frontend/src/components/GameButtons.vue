<template>
  <div class="box game-buttons">
    <!-- TODO: add do turn button and start game button-->
    <b-button
      type="is-primary"
      v-if="gameStarted === true"
      :loading="loading === true"
      @click="playWord()"
      >Play Word</b-button
    >
    <b-button
      type="is-success"
      v-if="gameStarted === false"
      :loading="loading === true"
      @click="startGame()"
      >Start Game</b-button
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { colyseusService } from '../main';

export default Vue.extend({
  data() {
    return {
      gameStarted: false,
      currentTurn: '',
      playerId: '',
      loading: false,
    };
  },
  created() {
    const room = colyseusService.room;
    if (room) {
      this.playerId = room.sessionId;

      this.gameStarted = room.state.gameStarted;
      this.currentTurn = room.state.currentTurn;
    }
  },
  computed: {
    isYourTurn(): boolean {
      return this.currentTurn === this.playerId;
    },
  },
  methods: {
    startGame() {
      colyseusService.room?.send('startGame');
    },
    playWord() {
      colyseusService.room?.send('playWord');
    },
  },
  watch: {
    updatedGameStarted() {
      const room = colyseusService?.room;
      if (room) {
        this.gameStarted = room.state.gameStarted;
      }
    },
    updateCurrentTurn() {
      const room = colyseusService?.room;
      if (room) {
        this.currentTurn = room.state.currentTurn;
      }
    },
  },
});
</script>
