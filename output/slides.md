---
marp: true
theme: default
size: 16:9
pagination: true
style: |
  /* Global Resets */
  section {
    background-color: #FFFFFF;
    color: #333333;
    font-family: "Noto Sans JP, Hiragino Kaku Gothic ProN, Meiryo, sans-serif", "Roboto, Helvetica Neue, Arial, sans-serif";
    padding: 40px 60px;
    font-size: 24pt;
  }

  /* Headings */
  h1 { font-size: 32pt; color: #0052CC; }
  h2 { font-size: 28pt; color: #0052CC; }
  h3 { font-size: 24pt; color: #333333; }

  /* Layout Utilities */
  .center { text-align: center; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; height: 100%; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; align-items: start; height: 100%; }
  .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; align-items: start; height: 100%; }
  .grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; align-items: start; height: 100%; }
  .box { background: #f8f9fa; padding: 20px; border-radius: 8px; height: 100%; border: 1px solid #e9ecef; }
  
  /* Flex Utils */
  .flex-col { display: flex; flex-direction: column; gap: 20px; }
  .flex-row { display: flex; flex-direction: row; gap: 20px; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }

  /* Specific Layout Classes */
  .title-slide { 
    display: flex; flex-direction: column; justify-content: center; text-align: center; height: 100%; 
  }
  .title-slide h1 { font-size: 48pt; color: #333333; margin-bottom: 20px; }
  .title-slide p { font-size: 24pt; color: #0052CC; }
  
  .section-divider {
    background-color: #0052CC;
    color: #FFFFFF;
    display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;
  }
  .section-divider h1, .section-divider h2 { color: #FFFFFF; }

  /* Utility Colors */
  .text-primary { color: #0052CC; }
  .text-accent { color: #00B8D9; }
  .bg-primary { background-color: #0052CC; color: white; }

  /* Custom adjustments */
  .footer-info { position: absolute; bottom: 40px; right: 60px; font-size: 16pt; color: #888; }
  .step-box { text-align: center; padding: 15px; border-top: 4px solid #0052CC; }
---

<!-- S01: 表紙 -->
<div class="title-slide">
  <h1>AIによる実用的なスライド生成の最適解</h1>
  <p>構造化データを用いたエンジニアリング的アプローチ</p>
  <div class="footer-info">2024年 / プレゼンテーション・デザイン戦略</div>
</div>

---

<!-- S02: 目次 -->
# アジェンダ

<div class="flex-col" style="margin-top: 40px;">
  <div class="text-primary">1. 現状の課題：AI生成スライドの限界</div>
  <div>2. 解決策：情報を構造化して与える</div>
  <div>3. スライド作成プロセスの分解</div>
  <div>4. 各フェーズにおけるAI活用戦略</div>
</div>

---

<!-- C01: 左右対比 -->
# 現状の課題（AI生成の限界）

<div class="grid-2">
  <div class="box">
    <h3 class="text-primary">進化とメリット</h3>
    <p style="font-size: 20pt;">手軽な生成：GeminiやNotebookLM等の登場により、雑な指示でも形になる</p>
  </div>
  <div class="box">
    <h3 style="color: #D32F2F;">直面している課題</h3>
    <p style="font-size: 20pt;">実用性の欠如：既視感（AIっぽさ）、内容のランダム性、意図の反映が困難</p>
  </div>
</div>

---

<!-- D02: インパクト -->
<div class="title-slide">
  <h1 class="text-primary" style="font-size: 60pt;">情報を構造化して与える</h1>
  <p style="color: #333;">MarkdownやMermaid形式を活用し、AIとの認識を一致させる</p>
</div>

---

<!-- S03: 中扉 -->
<!-- _class: section-divider -->
# スライド作成のプロセスを分解する

---

<!-- L03: 3カラム詳細 -->
# 人間のプロセスを整理する

<div class="grid-3">
  <div class="box">
    <h3 class="text-primary">Phase 1</h3>
    <strong>着想</strong>
    <p style="font-size: 18pt;">核（コア）の抽出。誰に何を伝えたいか？</p>
  </div>
  <div class="box">
    <h3 class="text-primary">Phase 2</h3>
    <strong>言語化</strong>
    <p style="font-size: 18pt;">ストーリー構成。文字原稿（字コンテ）の作成。</p>
  </div>
  <div class="box">
    <h3 class="text-primary">Phase 3</h3>
    <strong>視覚化</strong>
    <p style="font-size: 18pt;">デザイン整頓。レイアウト配置と完成。</p>
  </div>
</div>

---

<!-- L02: 2カラム詳細 -->
# Phase 1 & 2：着想と言語化

<div class="grid-2">
  <div>
    <h3 class="text-primary">Phase 1: 着想</h3>
    <p style="font-size: 20pt;">AIは「壁打ち相手」。対話を通じて考えの解像度を上げる。</p>
  </div>
  <div>
    <h3 class="text-primary">Phase 2: 言語化</h3>
    <p style="font-size: 20pt;">AIは「編集者」。論理構造を組み立て、テキスト原稿を固める。</p>
  </div>
</div>

<div class="box center" style="margin-top: 40px; height: auto; border-left: 8px solid #0052CC;">
  <strong>デザインに入る前にストーリーを100%固めることが重要</strong>
</div>

---

<!-- P01: フロー -->
# Phase 3：視覚化のステップ

<div class="grid-4" style="margin-top: 50px;">
  <div class="box step-box">
    <div class="text-primary" style="font-weight: bold;">Step 0</div>
    <p style="font-size: 16pt;">テンプレート定義<br><small>（デザイン・レイアウトの言語化）</small></p>
  </div>
  <div class="box step-box">
    <div class="text-primary" style="font-weight: bold;">Step 1</div>
    <p style="font-size: 16pt;">デザイン案策定<br><small>（デザイナーとしてのAI）</small></p>
  </div>
  <div class="box step-box">
    <div class="text-primary" style="font-weight: bold;">Step 2</div>
    <p style="font-size: 16pt;">ドラフト生成<br><small>（作業者としてのAI）</small></p>
  </div>
  <div class="box step-box">
    <div class="text-primary" style="font-weight: bold;">Step 3</div>
    <p style="font-size: 16pt;">最終調整<br><small>（人間による仕上げ）</small></p>
  </div>
</div>

---

<!-- L01: 箇条書き -->
# 結論（まとめ）

<div class="flex-col" style="margin-top: 40px;">
  <div class="flex-row items-center">
    <div class="bg-primary" style="padding: 5px 15px; border-radius: 4px;">Point 1</div>
    <div>AIへの指示は「構造化された形式」で行うことで精度が劇的に向上する</div>
  </div>
  <div class="flex-row items-center">
    <div class="bg-primary" style="padding: 5px 15px; border-radius: 4px;">Point 2</div>
    <div>思考（Phase 1, 2）と作業（Phase 3）を分離して制御する</div>
  </div>
  <div class="flex-row items-center">
    <div class="bg-primary" style="padding: 5px 15px; border-radius: 4px;">Point 3</div>
    <div>定義書（ルール）を先に与えることで、意図通りの出力を再現可能にする</div>
  </div>
</div>

---

<!-- S04: エンディング -->
<!-- _class: section-divider -->
# ご清聴ありがとうございました
### 効率的なスライド生成で、より本質的な創作活動を。