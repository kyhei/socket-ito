<template>
  <section class="section">
    <h3 class="subtitle is-3">These are available rooms</h3>

    <ul>
      <li
        v-for="room in rooms"
        :key="room.uuid"
      >
        <nuxt-link :to="`/rooms/${room.uuid}`">{{room.name}}</nuxt-link>
      </li>
    </ul>

    <input
      class="input mt30"
      type="text"
      placeholder="Insert your room name"
      v-model="roomName"
    />
    <button
      class="button is-primary mt8"
      @click="createRoom"
    >Create Room</button>

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