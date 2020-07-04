<template>
  <div class="box tiles">
    <game-tile v-for="(tile, idx) in tiles" :key="idx" :tile="tile"></game-tile>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GameTile from './GameTile.vue';
import { mapState } from 'vuex';
export default Vue.extend({
  computed: {
    ...mapState({ tiles: 'playerHand' }),
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
