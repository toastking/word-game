<template>
  <div class="box">
    <p>
      <span class="is-size-5 has-text-weight-semibold">Name: </span>
      <span class="is-family-secondary">{{ player.name }} </span>
      <b-tooltip v-if="isYourTurn === true" label="Your Turn!">
        <b-icon pack="fas" icon="crown" type="is-warning"></b-icon>
      </b-tooltip>
    </p>
    <p>
      <span class="is-size-5 has-text-weight-semibold">Score: </span>
      <span class="is-family-secondary">{{ player.score }}</span>
    </p>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import { Player } from '@/schema/Player';
import { mapState } from 'vuex';
import { PlayerState } from '../store';
export default Vue.extend({
  props: {
    playerId: String,
  },
  computed: {
    ...mapState(['currentTurn', 'players']),
    isYourTurn() {
      return this.playerId === this.currentTurn;
    },
    player(): PlayerState {
      return this.players[this.playerId];
    },
  },
});
</script>
