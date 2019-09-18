<template>
  <section class="section">
    <div>{{ $route.params.uuid}}</div>
    <ChatTimeline :messages="messages" />
    <ChatForm
      class="mt30"
      @send="onSend"
    />
    <ModalWindow
      :show="show"
      :closeBtn="false"
      @close="onClose"
    >
      <template v-slot:content>
        <NickName @setName="onSetName" />
      </template>
    </ModalWindow>
  </section>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import { Message } from '@/components/Chat/types'
import ChatForm from '@/components/Chat/Form.vue'
import ChatTimeline from '@/components/Chat/Timeline.vue'
import NickName from '@/components/Chat/NickName.vue'

import ModalWindow from '@/components/Common/ModalWindow.vue'

import io from 'socket.io-client'

@Component({
  components: {
    ChatForm,
    ChatTimeline,
    NickName,
    ModalWindow
  }
})
export default class RoomPage extends Vue {
  socket: SocketIOClient.Socket | null = null
  messages: Message[] = []
  clientId: string = ''
  roomUuid: string = ''
  nickName: string = ''
  show: boolean = false

  beforeMount() {
    this.roomUuid = this.$route.params.uuid
  }

  mounted() {
    this.openModal()
  }

  initializeSocket() {
    this.socket = io('http://localhost:3001')
    this.socket.on('join room', this.onJoinRoom)
    this.socket.on('connect', this.onConnected)
    this.socket.on('exception', this.onException)
    this.socket.on('disconnect', this.onDisConnected)
    this.socket.on('join', this.onJoin)
    this.socket.on('left room', this.onLeave)
    this.socket.on('new message', this.onChat)
    this.socket.on('fetch all messages', this.onFetchAllMessages)

    this.socket.emit('identity', (response: any) => {
      console.log('Identity:', response)
      this.clientId = response.id
    })

    this.socket.emit('join room', {
      roomUuid: this.roomUuid,
      nickName: this.nickName
    })

    this.socket.emit('fetch all messages', this.roomUuid)
  }

  /** modal controll */
  openModal() {
    this.show = true
  }

  onClose() {
    this.show = false
  }
  /** modal controll end */

  onSetName(nickName: string) {
    this.nickName = nickName
    this.initializeSocket()
    this.onClose()
  }

  /** websocket callbacks */
  onJoinRoom(friendName: string) {
    this.$store.commit('notification/setMessage', `${friendName} is joined`)
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

  onLeave(nickName: string) {
    this.$store.commit('notification/setMessage', `${nickName} is left`)
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
      name: this.clientId,
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