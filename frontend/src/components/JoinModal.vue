<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Join Game</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Player Name">
          <b-input
            type="input"
            v-model="playerName"
            placeholder="Player Name"
            required
          >
          </b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">
          Cancel
        </button>
        <button
          class="button is-primary"
          @click="
            joinGame();
            $parent.close();
          "
        >
          Join Game
        </button>
      </footer>
    </div>
  </form>
</template>

<script lang="ts">
import { colyseusService } from '../main';
import Vue from 'vue';
export default Vue.extend({
  props: {
    roomId: { type: String, required: true },
  },
  data() {
    return { playerName: '' };
  },
  methods: {
    async joinGame(): Promise<void> {
      const roomId = await colyseusService.joinGame(
        this.roomId,
        this.playerName
      );
      this.$router.push({ name: 'Game', params: { roomId } });
    },
  },
});
</script>
