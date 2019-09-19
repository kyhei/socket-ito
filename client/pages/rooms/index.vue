<template>
  <section class="section">
    <h5 class="subtitle is-5">
      ルームを作成
      <br />あるいは入室しましょう！
    </h5>

    <div class="field has-addons">
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="room name"
          v-model="roomName"
        />
      </div>
      <div class="control">
        <button
          class="button is-primary"
          @click="createRoom"
        >Create Room</button>
      </div>
    </div>

    <div
      v-if="rooms.length > 0"
      class="rooms"
    >
      <div class="is-small">here is rooms...</div>
      <nuxt-link
        v-for="room in rooms"
        :key="room.uuid"
        :to="`/rooms/${room.uuid}`"
        class="button is-link"
      >Join {{room.name}} room</nuxt-link>
    </div>
    <p v-else>ルームを作成しましょう！</p>

    <nuxt-child />
  </section>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import io from 'socket.io-client'

import { SOCKETHOST } from '@/utilities'

interface Room {
  uuid: string
  name: string
}

@Component
export default class RoomsPage extends Vue {
  socket: SocketIOClient.Socket | null = null
  rooms: Room[] = []
  roomName: string = ''

  mounted() {
    this.socket = io(SOCKETHOST)
    this.socket.on('fetch all rooms', this.onFetchAllRooms)
    this.socket.on('create room', this.onCreateRoom)

    this.socket.emit('fetch all rooms')
  }

  /** websocket callbacks */
  onFetchAllRooms(rooms: Room[]) {
    console.log('fetch all rooms')
    this.rooms = rooms
    console.log(this.rooms)
  }

  onCreateRoom(room: Room) {
    this.rooms.push(room)
  }
  /** websocket callbacks end */

  createRoom() {
    if (this.roomName.length === 0 || this.socket === null) {
      return
    }
    this.socket.emit('create room', this.roomName)
    this.roomName = ''
  }

  beforeDestroy() {
    if (this.socket === null) {
      return
    }
    this.socket.close()
  }
}
</script>
<style lang="scss" scoped>
.section {
  padding-top: 1rem;
}
.rooms {
  margin-top: 12px;
  display: grid;
  gap: 20px;
}
</style>