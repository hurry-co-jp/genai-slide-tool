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
        content: dynamic # スライドごとに可変（スライドタイトル）
      - name: presentation_title
        position: top_right
        style: small_text
        content: static "My Presentation" # 全ページ固定のタイトル（ここを変更してください）

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
  description: 左右分割レイアウト。左側に「主張・概念」、右側にその「根拠・データ・図表」を配置することを推奨。
  usage_hints: [概念と実例、課題と解決策、テキストとグラフ]

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
  name: 左右対比 (Comparison / Diff)
  structure: split-contrast
  description: 左右で対立する概念の比較。エンジニアリング文脈では「Legacy vs Modern」や「変更前コード vs 変更後コード」のDiff表現に使用。
  usage_hints: [Before/After、メリット/デメリット、コードのDiff、パフォーマンス比較]

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


# --- 6. 技術・エンジニアリング (Technical & Engineering) ---
# エンジニア向けの情報密度（コード、ログ、アーキテクチャ）を担保するレイアウト
- id: T01
  name: コード解説 (Code & Context)
  structure: split-code-left-context
  description: 左側に「実装の意図やポイント」、右側に「実際のコードブロック」を配置する。
  usage_hints: [実装例の紹介、設定ファイルの解説、リファクタリング前後のコード]
  required_content: [code_block, language_type] # AIにコード生成を強制する

- id: T02
  name: ターミナル/ログ (Terminal Output)
  structure: window-console
  description: 黒背景のコンソール画面を模したエリアに、実行ログやエラーメッセージを表示する。
  usage_hints: [エラーの証拠提示、CLIコマンドの実行結果、パフォーマンス計測結果]
  style_guide: "フォントは等幅(Monospace)、背景はDark Theme"

- id: T03
  name: アーキテクチャ図解 (System Architecture)
  structure: diagram-mermaid
  description: Mermaid記法を用いて、システム構成やデータの流れを可視化する。
  usage_hints: [クラウド構成図、シーケンス図、ER図]
  required_content: [mermaid_code] # 図の生成指示ではなく、Mermaidコードそのものを要求

- id: T04
  name: トラブルシューティング (Problem & Solution Code)
  structure: stack-vertical-code
  description: 上段に「発生したエラー（ログ）」、下段に「解決策（修正コード）」を配置する。
  usage_hints: [バグ修正の知見共有、Incident Report]
`;

export const DEFAULT_SAMPLE_DESIGN_DOC = `# ==========================================================
# スライド構成案：詳細設計書 (Sample Output)
# ==========================================================

