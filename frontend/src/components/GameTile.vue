<template>
  <div class="box game-tile">
    <p
      id="letter"
      class="is-family-monospace has-text-weight-semibold	is-size-4"
    >
      {{ tile.letter }}
    </p>
    <p class="has-text-weight-light is-size-7">{{ tile.points }}</p>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Tile } from '../schema/Tile';
export default Vue.extend({
  props: {
    tile: { type: Object as PropType<Tile>, required: true },
  },
});
</script>

<style scoped>
.game-tile {
  display: flex;
  flex-direction: row;
  margin-top: auto;
  margin-bottom: auto;
}

#letter {
  height: 1.5rem;
  width: 1.5rem;
}
</style>
