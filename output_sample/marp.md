---
marp: true
theme: default
size: 16:9
pagination: true
header: "AIスライド生成の「構造化」アプローチ"
footer: "AI活用による業務効率化ガイド | © 2024"
style: |
  /* 基本設定 */
  section {
    font-family: 'Noto Sans JP', 'Roboto', sans-serif;
    font-size: 16pt;
    color: #333333;
    padding: 40px;
    padding-top: 110px;
    background-color: #FFFFFF;
  }

  /* タイトル(H1)をヘッダー領域に固定 */
  section h1 {
    position: absolute;
    top: 30px;
    left: 40px;
    width: 900px;
    font-size: 28pt;
    color: #0052CC;
    border-bottom: 2px solid #0052CC;
    padding-bottom: 10px;
    margin: 0;
  }

  /* 表紙レイアウト (S01) */
  .title-cover {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
    padding-top: 0;
  }
  .title-cover h1 {
    position: relative;
    top: 0;
    left: 0;
    font-size: 48pt;
    color: #333333;
    border-bottom: none;
    margin-bottom: 20px;
  }
  .title-cover h2 {
    font-size: 24pt;
    color: #0052CC;
    margin-bottom: 60px;
    font-weight: normal;
  }
  .presenter-info {
    font-size: 18pt;
    color: #666666;
  }

  /* グリッドレイアウト (L02, L03, C01) */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 20px;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }
  .column {
    padding: 20px;
    border-radius: 8px;
  }
  .bg-gray {
    background-color: #F4F5F7;
  }
  .bg-primary-light {
    background-color: #DEEBFF;
  }

  /* リストスタイル */
  ul {
    list-style: none;
    padding-left: 0;
  }
  li {
    margin-bottom: 15px;
    position: relative;
    padding-left: 30px;
  }
  li::before {
    content: "●";
    position: absolute;
    left: 0;
    color: #0052CC;
  }
  .check-list li::before {
    content: "✔";
    color: #00B8D9;
  }

  /* プロセスフロー (P01) */
  .step-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 40px;
  }
  .step-box {
    width: 30%;
    padding: 20px;
    border: 2px solid #DEEBFF;
    border-radius: 10px;
    position: relative;
    text-align: center;
  }
  .step-box.active {
    border-color: #0052CC;
    background-color: #DEEBFF;
    transform: scale(1.05);
  }
  .step-label {
    font-weight: bold;
    color: #0052CC;
    display: block;
    margin-bottom: 10px;
    font-size: 1.2em;
  }

  /* 中央メッセージ (S04) */
  .center-message {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    padding-top: 0;
  }
  .center-message h2 {
    font-size: 36pt;
    color: #0052CC;
  }

  /* 強調テキスト */
  strong {
    color: #0052CC;
  }

  /* フッター調整 */
  footer {
    background-color: #F4F5F7;
    width: 100%;
    left: 0;
    padding: 5px 40px;
  }
---

<!-- Slide 1: 表紙 -->
<!-- layoutId: S01 -->
<section class="title-cover">

# AIスライド生成の「構造化」アプローチ
## エンジニアリング視点で実現する、意図通りの高品質スライド作成術

<div class="presenter-info">
AI活用による業務効率化ガイド
</div>

</section>

---

<!-- Slide 2: アジェンダ -->
<!-- layoutId: S02 -->
<section>

# 本日のアジェンダ

<div style="margin-top: 60px; font-size: 1.4em;">

- 1. AIスライド生成の現状と課題
- 2. 解決策：情報を構造化して与える
- 3. スライド作成プロセスの3フェーズ分解
- 4. Phase 3：視覚化における具体的ステップ
- 5. まとめ：人間とAIの最適な役割分担

</div>

</section>

---

<!-- Slide 3: AIスライド生成の現状と限界 -->
<!-- layoutId: C01 -->
<section>

# AIスライド生成の現状と限界

<div class="grid-2">
<div class="column">

### 現状（できること）
- **多様なツールの登場:** Gemini, Nano Banana Pro, NotebookLM等
- **手軽な生成:** 雑な指示や文章から「それっぽい」スライドが即座に完成

</div>
<div class="column bg-gray">

### 限界（課題）
- **既視感とAI臭さ:** どこかで見たようなデザインになりがち
- **制御不能なランダム性:** 再現性がなく、意図が反映されにくい
- **実用性の不足:** 公式な発表には耐えられない品質

</div>
</div>

</section>

---

<!-- Slide 4: 解決策：情報を構造化して与える -->
<!-- layoutId: L02 -->
<section>

# 解決策：情報を構造化して与える

<div class="grid-2">
<div class="column">

### 構造化アプローチとは
AIに対して自然言語だけで依頼するのではなく、MarkdownやMermaid、YAMLなどの**「構造化された形式」**を介して対話する手法。

</div>
<div class="column">

### 期待される効果
<ul class="check-list">
<li><strong>認識の一致:</strong> AIとの解釈のズレを最小限に抑えられる</li>
<li><strong>修正の容易さ:</strong> 構造化データの一部を書き換えるだけで正確な修正が可能</li>
<li><strong>再現性の確保:</strong> 意図したレイアウトや論理構成を確実に維持できる</li>
</ul>

</div>
</div>

</section>

---

<!-- Slide 5: スライド作成プロセスの3フェーズ分解 -->
<!-- layoutId: P01 -->
<section>

