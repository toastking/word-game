<template>
  <section>
    <div class="container">
      <h2>Create Game</h2>
      <b-field label="Room Name">
        <b-input placeholder="Room Name"></b-input>
      </b-field>
      <b-field label="Player Name">
        <b-input placeholder="Player Name"></b-input>
      </b-field>
      <b-button class="button is-primary">Create Game</b-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>
