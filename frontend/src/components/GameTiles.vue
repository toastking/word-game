<template>
  <div class="box tiles">
    <game-tile v-for="(tile, idx) in tiles" :key="idx" :tile="tile"></game-tile>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Tile } from '../schema/Tile';
import GameTile from './GameTile.vue';
export default Vue.extend({
  props: {
    tiles: {
      type: Array as PropType<Array<Tile>>,
      required: true,
    },
  },
  components: {
    GameTile,
  },
});
</script>

<style scoped>
.tiles {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>
