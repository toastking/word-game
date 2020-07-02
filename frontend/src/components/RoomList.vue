<template>
  <div class="tile is-ancestor">
    <div v-for="room in rooms" :key="room.roomId" class="tile is-parent">
      <div class="tile is-child box">
        <p>{{ room.roomId }}</p>
        <p>Players: {{ room.clients }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { client } from '../main';
import { RoomAvailable } from 'colyseus.js';
export default Vue.extend({
  data() {
    const rooms: RoomAvailable<{}>[] = [];
    return { rooms };
  },
  async created() {
    const lobby = await client.joinOrCreate('lobby');

    lobby.onMessage('rooms', rooms => {
      console.log(rooms);
      this.rooms = rooms;
    });

    lobby.onMessage('+', ([roomId, room]) => {
      const roomIndex = this.rooms.findIndex(room => room.roomId === roomId);
      if (roomIndex !== -1) {
        this.rooms.splice(roomIndex, 1, room);
      } else {
        this.rooms.push(room);
      }
    });

    lobby.onMessage('-', roomId => {
      this.rooms = this.rooms.filter(room => room.roomId !== roomId);
    });
  },
});
</script>
