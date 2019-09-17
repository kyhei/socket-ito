<template>
  <div>
    <transition-group
      name="list"
      tag="div"
      class="timeline"
    >
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :name="message.name"
        :body="message.content"
        :date="message.date"
      ></ChatMessage>
    </transition-group>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ChatMessage from './Message.vue'
import { Message } from './types'

@Component({
  components: {
    ChatMessage
  }
})
export default class ChatTimeline extends Vue {
  @Prop({ default: [] }) messages!: Message[]

  @Watch('messages')
  goBottom() {
    this.$nextTick(() => {
      const timeline = document.getElementsByClassName('timeline')[0]
      const latest = timeline.children[timeline.children.length - 1]
      timeline.scrollTop = timeline.scrollHeight
    })
  }
}
</script>
<style lang="scss" scoped>
.timeline {
  height: 300px;
  overflow-y: scroll;
  border-top: 1px solid #e9e9e9;
  border-bottom: 1px solid #e9e9e9;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.6s;
}
.list-enter, .list-leave-to /* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>