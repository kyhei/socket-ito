<template>
  <div class="number-card">
    <h1>{{numberText}}</h1>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class NumberCardComponent extends Vue {
  @Prop({ default: '100' }) numberText!: string
}
</script>
<style lang="scss" scoped>
.number-card {
  display: flex;
  height: 180px;
  width: 120px;
  background-color: hsl(0, 0%, 96%);
  border-radius: 6px;
  h1 {
    margin: auto;
    font-weight: 300;
    font-size: 48px;
    color: hsl(0, 0%, 29%);
  }
}
</style>