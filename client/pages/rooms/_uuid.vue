<template>
  <section class="section">
    <!--
    <ChatTimeline :messages="messages" />
    <ChatForm
      class="mt30"
      @send="onSend"
    />
    -->
    <Timeline :messages="messages" />
    <Theme
      :theme="theme"
      class="mt8"
    />
    <div class="control-area">
      <NumberCard :numberText="numberCard" />
      <div class="buttons">
        <ReadyButton
          @ready="ready"
          :disable="isReady"
        />
        <PutOutButton
          @put="putNumberCard"
          :disable="isPut || !isGameStarted"
        />
      </div>
    </div>

    <div class="exit-area">
      <nuxt-link
        to="/rooms"
        class="button is-danger"
      >Exit Room</nuxt-link>
    </div>

    <ModalWindow
      :show="show"
      :closeBtn="false"
    >
      <template v-slot:content>
        <NickName @setName="onSetName" />
      </template>
    </ModalWindow>

    <ModalWindow
      :show="isGameFinish"
      :closeBtn="false"
    >
      <template v-slot:content>
        <GameResult
          :mynumber="numberCard"
          :numbers="numbers"
          :resultText="resultText"
          @next-game="resetState"
        />
      </template>
    </ModalWindow>
  </section>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

// import ChatForm from '@/components/Chat/Form.vue'
// import ChatTimeline from '@/components/Chat/Timeline.vue'
import NickName from '@/components/Chat/NickName.vue'

import ModalWindow from '@/components/Common/ModalWindow.vue'

import { Message } from '@/components/Ito/types'
import Theme from '@/components/Ito/Theme.vue'
import NumberCard from '@/components/Ito/NumberCard.vue'
import ReadyButton from '@/components/Ito/ReadyButton.vue'
import PutOutButton from '@/components/Ito/PutOutButton.vue'
import Timeline from '@/components/Ito/Timeline.vue'
import GameResult from '@/components/Ito/GameResult.vue'

import { SOCKETPORT } from '@/utilities'

import io from 'socket.io-client'

@Component({
  components: {
    // ChatForm,
    // ChatTimeline,
    NickName,
    ModalWindow,
    Theme,
    NumberCard,
    ReadyButton,
    PutOutButton,
    Timeline,
    GameResult
  }
})
export default class RoomPage extends Vue {
  socket: SocketIOClient.Socket | null = null
  messages: Message[] = []
  clientId: string = ''
  roomUuid: string = ''
  nickName: string = ''
  show: boolean = false
  isGameStarted: boolean = false
  isGameFinish: boolean = false
  isReady: boolean = false
  isPut: boolean = false
  theme: string = 'じゅんびちゅう。。。'
  numberCard: number = 0
  numbers: number[] = []
  resultText: string = ''

  beforeMount() {
    this.roomUuid = this.$route.params.uuid
  }

  mounted() {
    this.openModal()
  }

  initializeSocket() {
    this.socket = io(`http://${location.hostname}:${SOCKETPORT}`)
    this.socket.on('join room', this.onJoinRoom)
    this.socket.on('room not found', this.onRoomNotFound)
    this.socket.on('connect', this.onConnected)
    this.socket.on('reconnect', this.onReConnected)
    this.socket.on('exception', this.onException)
    this.socket.on('disconnect', this.onDisConnected)
    this.socket.on('left room', this.onLeave)
    //this.socket.on('new message', this.onChat)
    //this.socket.on('fetch all messages', this.onFetchAllMessages)

    this.socket.on('get room members', this.onGetRoomMembers)
    this.socket.on('user ready', this.onUserReady)
    this.socket.on('game start', this.onGameStart)
    this.socket.on('fetch number card', this.onFetchNumberCard)
    this.socket.on('put number card', this.onPutNumberCard)
    this.socket.on('game end', this.onGameEnd)

    this.socket.emit('identity', (response: any) => {
      console.log('Identity:', response)
      this.clientId = response.id
    })

    this.socket.emit('join room', {
      roomUuid: this.roomUuid,
      nickName: this.nickName
    })

    //this.socket.emit('fetch all messages', this.roomUuid)
  }

