<template>
  <article class="media">
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{ name }}</strong>
          <br />
          {{ body }}
          <br />
          <small>{{ date }}</small>
        </p>
      </div>
    </div>
  </article>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ChatMessage extends Vue {
  @Prop({ default: '' }) name!: string
  @Prop({ default: '' }) body!: string
  @Prop({ default: '' }) date!: string
}
</script>