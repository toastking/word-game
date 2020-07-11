<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        Players
      </p>
    </header>
    <div class="card-content">
      <b-table :data="playersInScoreOrder" :columns="columns"></b-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { PlayerState } from '@/store';
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