# スライド作成プロセスの3フェーズ分解

<div class="step-container">
<div class="step-box">
<span class="step-label">Phase 1: 着想</span>
断片的な情報から核（コア）を抽出。誰に何を伝えたいかを明確にする。
</div>
<div class="step-box">
<span class="step-label">Phase 2: 言語化</span>
核となる想いからストーリーを構成。文字だけの原稿（字コンテ）を作成。
</div>
<div class="step-box active">
<span class="step-label">Phase 3: 視覚化</span>
デザイン整頓、レイアウト配置。完成版のスライドへ昇華させる。
</div>
</div>

<div style="margin-top: 40px; text-align: center; color: #0052CC; font-weight: bold;">
↑ 今回のメインテーマ
</div>

</section>

---

<!-- Slide 6: Phase 1 & 2 におけるAIの役割 -->
<!-- layoutId: L02 -->
<section>

# Phase 1 & 2：着想と言語化でのAI活用

<div class="grid-2">
<div class="column bg-primary-light">

### Phase 1: 着想
**AIは「壁打ち相手」** 🎾
- 対話を通じて自分の考えの解像度を上げる
- ターゲットとメッセージの整合性を確認する

</div>
<div class="column bg-primary-light">

### Phase 2: 言語化
**AIは「編集者」** ✍️
- テキストのみで論理構造を組み立てる
- 軸を補強するように原稿をブラッシュアップさせる

</div>
</div>

</section>

---

<!-- Slide 7: Phase 3：視覚化のプロセスを分解する -->
<!-- layoutId: P01 -->
<section>

# Phase 3：視覚化のプロセスを分解する

<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 50px;">
<div class="step-box" style="width: 22%;">Step 0<br><strong>テンプレート言語化</strong></div>
<div style="font-size: 2em; color: #0052CC;">→</div>
<div class="step-box" style="width: 22%;">Step 1<br><strong>デザインを言語化</strong></div>
<div style="font-size: 2em; color: #0052CC;">→</div>
<div class="step-box" style="width: 22%;">Step 2<br><strong>ドラフト生成</strong></div>
<div style="font-size: 2em; color: #0052CC;">→</div>
<div class="step-box" style="width: 22%;">Step 3<br><strong>最終調整</strong></div>
</div>

<div style="margin-top: 30px; font-size: 0.9em; color: #666666;">
※エンジニアリング的なパイプラインとしてスライド作成を捉える
</div>

</section>

---

<!-- Slide 8: Step 0: デザインテンプレートの言語化 -->
<!-- layoutId: L03 -->
<section>

# Step 0: デザインテンプレートの言語化

<div class="grid-3">
<div class="column bg-gray">

### グローバルデザイン
カラーパレット、フォント、トーン＆マナー（信頼感、先進性など）を規定。

</div>
<div class="column bg-gray">

### レイアウト定義
S01（表紙）、L01（箇条書き）など、使用可能な型をID化して管理。

</div>
<div class="column bg-gray">

### 構造の制約
ヘッダー・ボディ・フッターの比率や、情報の密度をあらかじめ指定。

</div>
</div>

<div style="margin-top: 30px; font-family: monospace; font-size: 0.8em; background: #2d2d2d; color: #ccc; padding: 15px; border-radius: 5px;">
colors: { primary: "#0052CC", accent: "#00B8D9" }<br>
layouts: [ { id: "S01", name: "Title Slide" }, ... ]
</div>

</section>

---

<!-- Slide 9: 構造化による「コンパイル」のイメージ -->
<!-- layoutId: T03 -->
<section>

# 構造化による「コンパイル」のイメージ

<div style="text-align: center; margin-top: 20px;">

```mermaid
graph LR
  A[原稿/字コンテ] --> D[AIデザイナー]
  B[デザイン定義書] --> D
  C[レイアウト定義書] --> D
  D --> E{設計書/YAML}
  E --> F[AI作業者]
  F --> G[ドラフトスライド]
  G --> H((人間による調整))
  style E fill:#DEEBFF,stroke:#0052CC
  style H fill:#FFAB00,stroke:#333
```

</div>

<div style="margin-top: 20px; text-align: center;">
中間形式としての<strong>「設計書」</strong>を介することで、制御性と再現性が生まれる。
</div>

</section>

---

<!-- Slide 10: まとめ：効率的に実用的なスライドを作るために -->
<!-- layoutId: L01 -->
<section>

# まとめ：効率的に実用的なスライドを作るために

<div style="margin-top: 40px; font-size: 1.2em;">

- **「いい感じに」を禁止する:** 曖昧な指示を排除し、構造化データで意思を伝える。
- **フェーズを分離する:** 思考（Phase 1, 2）と作業（Phase 3）を混ぜない。
- **AIの役割を使い分ける:** 壁打ち相手、編集者、デザイナー、作業者として適切にアサイン。
- **人間は「レビュー」に注力する:** ゼロから作らず、AIが生成した構造を修正するスタイルへ。

</div>

</section>

---

<!-- Slide 11: エンディング -->
<!-- layoutId: S04 -->
<section class="center-message">

## ご清聴ありがとうございました

<div style="margin-top: 40px; font-size: 1.5em; color: #333333;">
AIと共に、より創造的なプレゼン作成を。
</div>

<div style="margin-top: 20px; color: #666666;">
構造化アプローチで、スライド作成は「作業」から「設計」へ変わります。
</div>

</section>