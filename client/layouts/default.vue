<template>
  <div>
    <transition name="fade">
      <div
        class="notification is-info is-fix"
        v-if="isShow"
      >{{ message }}</div>
    </transition>

    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <nuxt-link
            class="title"
            to="/"
          >Socket Ito</nuxt-link>
        </div>
      </div>
    </section>
    <nuxt />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class DefaultLayout extends Vue {
  get message() {
    return this.$store.state.notification.message
  }

  get isShow() {
    return this.$store.state.notification.show
  }

  @Watch('isShow')
  onIsShowChanged(val: boolean, oldVal: boolean) {
    if (val === false) {
      return
    }

    setTimeout(() => {
      this.$store.commit('notification/resetMessage')
    }, 2500)
  }
}
</script>
<style lang="scss" scoped>
.is-fix {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>