export const DEFAULT_GLOBAL_DESIGN = `# ==========================================
# グローバルデザイン定義書 (Global Design Style Guide)
# ==========================================
# 目的: AIにスライド全体のトーン＆マナーと基本構造を指示するための定義ファイル。
# 対象: IT系企業の公式発表、シンプル、信頼感、先進性。

# --- 1. カラーパレット (Color Palette) ---
colors:
  # ベースカラー（背景色）
  base_background: "#FFFFFF" # 完全な白
  base_text: "#333333"       # 視認性の高いダークグレー（真っ黒ではない）

  # メインカラー（企業のブランドカラー、信頼・知性）
  primary: "#0052CC"         # 鮮やかながら落ち着きのあるテックブルー
  primary_light: "#DEEBFF"   # アクセントや背景装飾用の薄いブルー

  # アクセントカラー（強調、ポイント）
  accent: "#00B8D9"          # 少し緑寄りの明るいシアン（先進性、クリーン）

  # 機能色（ステータス表示など）
  success: "#36B37E"         # 成功（グリーン）
  warning: "#FFAB00"         # 注意（オレンジ）
  danger: "#FF5630"          # エラー（レッド）

# --- 2. タイポグラフィ (Typography) ---
typography:
  # フォントファミリー（OS標準のゴシック体を優先指定）
  font_family_ja: "Noto Sans JP, Hiragino Kaku Gothic ProN, Meiryo, sans-serif"
  font_family_en: "Roboto, Helvetica Neue, Arial, sans-serif"

  # 文字サイズと太さのルール
  title_slide:
    main_title: { size: 48pt, weight: "bold", color: "#333333" }
    sub_title:  { size: 24pt, weight: "normal", color: "#0052CC" }
  body_slide:
    page_title: { size: 28pt, weight: "bold", color: "#333333" }
    heading1:   { size: 20pt, weight: "bold", color: "#0052CC" } # 大見出し
    body_text:  { size: 16pt, weight: "normal", color: "#333333", line_height: 1.5 }
    small_text: { size: 12pt, weight: "normal", color: "#666666" } # フッターなど

# --- 3. レイアウト構造 (Layout Structure) ---
layout:
  # 基本構造：ヘッダー、ボディー、フッターの3段組
  structure:
    - area: header
      height_ratio: 0.1  # 全体の10%（タイトルのみなので狭め）
      background_color: "#FFFFFF"
    - area: body
      height_ratio: 0.85 # 全体の85%（コンテンツ領域を最大化）
      background_color: "#FFFFFF"
    - area: footer
      height_ratio: 0.05 # 全体の5%（必要最小限の高さ）
      background_color: "#F4F5F7" # わずかに色を付けて区切りを明確に

  # 各エリアの要素配置ルール
  header:
    elements:
      - name: page_title
        position: top_left # 左上
        style: body_slide.page_title
        content: dynamic # スライドごとに可変

  footer:
    elements:
      - name: author_name
        position: bottom_left # 左下
        style: small_text
        content: static # 固定（例: 株式会社〇〇 開発部）
      - name: page_number
        position: bottom_right # 右下
        style: small_text
        content: dynamic_format # 例: "12/45"

# --- 4. トーン＆マナー (Tone & Manner) ---
tone_and_manner:
  keywords: ["Simple", "Clean", "Trustworthy", "Innovative", "Professional"]
  description: >
    過度な装飾やグラデーションは避け、フラットでクリーンなデザインを心がける。
    情報は詰め込みすぎず、十分な余白（ホワイトスペース）を取って視認性を高める。
    文章＋AI特有の平均的なイラストやアイコンのレイアウトは禁止。
    アイコンのみで十分伝わる部分はアイコンのみにし、そうでない部分は文章のみにする。
    図版やアイコンは、線が細く洗練された「ラインスタイル」またはフラットな「ソリッドスタイル」で統一し、配色はプライマリーカラーを基調とする。
`;

