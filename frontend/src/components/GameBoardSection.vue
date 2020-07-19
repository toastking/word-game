<template>
  <div class="grid-space">
    <div
      v-if="isEmpty === true"
      class="empty-grid-item box"
      :class="gridItemClass"
      @click="placeTile()"
    >
      <b-icon
        v-if="isMiddleSpace === true"
        pack="fas"
        icon="star"
        type="is-primary"
      ></b-icon>
      <p id="letter"></p>
    </div>
    <game-tile v-else :tile="tile" v-on:tile-clicked="removeTile()"></game-tile>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Tile } from '@/schema/Tile';
import GameTile from '@/components/GameTile.vue';
import { BOARD_SIZE } from '../store';
import { colyseusService } from '../main';
import { mapState, mapGetters } from 'vuex';
export default Vue.extend({
  props: {
    idx: {
      type: Number,
      required: true,
    },
    gridItemClass: {
      type: String,
      required: true,
    },
  },
  computed: {
    tile(): Tile {
      return this.getTile(this.idx);
    },
    isEmpty(): boolean {
      return this.tile === undefined || this.tile.points < 0;
    },
    column(): number {
      const col = this.idx % BOARD_SIZE;
      return col;
    },
    row(): number {
      const row = Math.floor(this.idx / BOARD_SIZE);
      return row;
    },
    isMiddleSpace(): boolean {
      const midwayPoint = Math.floor(BOARD_SIZE / 2);
      return this.row === midwayPoint && this.column === midwayPoint;
    },
    ...mapGetters(['getSelectedTile', 'getTile']),
  },
  methods: {
    placeTile() {
      const tile: Tile = this.getSelectedTile;
      colyseusService.room?.send('placeTile', {
        row: this.row,
        column: this.column,
        letter: tile.letter,
        points: tile.points,
      });

      //Reset the selected tile
      this.$store.commit('resetSelectedTile');
    },
    removeTile() {
      colyseusService.room?.send('removeTile', {
        row: this.row,
        column: this.column,
        letter: this.tile.letter,
        points: this.tile.points,
      });
    },
  },
  components: {
    GameTile,
  },
});
</script>
<style scoped>
.grid-space,
.empty-grid-item {
  width: 100%;
  height: 100%;
}

.grid-space {
  cursor: pointer;
}

.grid-space:hover {
  background: hsl(206, 70%, 96%);
}

#letter {
  height: 1.5rem;
  width: 1.5rem;
}
</style>
