<template>
  <button
    class="button is-large is-warning"
    @click="pressed"
    :disabled="disable"
  >PutOut!</button>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class PutOutButtonComponent extends Vue {
  @Prop({ default: false }) disable!: boolean

  pressed() {
    this.$emit('put', true)
  }
}
</script>
<style lang="scss" scoped>
</style>