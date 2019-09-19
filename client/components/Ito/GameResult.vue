<template>
  <div class="container">
    <div class="body">{{resultText}}</div>
    <div class="cards">
      <div
        class="card"
        :class="(mynumber == num)? 'my':''"
        v-for="num in numbers"
        :key="num"
      >
        <h1>{{num}}</h1>
      </div>
    </div>
    <div class="footer-area">
      <button
        class="button is-primary"
        @click="pressed"
      >Next Game</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class GameResultComponent extends Vue {
  @Prop({ default: 0 }) mynumber!: number
  @Prop({ default: [] }) numbers!: number[]
  @Prop({ default: '' }) resultText!: string

  pressed() {
    this.$emit('next-game')
  }
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background-color: #fff;
  border-radius: 6px;
}

.cards {
  display: flex;
  justify-content: center;

  .card {
    margin-top: 20px;
    display: flex;
    height: 45px;
    width: 30px;
    background-color: hsl(0, 0%, 96%);
    border-radius: 3px;
    h1 {
      margin: auto;
      font-weight: 300;
      font-size: 17px;
      color: hsl(0, 0%, 29%);
    }

    &:not(:first-of-type) {
      margin-left: 16px;
    }

    &.my {
      background-color: #a7ffeb;
    }
  }
}

.body {
  display: block;
  text-align: center;
  font-weight: 300;
  font-size: 24px;
  color: hsl(0, 0%, 29%);
}

.footer-area {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
