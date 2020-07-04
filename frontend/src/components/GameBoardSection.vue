<template>
  <div class="grid-space">
    <div
      v-if="isEmpty === true"
      class="empty-grid-item box"
      :class="gridItemClass"
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
.empty-grid-item {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.empty-grid-item:hover {
  background: hsl(206, 70%, 96%);
}
</style>