export const DEFAULT_LAYOUT_PATTERNS = `# ==========================================
# レイアウトパターン定義書 (Standard Layouts)
# ==========================================

# --- 1. 基本構造 (Structure) ---
- id: S01
  name: 表紙 (Title Slide)
  structure: title-cover
  description: プレゼンテーションの開始。タイトル、サブタイトル、発表者情報を配置。
  usage_hints: [必ず冒頭に使用]

- id: S02
  name: 目次 (Agenda)
  structure: list-vertical
  description: プレゼンの全体像を示す箇条書きリスト。
  usage_hints: [表紙の次に配置]

- id: S03
  name: 中扉 (Section Divider)
  structure: center-message
  description: 章の変わり目を強く意識させる、中央配置のタイトル画面。
  usage_hints: [話題の転換点に使用]

- id: S04
  name: エンディング (Conclusion)
  structure: center-message
  description: プレゼンの終了を示す「ご清聴ありがとうございました」等のメッセージ。
  usage_hints: [最後のスライドに使用]


# --- 2. テキスト・列挙 (Text & Listing) ---
- id: L01
  name: 箇条書き (Bullet List)
  structure: list-vertical
  description: シンプルな箇条書きで用件を伝える標準的なレイアウト。
  usage_hints: [要点を列挙する場合]

- id: L02
  name: 2カラム詳細 (Split Text)
  structure: grid-cols
  cols: 2
  description: 左右2分割で情報を並列に記載するレイアウト。
  usage_hints: [2つの要素を並べる場合]

- id: L03
  name: 3カラム詳細 (3 Columns)
  structure: grid-cols
  cols: 3
  description: 3つの要素を横並びで説明するレイアウト。
  usage_hints: [3つのポイント、3つの特徴など]

- id: L04
  name: 画像＋説明 (Image & Text)
  structure: split-image-text
  description: 左側にテキスト、右側に画像を配置して視覚的に補足するレイアウト。
  usage_hints: [製品紹介、画面デモ、風景写真など]


# --- 3. 比較・対比 (Comparison) ---
- id: C01
  name: 左右対比 (Before/After)
  structure: split-contrast
  description: 左右で対立する概念や、改善前後の変化を比較するレイアウト。
  usage_hints: [Before/After、メリット/デメリット]

- id: C02
  name: 4象限マトリクス (Matrix)
  structure: table-grid
  cols: 2
  description: 2x2のグリッドで分類やポジショニングを示すレイアウト。
  usage_hints: [SWOT分析、ポジショニングマップ的な用途]

- id: C03
  name: 比較表 (Comparison Table)
  structure: table-grid
  cols: 4
  description: 複数の対象を複数の項目で比較する表形式のレイアウト。
  usage_hints: [競合比較、プラン比較]


# --- 4. プロセス・図解 (Process & Diagrams) ---
- id: P01
  name: フロー (Step Process)
  structure: flow-horizontal
  steps: 4
  description: 時系列や手順を左から右へ流れるボックスで表現。
  usage_hints: [導入手順、業務フロー]

- id: P02
  name: タイムライン (Timeline)
  structure: timeline
  description: 長期間のスケジュールや沿革を一本の線で表現。
  usage_hints: [ロードマップ、会社沿革]

- id: P03
  name: 階層ピラミッド (Pyramid)
  structure: pyramid
  description: 下から上への積み上げや、階層構造を示すピラミッド図。
  usage_hints: [組織図、概念の構成要素]

- id: P04
  name: 中心概念 (Hub & Spoke)
  structure: hub-spoke
  description: 中心となるテーマと、それを取り巻く要素の関係図。
  usage_hints: [エコシステム、関連サービス]


# --- 5. データ・強調 (Data & Impact) ---
- id: D01
  name: 数値強調 (Big Number)
  structure: big-number
  description: 重要なKPIや成果を巨大な数字でインパクト強く見せる。
  usage_hints: [成長率、No.1実績などのアピール]

- id: D02
  name: インパクト (Visual Cover)
  structure: visual-cover
  description: 全面背景と短いメッセージで感情に訴えるレイアウト。
  usage_hints: [重要なメッセージ、理念の共有]
`;

