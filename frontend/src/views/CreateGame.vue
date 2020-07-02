<template>
  <section>
    <div class="container">
      <h2 class="is-size-2">Create Game</h2>
      <b-field label="Player Name">
        <b-input placeholder="Player Name" v-model="playerName"></b-input>
      </b-field>
      <b-button
        class="button is-primary"
        v-on:click="createGame"
        :loading="isLoading"
        >Create Game</b-button
      >
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { colyseusService } from '../main';
export default Vue.extend({
  data() {
    return { playerName: '', isLoading: false };
  },
  methods: {
    async createGame() {
      this.isLoading = true;
      await colyseusService.createGame(this.playerName);
      const roomId = colyseusService.room?.id;
      if (roomId) {
        this.$router.push({ name: 'Game', params: { roomId } });
      }
      //TODO: handle failed room creation

      this.isLoading = false;
    },
  },
});
</script>
