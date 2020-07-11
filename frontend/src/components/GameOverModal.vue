<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        Game Over!
      </p>
    </header>
    <div class="card-image">
      <figure class="image is-4by3">
        <img src="../assets/word-tiles.jpg" alt="Image" />
      </figure>
    </div>
    <div class="card-content">
      <p class="is-size-7 has-text-centered">
        Photo by
        <a
          href="https://unsplash.com/@priscilladupreez?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
          >Priscilla Du Preez</a
        >
        on
        <a
          href="https://unsplash.com/s/photos/scrabble?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
          >Unsplash</a
        >
      </p>

      <h3 class="is-size-3">Final Scores</h3>
      <b-table :data="playersInScoreOrder" :columns="columns"></b-table>
    </div>
    <footer class="card-footer">
      <router-link to="/" class="card-footer-item">Go Home</router-link>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { PlayerState } from '../store';
export default Vue.extend({
  data() {
    const columns: Array<{ field: keyof PlayerState; label: string }> = [
      { field: 'name', label: 'Name' },
      { field: 'score', label: 'Score' },
    ];
    return { columns };
  },
  computed: {
    ...mapGetters(['playersInScoreOrder']),
  },
});
</script>
