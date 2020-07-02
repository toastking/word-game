<template>
  <div class="box">
    <p>{{ player.name }}</p>
    <b-icon
      v-if="isYourTurn"
      pack="fas"
      icon="crown"
      type="is-warning"
    ></b-icon>
    <p>{{ player.score }}</p>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import { Player } from '@/schema/Player';
export default Vue.extend({
  props: {
    player: {
      type: Object as PropType<Player>,
    },
    playerId: String,
    /** Id of the current player who's turn it is */
    curentTurn: { type: String },
  },
  computed: {
    isYourTurn() {
      return this.playerId === this.curentTurn;
    },
  },
});
</script>
