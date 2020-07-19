<template>
  <div
    class="box game-tile"
    :class="{
      'has-background-grey-lighter': isSelectedTile,
      'has-background-dark': placedTile,
      'has-text-white-ter': placedTile,
    }"
    @click="clicked()"
  >
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
import { mapState, mapMutations } from 'vuex';
export default Vue.extend({
  props: {
    tile: { type: Object as PropType<Tile>, required: true },
    idx: { type: Number, required: false },
    placedTile: { type: Boolean, required: false },
  },
  computed: {
    ...mapState(['selectedTile']),
    isSelectedTile(): boolean {
      return this.idx === this.selectedTile;
    },
  },
  methods: {
    clicked() {
      this.$emit('tile-clicked');
    },
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