export const DEFAULT_SAMPLE_DESIGN_DOC = `# スライド設計図（構成案）

※これはAIが出力する設計図のサンプルです。実際の出力ではありません。

---
## スライド1: タイトル（表紙）

* **適用レイアウトパターンID:** \`S01\` (表紙)
* **レイアウト選定理由:**
    * プレゼンテーションの開始であり、タイトルを最も強調して伝えるため。
* **画面構成と配置:**
    * 背景はクリーンな白（#FFFFFF）。
    * 画面中央よりやや上にメインタイトルを最大フォントで配置。
    * その下にサブタイトルを配置。
    * 画面右下に、日付と発表者情報を小さく配置。
* **配置要素の詳細指示:**
    * **メインタイトル:** 「2025年度 新業務基盤導入計画」
    * **サブタイトル:** 「AI活用による工数削減とDX推進に向けて」
    * **右下情報:** 「2025年4月1日 / 株式会社サンプル DX推進部」

---
## スライド2: アジェンダ（目次）

* **適用レイアウトパターンID:** \`S02\` (目次)
* **レイアウト選定理由:**
    * プレゼンテーションの全体像と流れを最初に共有するため。
* **画面構成と配置:**
    * 画面上部にスライドタイトル「本日のアジェンダ」を配置。
    * その下に、大きな番号付きリストで各セクションのタイトルを縦に並べる。
* **配置要素の詳細指示:**
    * **リスト項目1:** 「1. 導入の背景（現状の課題）」
    * **リスト項目2:** 「2. 新業務フローの概要」
    * **リスト項目3:** 「3. 期待される導入効果（まとめ）」

---
## スライド3: セクション区切り（第1章）

* **適用レイアウトパターンID:** \`S03\` (中扉)
* **レイアウト選定理由:**
    * ここから最初の主要な章が始まることを視覚的に明確にするため。
* **画面構成と配置:**
    * 背景色をメインカラー（#0052CC）で塗りつぶし、反転させる。
    * 画面中央に、白文字で大きくセクション番号とタイトルを配置する。
* **配置要素の詳細指示:**
    * **中央テキスト:** 「1. 導入の背景（現状の課題）」
    * **スタイル:** フォントカラーは白（#FFFFFF）、サイズは特大。

---
## スライド6: 新業務フロー（導入後イメージ）

* **適用レイアウトパターンID:** \`P01\` (フロー)
* **レイアウト・パラメータ:** \`{ "steps": 4 }\`
* **レイアウト選定理由:**
    * 新しいシステム導入後の業務の流れを、時系列順に説明するため。
* **画面構成と配置:**
    * 画面左から右に向かって、4つのステップ（ボックス）を等間隔で横一列に並べ、矢印で繋ぐ。
* **配置要素の詳細指示:**
    * **Step 1:** 「受付」
    * **Step 2:** 「審査」
    * **Step 3:** 「承認」
    * **Step 4:** 「通知」

---
## スライド8: 導入による3つのメリット（まとめ）

* **適用レイアウトパターンID:** \`L03\` (3カラム詳細)
* **レイアウト・パラメータ:** \`{ "cols": 3 }\`
* **レイアウト選定理由:**
    * 結論として、導入効果を3つの重要なポイントに絞り、並列で提示するため。
* **画面構成と配置:**
    * 画面上部にスライド全体の結論メッセージを配置。
    * その下に、3つのポイント（列）を横並びで配置。
* **配置要素の詳細指示:**
    * **上部結論メッセージ:**
        * テキスト: 「新システム導入により、業務スピードは**2倍**、コストは**30%削減**を実現します。」
        * スタイル: 重要数字をアクセントカラー（黄色）で強調。
    * **ポイント1:** 「スピード（Speed）」
    * **ポイント2:** 「コスト（Cost）」
    * **ポイント3:** 「品質（Quality）」
`;

