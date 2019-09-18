<template>
  <div class="card">
    <div class="card-content">
      <p>Enter your nick name</p>
      <div class="content mt8">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Normal input"
              v-model="nickName"
            />
          </div>
        </div>
      </div>
    </div>
    <footer class="card-footer">
      <button
        class="button is-primary is-outlined"
        @click="setName"
      >OK</button>
    </footer>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class NickNameComponent extends Vue {
  nickName: string = ''

  setName() {
    if (this.nickName.length === 0) {
      return
    }

    this.$emit('setName', this.nickName)
    this.nickName = ''
  }
}
</script>
<style lang="scss" scoped>
.card-footer {
  justify-content: center;
  padding: 12px;
}
</style>