<template>
  <transition name="modal">
    <div
      class="modal is-active"
      v-if="show"
    >
      <div class="modal-background"></div>
      <div class="modal-content">
        <slot name="content"></slot>
      </div>
      <button
        v-if="closeBtn"
        class="modal-close is-large"
        aria-label="close"
        @click="close"
      ></button>
    </div>
  </transition>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ModalWindowComponent extends Vue {
  @Prop({ default: false }) show!: boolean
  @Prop({ default: true }) closeBtn!: boolean

  close() {
    this.$emit('close')
  }
}
</script>
<style scoped>
.modal {
  transition: all 0.5s;
}

.modal-content {
  padding: 24px;
}
/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