  ready() {
    if (this.socket === null) {
      return
    }

    this.socket.emit('user ready', this.roomUuid)
    this.isReady = true
  }

  putNumberCard() {
    if (this.socket === null) {
      return
    }

    this.socket.emit('put number card', {
      roomUuid: this.roomUuid,
      num: this.numberCard
    })
    this.isPut = true
  }

  resetState() {
    console.log('resetState is called')
    this.numberCard = 0
    this.isReady = false
    this.isPut = false
    this.isGameStarted = false
    this.isGameFinish = false
    this.theme = 'じゅんびちゅう。。。'
    this.numbers = []
    this.resultText = ''
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
    //this.$store.commit('notification/setMessage', `${friendName} is joined`)
    this.messages.push({
      id: this.messages.length + 1,
      content: `${friendName} が入室しました！`,
      date: new Date().toISOString().slice(0.19)
    })
  }

  onRoomNotFound() {
    this.messages.push({
      id: this.messages.length + 1,
      content: `指定されたルームが見つかりませんでした。`,
      date: new Date().toISOString().slice(0.19)
    })

    setTimeout(() => {
      this.$router.push('/rooms')
    }, 3000)
  }

  onGetRoomMembers(memberNames: string[]) {
    for (const memberName of memberNames) {
      this.messages.push({
        id: this.messages.length + 1,
        content: `${memberName} と合流しました！`,
        date: new Date().toISOString().slice(0.19)
      })
    }
  }

  onConnected() {
    console.log('Connected')
  }

  onReConnected(attemptNumber: number) {
    console.log('Re Connected')
    if (this.socket === null) {
      return
    }

    this.socket.emit('join room', {
      roomUuid: this.roomUuid,
      nickName: this.nickName
    })

    this.socket.emit(
      'fetch all messages',
      this.roomUuid,
      (messages: Message[]) => {
        console.log('message received')
        for (const message of messages) {
          this.messages.push({
            id: this.messages.length + 1,
            content: message.content,
            date: message.date
          })
        }
      }
    )
  }

  onDisConnected() {
    console.log('Disconnected')
  }

  onException(err: any) {
    console.log('error', err)
  }

  /*
  onJoin() {
    console.log('someone is joined')
    this.$store.commit('notification/setMessage', 'someone is joined')
  }
  */

  onLeave(nickName: string) {
    // this.$store.commit('notification/setMessage', `${nickName} is left`)
    this.messages.push({
      id: this.messages.length + 1,
      content: `${nickName} が退出しました`,
      date: new Date().toISOString().slice(0.19)
    })
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

  onUserReady(nickName: string) {
    this.messages.push({
      id: this.messages.length + 1,
      content: `${nickName} の準備が整いました。`,
      date: new Date().toISOString().slice(0.19)
    })
  }

  onGameStart(odai: string) {
    this.isGameStarted = true
    this.theme = odai
    this.$store.commit('notification/setMessage', `Game is start!!`)

    if (this.socket !== null) {
      this.socket.emit('fetch number card')
    }
  }

  onFetchNumberCard(numberCard: number) {
    this.numberCard = numberCard
  }

  onPutNumberCard(nickName: string) {
    this.messages.push({
      id: this.messages.length + 1,
      content: `${nickName} がカードを出しました！`,
      date: new Date().toISOString().slice(0.19)
    })
  }

  onGameEnd(result: { win: boolean; result: number[] }) {
    this.messages.push({
      id: this.messages.length + 1,
      content: `Finish!!`,
      date: new Date().toISOString().slice(0.19)
    })

    const message = result.win ? 'You Win!!' : 'You Lose...'
    // this.$store.commit('notification/setMessage', message)
    this.numbers = result.result
    this.resultText = message
    this.isGameFinish = true
  }
  /** websocket callbacks end */

  /** vue life cycle hooks */

  beforeDestroy() {
    if (this.socket === null) {
      return
    }
    this.socket.emit('left room', this.roomUuid)
    this.socket.close()
  }

  /** vue life cycle hooks  end */
}
</script>
<style lang="scss" scoped>
.section {
  padding-top: 1rem;
}
.control-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 32px;

  .buttons {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}

.exit-area {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>