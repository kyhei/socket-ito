<template>
  <div>
    <button
      class="button is-info"
      @click="submit"
    >Submit</button>
    <div class="field mt8">
      <p class="control">
        <textarea
          class="textarea"
          placeholder="Add a comment..."
          v-model="message"
          @keydown.enter.meta="submit"
        ></textarea>
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class ChatFormComponent extends Vue {
  message: string = ''
  submit() {
    if (this.message.length === 0) {
      return
    }
    this.$emit('send', this.message)
    this.reset()
  }

  reset() {
    this.message = ''
  }
}
</script>