slides:

  # --------------------------------------------------------
  # Slide 1: タイトル（表紙）
  # --------------------------------------------------------
  - id: slide_01
    title: "表紙"
    
    layout:
      id: "S01"
      name: "Title Slide"
      
    payload:
      main_title: "2025年度 新業務基盤導入計画"
      sub_title: "AI活用による工数削減とDX推進に向けて"
      presenter_info: |
        2025年4月1日
        株式会社サンプル DX推進部
        
    visual_instruction:
      - "背景はクリーンな白（#FFFFFF）を使用し、信頼感を演出する。"
      - "メインタイトルは視認性を最大化するため、太字（Bold）かつ最大フォントサイズで配置。"
      
    speaker_notes: |
      本日は、来年度から導入予定の「新業務基盤」について、
      その目的と具体的な導入効果をご説明します。


  # --------------------------------------------------------
  # Slide 2: アジェンダ（目次）
  # --------------------------------------------------------
  - id: slide_02
    title: "本日のアジェンダ"
    
    layout:
      id: "S02"
      name: "Agenda"
      
    payload:
      # リスト項目を構造化配列として定義
      agenda_items:
        - "1. 導入の背景（現状の課題）"
        - "2. 新業務フローの概要"
        - "3. 期待される導入効果（まとめ）"
        
    visual_instruction:
      - "左側に余白（マージン）を十分に取り、視線誘導のガイドラインを引く。"
      - "箇条書きのナンバリングを大きく配置し、進行のスムーズさを印象付ける。"
      
    speaker_notes: |
      大きく分けて3つのパートで進めます。
      まずは現状の課題、次に新しいフロー、最後にその効果についてです。


  # --------------------------------------------------------
  # Slide 3: セクション区切り（第1章）
  # --------------------------------------------------------
  - id: slide_03
    title: "Section 1: 導入の背景"
    
    layout:
      id: "S03"
      name: "Section Divider"
      
    payload:
      section_number: "1"
      section_title: "導入の背景（現状の課題）"
      
    visual_instruction:
      - "背景色をメインカラー（#0052CC）で塗りつぶし、反転文字（白）を使用。"
      - "画面中央に要素を集中させ、話の転換点であることを視覚的に強調する。"
      
    speaker_notes: |
      それではまず、なぜ今回このシステム導入が必要になったのか、
      現状の課題から振り返ります。


  # --------------------------------------------------------
  # Slide 4: 新業務フロー（導入後イメージ）
  # --------------------------------------------------------
  - id: slide_04
    title: "新業務フローの全体像"
    
    layout:
      id: "P01"
      name: "Flow Process"
      params: { "steps": 4, "direction": "horizontal" }
      
    payload:
      # プロセスの各ステップを定義
      steps:
        - label: "Step 1: 受付"
          detail: "Webフォーム入力" # (補足情報を追記可能にする枠)
        - label: "Step 2: 審査"
          detail: "AIによる一次判定"
        - label: "Step 3: 承認"
          detail: "管理者承認"
        - label: "Step 4: 通知"
          detail: "Slack/メール自動連携"
          
    visual_instruction:
      - "左から右への時系列フロー図として描画。"
      - "各ボックスを矢印（Chevron）で繋ぎ、自動化によるスピード感を表現する。"
      
    speaker_notes: |
      新しいフローは非常にシンプルです。
      「受付」から「通知」までがデジタル上で一気通貫で繋がり、
      特にStep 2の審査プロセスではAI活用がカギとなります。


  # --------------------------------------------------------
  # Slide 5: 導入による3つのメリット（まとめ）
  # --------------------------------------------------------
  - id: slide_05
    title: "導入効果のまとめ"
    
    layout:
      id: "L03"
      name: "3 Columns Detail"
      params: { "cols": 3 }
      
    payload:
      # 全体の結論メッセージ（インパクト重視）
      key_message: |
        新システム導入により、業務スピードは **2倍**、
        コストは **30%削減** を実現します。
        
      # 3つのカラム詳細
      columns:
        - heading: "Speed"
          sub_text: "リードタイム短縮"
          icon: "rocket"
        - heading: "Cost"
          sub_text: "人件費の最適化"
          icon: "yen-sign"
        - heading: "Quality"
          sub_text: "ヒューマンエラーゼロ"
          icon: "shield-check"
          
    visual_instruction:
      - "上部のkey_messageにある数字（2倍, 30%）は、アクセントカラー（黄色）で強調し、フォントサイズを大きくする。"
      - "下の3カラムはアイコンを大きく配置し、視覚的な定着を図る。"
      
    speaker_notes: |
      結論です。スピード、コスト、品質。
      この3点において、劇的な改善が見込まれます。
      特にコストに関しては、初年度で回収可能な試算が出ています。

  # --------------------------------------------------------
  # Slide 6: 構造化のメリット（抽象論ではなくコードで証明する例）
  # --------------------------------------------------------
  - id: slide_06
    title: "構造化のメリット：解釈の揺らぎをコードで拘束する"
    
    # エンジニア向けレイアウト: コード解説型
    layout:
      id: "T01"
      name: "Code & Context"
      params: { "split_ratio": "40:60" } # コードエリアを広く取る

    # コンテンツ（情報の本体）
    payload:
      # 左カラム：文脈と概念
      left_context:
        heading: "Natural Language vs Structured Data"
        summary: |
          自然言語の曖昧さを排除し、IaC (Infrastructure as Code) のように
          スライドの構成要素を管理する。
        points:
          - "**再現性の担保:** 同じコードからは必ず同じ構成が生成される"
          - "**Diffによる管理:** 修正差分をGitで追跡可能にする"
          - "**関心の分離:** 「見た目」と「構造」を切り離す"

      # 右カラム：実証データ（ここが重要：Evidence）
      right_evidence:
        type: "code_comparison"
        language: "yaml"
        caption: "AIへの指示（Prompt）の比較：曖昧 vs 明確"
        content: |
          # Bad: 自然言語（解釈が揺れる）
          prompt: "AWSの構成図をいい感じに作って。サーバーは2台くらいで。"
          # -> 結果: 毎回違う図が出る / 意図しないアイコンが混ざる

          # Good: 構造化データ（解釈が固定される）
          diagram: |
            graph TD
              LB[ALB] -->|HTTPS| Web1[EC2: Active]
              LB -->|HTTPS| Web2[EC2: Standby]
              Web1 --> DB[(Aurora)]
          # -> 結果: 定義した通りのリレーションが100%再現される

    # デザイン指示
    visual_instruction:
      - "右側のコードブロックは、エディタ画面（Monokaiテーマなど）風のデザインにする。"
      - "Goodのセクションだけハイライトし、Badとの対比を明確にする。"

    # 発表者用メモ
    speaker_notes: |
      「いい感じにして」という指示は、エンジニアリングの世界ではバグの温床です。
      スライド作成も同じで、YAMLやMermaidで構造を渡すことは、
      デザインにおける型定義（Type Safety）のようなものです。


  # --------------------------------------------------------
  # Slide 7: 実行ログによる証拠提示 (T02 Sample)
  # --------------------------------------------------------
  - id: slide_07
    title: "Execution Log: 100% Success Rate"
    
    layout:
      id: "T02"
      name: "Terminal Output"
    
    payload:
      heading: "Build Process Logs"
      output_lines:
        - "[INFO] Starting slide generation..."
        - "[INFO] Parsed 15 slides from design doc."
        - "[WARN] Slide 4: Text overflow detected, auto-adjusting font size."
        - "[SUCCESS] Generated slides.md in 2.4s."
        - "[SUCCESS] PDF Export complete: output/presentation.pdf"
        
    visual_instruction:
      - "コンソール画面は暗い背景色でリアリティを出す。"
      - "SUCCESSの行は緑色、WARNは黄色でハイライトし、視認性を高める。"


  # --------------------------------------------------------
  # Slide 8: トラブルシューティング事例 (T04 Sample)
  # --------------------------------------------------------
  - id: slide_08
    title: "Case Study: Layout Mismatch Error"
    
    layout:
      id: "T04"
      name: "Troubleshooting"
      
    payload:
      error_section:
        label: "Issue: 意図しないレイアウト崩れ"
        log: "Error: Layout 'S01' expects 3 slots, but 4 were provided."
        
      solution_section:
        label: "Fix: 定義書(YAML)の制約による自動修正"
        code: |
          # Before: 制限なし
          # After: スキーマバリデーションを追加
          if (slots.length > layout.max_slots) {
             truncate(slots);
          }
          
    visual_instruction:
      - "上段のエラーは赤系、下段の解決策は青/緑系で色分けする。"
      - "Before/Afterの対比が見えるように配置する。"


  # --------------------------------------------------------
  # Slide 9: プロセスの可視化（抽象図ではなくアーキテクチャ図の例）
  # --------------------------------------------------------
  - id: slide_09
    title: "Phase 3: テキストを「コンパイル」してスライド化する"

    # エンジニア向けレイアウト: アーキテクチャ図解型
    layout:
      id: "T03"
      name: "Architecture Diagram"
    
    # コンテンツ
    payload:
      heading: "Automated Slide Generation Pipeline"
      
      # 図解の実体定義（Mermaidを直接記述）
      diagram_code: |
        sequenceDiagram
            participant Human as 人間 (Architect)
            participant LLM as AI (Builder)
            participant Tool as Marp/SlideTool
        
            Human->>LLM: 1. ブログ記事 + レイアウト定義(YAML)
            Note right of Human: 構造化された設計書
        
            LLM->>LLM: 2. 構造化データの生成
            LLM-->>Human: 3. スライドYAML (Draft)
            
            Human->>Human: 4. Code Review & Fix
            Note right of Human: テキストエディタで修正
            
            Human->>Tool: 5. レンダリング実行
            Tool-->>Human: 6. 完成スライド (PDF/PPTX)

      # 図解の補足ポイント
      key_takeaways:
        - "人間は「ドラフト作成」を行わず、「Review」に徹する"
        - "GUIツールでの微調整を禁止し、全てテキスト（YAML）で制御する"

    # デザイン指示
    visual_instruction:
      - "シーケンス図はシンプルに描画し、Humanの手戻りが最小であることを強調する。"
      - "Toolへの矢印部分を「Automated」として強調色にする。"

    # 発表者用メモ
    speaker_notes: |
      このフローの最大の特徴は、GUIを一切触らないことです。
      CI/CDパイプラインのように、テキストを修正してコマンドを叩けば、
      最新のスライドがデプロイされる感覚です。
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
