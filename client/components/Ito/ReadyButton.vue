<template>
  <button
    class="button is-large is-primary"
    @click="pressed"
    :disabled="disable"
  >Ready!</button>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ReadyButtonComponent extends Vue {
  @Prop({ default: false }) disable!: boolean

  pressed() {
    this.$emit('ready', true)
  }
}
</script>
<style lang="scss" scoped>
</style>