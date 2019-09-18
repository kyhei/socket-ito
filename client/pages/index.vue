<template>
  <section class="section">
    <nuxt-link to="/rooms">Rooms page</nuxt-link>
    <br />

    <ModalWindow
      :show="show"
      :closeBtn="false"
      @close="onClose"
    >
      <template v-slot:content>
        <NickName @setName="onSetName" />
      </template>
    </ModalWindow>

    <button
      class="button is-primary mt8"
      @click="openModal"
    >Open Modal</button>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ModalWindow from '@/components/Common/ModalWindow.vue'
import NickName from '@/components/Chat/NickName.vue'

@Component({
  components: {
    ModalWindow,
    NickName
  }
})
export default class IndexPage extends Vue {
  show: boolean = false

  openModal() {
    this.show = true
  }

  onClose() {
    this.show = false
  }

  onSetName(nickName: string) {
    console.log(nickName)
    this.onClose()
  }
}
</script>