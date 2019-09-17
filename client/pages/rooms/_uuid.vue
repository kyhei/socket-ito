<template>
  <section class="section">
    <div>{{ $route.params.uuid}}</div>
    <ChatTimeline :messages="messages" />
    <ChatForm
      class="mt30"
      @send="onSend"
    />
  </section>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import { Message } from '@/components/Chat/types'
import ChatForm from '@/components/Chat/Form.vue'
import ChatTimeline from '@/components/Chat/Timeline.vue'

import io from 'socket.io-client'

@Component({
  components: {
    ChatForm,
    ChatTimeline
  }
})
export default class RoomPage extends Vue {
  socket: SocketIOClient.Socket | null = null
  messages: Message[] = []
  name: string = ''
  roomUuid: string = ''

  beforeMount() {
    this.roomUuid = this.$route.params.uuid
  }

  mounted() {
    this.socket = io('http://localhost:3001')
    this.socket.on('join room', this.onJoinRoom)

    this.socket.emit('join room', this.roomUuid)

    this.socket.on('connect', this.onConnected)
    this.socket.on('exception', this.onException)
    this.socket.on('disconnect', this.onDisConnected)
    this.socket.on('join', this.onJoin)
    this.socket.on('left room', this.onLeave)
    this.socket.on('new message', this.onChat)
    this.socket.on('fetch all messages', this.onFetchAllMessages)

    this.socket.emit('fetch all messages', this.roomUuid)

    this.socket.emit('identity', 0, (response: any) => {
      console.log('Identity:', response)
      this.name = response.id
    })
  }

  /** websocket callbacks */
  onJoinRoom() {
    console.log('success for joining room!')
    this.$store.commit('notification/setMessage', 'someone is joined')
  }

  onConnected() {
    console.log('Connected')
  }

  onDisConnected() {
    console.log('Disconnected')
  }

  onException(err: any) {
    console.log('error', err)
  }

  onJoin() {
    console.log('someone is joined')
    this.$store.commit('notification/setMessage', 'someone is joined')
  }

  onLeave() {
    console.log('someone is left')
    this.$store.commit('notification/setMessage', 'someone is left')
  }

  onChat(message: Message) {
    console.log(message)
    this.messages.push(message)
  }

  onFetchAllMessages(messages: Message[]) {
    this.messages = messages
  }

  onSend(message: string) {
    if (this.socket === null) {
      return
    }

    this.socket.emit('new message', {
      name: this.name,
      content: message,
      date: new Date().toISOString().slice(0.19),
      roomUuid: this.roomUuid
    })
  }
  /** websocket callbacks end */

  beforeDestroy() {
    if (this.socket === null) {
      return
    }
    this.socket.emit('left room', this.roomUuid)
    this.socket.close()
  }
}
</script>