export const DEFAULT_MANUSCRIPT = `# AIスライド生成ツールの紹介

## 概要
文章を入れるだけで、いい感じのスライドが生成できるツールです。
今までにもスライド作成AIはありましたが、Geminiのスライド生成対応、Nano Banana ProおよびNotebookLMのスライド生成機能が登場したことでかなり雑な指示でも簡単にそれっぽいスライドを生成できるようになりました。
しかし、何度かAIに生成させたものを見ていると「なんか既視感あるな、AIっぽいな」という感覚になってきます。
また、同じ内容で生成させても毎回異なる内容、異なるデザインで生成されるため、文章や画像以上にいい感じのものを生成してもらうことが難しいです。
これでは簡易的なその場しのぎのスライドとしては通用しても、ちゃんとした発表で使うスライドとしては流石に厳しいものがあります。
そこで同様のことに課題意識を持った人たちが多くの工夫を考えていますが、中でもとくに再現性が高くて汎用性があると思えたのが以下のような「情報を構造化して与える」というアプローチです。

https://note.com/yoshifujidesign/n/n7412bccb5761
https://note.com/samuraijuku_biz/n/ncace2a0775ac

私は今までもAIと対話していてある程度考えがまとまったら一旦MarkdownでまとめさせたりMermaid形式のフローチャートなどで整理させたりしていたのですが、アウトプットにランダム性のあるAIに対してはこのような構造化された形式で出力を行わせると、格段に自分とAIとの認識を一致させやすくなると感じています。
ちょっと認識が違うときは出力されたものを自分で修正して渡すことで、AIに対してだいぶ正確に意図通りの修正を行わせることもできます。
同様のやり方をスライド生成に対しても行えば、当然スライドも格段に自分の意図通りのものを生成させやすくなると考えられます。
そこで今回はエンジニアリングの観点からプロセスを分解し、適切に制御することで効率的に実用的なスライドを生成させることを目指します。

# スライド作成のプロセスを分解する
まずは人間がスライドを作成するときにどんなことをやっているのか整理してみます。

## Phase 1. 着想
断片的な情報から核（コア）を抽出するフェーズです。
誰に何を伝えたいのか？

## Phase 2. 言語化
核となる想いからストーリーを構成し、文字だけの原稿（字コンテ）を作るフェーズです。

## Phase 3. 視覚化
文字原稿からデザイン整頓、レイアウト配置を行い、完成版のスライドにするフェーズです。

# 各フェーズでのAI活用方法を考える

## Phase 1 & 2：着想と言語化でのAI活用
重要なことは、「デザイン（Phase 3）に入る前にストーリーをほぼ100%固めておくこと」です。

### Phase 1: 着想（軸を決める）
ここでのAIは「壁打ち相手」として、自分の考えの解像度をあげていくために対話していきます。

### Phase 2: 言語化（脚本を作る）
ここでのAIは「編集者」として、軸を補強していくようにテキストのみで論理構造を組み立てて原稿を作成させていきます。

## Phase 3: 視覚化
今回の記事の本題です。
完成した原稿をAIに渡し、「これをいい感じのスライドにして」と依頼すると、原稿を作成せずに作成したスライドより格段に品質が高くて意図通りのスライドが生成されるようになります。

### Step 0: デザインテンプレートを言語化する
まずはデザインのベースとなるテンプレートを作っておきます。
- 全体的なデザイン定義書
- パターンごとのレイアウト定義書

### Step 1: デザインを言語化する
ここではAIに「デザイナー」として、この内容だったらこんな見せ方をするのがいいということを考えてもらいます。

### Step 2: 定義書通りにドラフト版を生成する
ここではAIに「作業者」として、指示通りにスライドを作ってもらうことを任せます。

### Step 3: 人間による最終調整をする
AIが作成したドラフト版から完成版を作成します。
`;
