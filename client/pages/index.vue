<template>
  <section class="section">
    <div class="content">
      <h3 class="subtitle is-3">Hello Socket Ito!</h3>

      <h4 class="subtitle is-4">What is Socket Ito?</h4>
      <p>
        Socket Itoはアークライトゲームズ社から発売されたボードゲーム、
        <a
          href="https://arclightgames.jp/product/ito/"
          target="_blank"
        >ito（イト）</a>にインスパイアされたWEBアプリです。
      </p>
      <p>いつでも、手軽にゲームが楽しめるようにシンプルなUIと心躍るUXを心がけました。</p>

      <h4 class="subtitle is-4">How to play?</h4>
      <p>Socket Itoはニュアンスと表現力を駆使し、プレイヤー全員が協力して勝利を目指すゲームです。</p>
      <p>
        はじめに1から100までの数字がランダムに書かれたカードが1枚渡されます。
        <br />カードを数字が小さい順に場に出していきましょう。
        <br />
        <strong>しかし手元の数字を誰にも教えてはいけません。</strong>
        <br />画面に表示されたお題に沿って自分の数字を表現してください。
      </p>
      <p>
        お題が
        <strong>ぐっとくる異性の仕草の順位</strong>
        <br />自分に配られた数字が
        <strong>10</strong>です。
        <br />あなたならこの数字をどのように表現しますか？
        <br />ちなみに僕は
        <strong>ゴミを見るような目で見下される</strong>です。
      </p>

      <p>あなたなりのニュアンスで数字を表現しましょう。</p>

      <h4 class="subtitle is-4">How to start?</h4>
      <p>
        準備ができましたか？
        <br />早速ルームを作成し、みんなで入室しましょう！
      </p>
    </div>
    <div class="container">
      <nuxt-link
        to="/rooms"
        class="button is-primary"
      >Goto Lobby</nuxt-link>
    </div>

    <br />
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class IndexPage extends Vue {}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
}
</style>