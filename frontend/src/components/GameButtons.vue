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
import { mapState } from 'vuex';

export default Vue.extend({
  data() {
    return {
      playerId: '',
      loading: false,
    };
  },
  created() {
    const room = colyseusService.room;
    if (room) {
      this.playerId = room.sessionId;
    }
  },
  computed: {
    isYourTurn(): boolean {
      return this.currentTurn === this.playerId;
    },

    ...mapState({ gameStarted: 'gameStarted', currentTurn: 'currentTurn' }),
  },
  methods: {
    startGame() {
      colyseusService.room?.send('startGame');
    },
    playWord() {
      colyseusService.room?.send('playWord');
    },
  },
});
</script>
