<template>
  <article class="media">
    <div class="media-content">
      <div class="content">
        <small>{{ content }}</small>
      </div>
    </div>
  </article>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ChatMessage extends Vue {
  @Prop({ default: '' }) content!: string
  @Prop({ default: '' }) date!: string
}
</script>
<style lang="scss" scoped>
.media {
  margin-top: 0;
  padding-top: 0;
}
</style>