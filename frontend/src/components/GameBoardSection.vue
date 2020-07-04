<template>
  <div>
    <div
      id="empty-grid-space"
      v-if="isEmpty === true"
      :class="gridItemClass + ' box'"
    ></div>
    <game-tile v-else :tile="tile"></game-tile>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Tile } from '@/schema/Tile';
import GameTile from '@/components/GameTile.vue';
export default Vue.extend({
  props: {
    idx: {
      type: Number,
      required: true,
    },
    tile: {
      type: Object as PropType<Tile | undefined>,
      required: true,
    },
    gridItemClass: {
      type: String,
      required: true,
    },
  },
  computed: {
    isEmpty(): boolean {
      return this.tile === undefined || this.tile.points < 0;
    },
  },
  components: {
    GameTile,
  },
});
</script>
<style scoped>
#empty-grid-space {
  height: 1.5rem;
  width: 1.5rem;
}
</style>
