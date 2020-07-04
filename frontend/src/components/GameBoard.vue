<template>
  <div class="game-board box">
    <game-board-section
      v-for="(tile, idx) in gameBoard"
      :key="idx"
      :idx="idx"
      :tile="tile"
      gridItemClass="grid-item"
    ></game-board-section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import GameBoardSection from '@/components/GameBoardSection.vue';
export default Vue.extend({
  computed: {
    ...mapState(['gameBoard']),
  },
  components: {
    GameBoardSection,
  },
});
</script>

<style lang="scss">
$grid-size: 15;
.game-board {
  display: grid;
  grid-template-rows: repeat($grid-size, 1fr);
  grid-template-columns: repeat($grid-size, 1fr);
  column-gap: 5px;
  row-gap: 5px;
}
</style>
