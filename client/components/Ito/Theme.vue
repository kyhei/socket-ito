<template>
  <section>
    <p>今回のお題は、、、</p>
    <h2 class="subtitle is-4 mt8">{{ theme }}</h2>
  </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ItoThemeComponent extends Vue {
  @Prop({ default: 'ここにお題が表示されるよ！' }) theme!: string
}
</script>
<style lang="scss" scoped>
</style>