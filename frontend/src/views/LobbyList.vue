<template>
  <section>
    <div class="container">
      <room-list></room-list>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import RoomList from "../components/RoomList.vue";
export default Vue.extend({
  components: { RoomList },
});
</script>
