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
export default Vue.extend({
  props: {
    player: {
      type: Object as PropType<Player>,
    },
    playerId: String,
  },
  computed: {
    ...mapState({ currentTurn: 'currentTurn' }),
    isYourTurn() {
      return this.playerId === this.currentTurn;
    },
  },
});
</script>
