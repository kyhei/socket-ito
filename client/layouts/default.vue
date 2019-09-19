<template>
  <div>
    <transition name="fade">
      <div
        class="wrapper is-fix"
        v-if="isShow"
      >
        <div class="notification is-info">
          <p>{{ message }}</p>
        </div>
      </div>
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
.wrapper {
  height: 100%;
  width: 100vw;
  display: flex;
  .notification {
    margin: auto;
    width: 80%;
    height: 100px;
    display: flex;
    p {
      margin: auto;
      font-size: 24px;
    }
  }
}
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