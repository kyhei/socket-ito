<template>
  <div>
    <section class="section">
      <div class="content">
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
          <br />数字が小さいと思われるプレイヤーから順にカードを場に出していきましょう。
          <br />
          <br />
          <strong>しかし手元の数字を誰にも教えてはいけません。</strong>
          <br />
          <br />お題に沿って自分の数字を表現してください。
        </p>
        <p>
          お題が
          <strong>【ベスト】ぐっとくる異性の仕草</strong>
          <br />自分に配られた数字が
          <strong>10</strong>です。
          <br />あなたならこの数字をどのように表現しますか？
          <br />僕は
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
    </section>
    <footer class="footer-area">
      <p>&copy; 2019 kyhei.</p>
    </footer>
  </div>
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
<style lang="scss" scoped>
.content {
  line-height: 1.7;
  p {
    font-size: 0.9rem;
  }
}
.footer-area {
  background-color: #fafafa;
  display: block;
  width: 100vw;
  text-align: center;
  padding: 20px;
}
</style>