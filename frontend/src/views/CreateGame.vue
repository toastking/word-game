<template>
  <section>
    <div class="container">
      <h2>Create Game</h2>
      <b-field label="Player Name">
        <b-input placeholder="Player Name" v-model="playerName"></b-input>
      </b-field>
      <b-button class="button is-primary" v-on:click="createGame"
        >Create Game</b-button
      >
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { client } from "../main";
export default Vue.extend({
  data() {
    return { playerName: "" };
  },
  methods: {
    createGame() {
      client.create("game", { playerName: this.playerName });
    }
  }
});
</script>
