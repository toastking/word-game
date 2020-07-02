<template>
  <div class="tile is-ancestor">
    <div v-for="room in rooms" :key="room.roomId" class="tile is-parent">
      <div class="tile is-child box">
        <div class="level">
          <div class="level-left">
            <p class="level-item">{{ room.roomId }}</p>
            <p class="level-item">Players: {{ room.clients }}</p>
          </div>
          <div class="level-right">
            <div class="level-item">
              <b-button
                type="is-success"
                size="is-small"
                @click="openJoinGameModal(room.roomId)"
                >Join Game</b-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { colyseusService } from '../main';
import { RoomAvailable } from 'colyseus.js';
import JoinModal from './JoinModal.vue';
export default Vue.extend({
  data() {
    const rooms: RoomAvailable<{}>[] = [];
    return { rooms };
  },
  async created() {
    const lobby = await colyseusService.getLobby();

    lobby.onMessage('rooms', rooms => {
      this.rooms = rooms;
    });

    lobby.onMessage('+', ([roomId, room]) => {
      const roomIndex = this.rooms.findIndex(room => room.roomId === roomId);
      if (roomIndex !== -1) {
        this.rooms.splice(roomIndex, 1);
      } else {
        this.rooms.push(room);
      }
    });

    lobby.onMessage('-', roomId => {
      this.rooms = this.rooms.filter(room => room.roomId !== roomId);
    });
  },
  methods: {
    openJoinGameModal(roomId: string): void {
      this.$buefy.modal.open({
        component: JoinModal,
        parent: this,
        hasModalCard: true,
        trapFocus: true,
        props: { roomId },
      });
    },
  },
});
</script>
