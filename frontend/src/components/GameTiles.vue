<template>
  <div class="box tiles">
    <game-tile
      class="tile-in-hand"
      v-for="(tile, idx) in tiles"
      :key="idx"
      :idx="idx"
      :tile="tile"
      v-on:tile-clicked="clickHandler(idx)"
    ></game-tile>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GameTile from './GameTile.vue';
import { mapState, mapMutations } from 'vuex';
export default Vue.extend({
  computed: {
    ...mapState({ tiles: 'playerHand' }),
  },
  methods: {
    ...mapMutations(['updateSelectedTile']),
    clickHandler(idx: number): void {
      this.updateSelectedTile(idx);
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

.tiles .tile-in-hand {
  cursor: pointer;
}
.tiles .tile-in-hand:hover {
  background: hsl(206, 70%, 96%);
}
</style>
