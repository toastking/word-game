<template>
  <div class="game-board box">
    <game-board-section
      v-for="idx in gameBoardLength"
      :key="idx"
      :idx="idx"
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
    gameBoardLength() {
      return this.gameBoard.length;
    },
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
}
</style>
