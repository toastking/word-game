<template>
  <div class="tile is-ancestor">
    <div v-for="room in rooms" :key="room.roomId" class="tile is-parent">
      <div class="tile is-child box">{{ room.name }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { client } from "../main";
import { RoomAvailable } from "colyseus.js";
export default Vue.extend({
  data() {
    const rooms: RoomAvailable<{}>[] = [];
    return { rooms };
  },
  created() {
    client.getAvailableRooms().then((rooms) => {
      this.rooms = rooms;
    });
  },
});
</script>
