export const llmService = {
    async generateDesignDoc(apiKey, manuscript, definitions, modelId = 'gemini-3-flash-preview', additionalInstruction = '') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

        const systemInstruction = `あなたはプロのプレゼンテーションデザイナー兼コンサルタントです。
与えられた「原稿」と「定義書」に基づき、聴衆を動かす高品質なスライド設計書を作成してください。

## 入力データ
1. **原稿**: スライド化する内容の全文。
2. **デザイン定義書**: トンマナ、フォント、配色のルール。
3. **レイアウト定義書**: 使用可能なレイアウトパターンの一覧。
4. **サンプル**: 出力形式の見本。

## 重要な心構え
* **単なる要約マシーンになってはいけません**。原稿の言葉をただ短くするのではなく、その意図を汲み取り、より説得力のある表現に「翻訳」してください。
* 箇条書きは単語の羅列ではなく、**「なぜそうなのか」「具体的にはどういうことか」といった補足説明（サブバレット）**を積極的に加え、内容に厚みを持たせてください。
* ユーザーからの「詳細度」指定には厳密に従ってください。「詳細」が求められた場合は、原稿のほぼ全ての情報を網羅的に構造化してください。

## タスク
原稿の内容を読み解き、適切な枚数のスライドに分割し、Markdown形式の設計書を出力してください。
各スライドについて、最も効果的な「レイアウトパターンID」を選定し、そのレイアウトに必要な要素（タイトル、本文、図解の指示など）を具体的に記述してください。

## 制約事項
* **必ず**提供された「レイアウト定義書」にあるID（S01, D01など）を使用すること。
* **必ず**「サンプル」通りのMarkdown形式で出力すること。
* 思考の過程は出力せず、設計書のみを出力すること。
`;

        let userPrompt = `
# 原稿
${manuscript}

# デザイン定義書
${definitions.globalDesign}

# レイアウト定義書
${definitions.layoutPatterns}

# サンプル（この形式で出力すること）
${definitions.sampleDesignDoc}
`;

        if (additionalInstruction) {
            userPrompt += `
# ユーザーからの生成設定（最優先）
${additionalInstruction}
`;
        }

        const payload = {
            contents: [{
                parts: [{ text: userPrompt }]
            }],
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 8192
            }
        };

        console.log("Generating with LLM:", url);

        // ... (truncated for brevity in actual file content)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API Request Failed');
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error('No content generated');

        return text;
    },

    async generateMarpCode(apiKey, designDoc, definitions, cssTheme, modelId = 'gemini-3-flash-preview') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

        const systemInstruction = `あなたはMarp (Markdown Presentation Ecosystem) のエキスパートエンジニアです。
提供された「スライド設計書」と「各種定義」に基づき、実行可能な完全なMarp Markdownコードを生成してください。

## 入力データ
1. **スライド設計書**: スライドの構成、タイトル、ID、配置要素の指示。
2. **レイアウト定義**: 各ID（S01, C01など）に対応する構造（structure）やHTMLテンプレートのイメージ。
3. **CSSテーマ**: 既に生成されたベースのCSSスタイル（これを<style>ブロックに含めること）。

## タスク
設計書を上から順に解析し、Marp形式のスライド（\`---\`区切り）に変換してください。
特に、**レイアウトIDに応じた適切なHTML構造**を生成することが重要です。

## ルールと形式
1. **Frontmatter**:
   冒頭は必ず以下から開始すること。
   * **静的なヘッダー・フッター**（会社名など全ページ共通のもの）がある場合は、\`header\` / \`footer\` ディレクティブを使用すること。
   * **動的なタイトル（ページタイトル）**は、\`header\` ディレクティブではなく、各スライドの先頭に \`# タイトル\` (H1) として記述すること。H1はCSSで所定の位置（ヘッダー領域）に固定されるようにスタイル定義すること。

   \`\`\`markdown
   ---
   marp: true
   theme: default
   size: 16:9
   pagination: true
   header: "株式会社サンプル（固定ヘッダーがある場合）"
   footer: "Confidential（固定フッターがある場合）"
   style: |
     (ここに定義書に基づいたCSSテーマを生成して埋め込む)
     
     /* タイトル(H1)をヘッダー領域に固定するスタイル例 */
     section h1 {
       position: absolute;
       top: 30px;
       left: 40px;
       width: 90%;
       font-size: 28pt; /* 定義書のサイズに従う */
       color: #0052CC;
     }
     /* 本文の位置調整（ヘッダーと被らないように） */
     section {
       padding-top: 100px;
     }
   ---
   \`\`\`

2. **スライドのレンダリング**:
   * 設計書にある \`layoutId\` (例: S01, P01) や \`structure\` (例: grid-cols, title-cover) を見て、適切なHTMLタグ (\`<div class="...">\`) を組み立ててください。
   * 単純なテキストスライド以外は、HTMLとCSSクラス（.grid-2, .box, .flex-rowなど）を駆使してレイアウトを再現してください。

3. **出力**:
   * **Markdownコードのみ**を出力してください。コードブロック(\`\`\`)で囲まないでください。
   * 説明や雑談は一切不要です。
`;

        let userPrompt = `
# スライド設計書
${designDoc}

# デザイン定義書 (Global Design)
${definitions.globalDesign}

# レイアウト定義書 (YAML)
${definitions.layoutPatterns}
`;

        if (cssTheme) {
            userPrompt += `
# ベースCSSテーマ
${cssTheme}
`;
        }

        const payload = {
            contents: [{
                parts: [{ text: userPrompt }]
            }],
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 8192
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API Request Failed');
        }

        const data = await response.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error('No content generated');

        // Clean up code blocks if present (despite instructions)
        text = text.replace(/^```markdown\n/, '').replace(/^```\n/, '').replace(/\n```$/, '');

        return text;
    },

    async evaluateManuscript(apiKey, manuscript, modelId = 'gemini-3-flash-preview', reviewMode = 'B') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

        const systemInstruction = `# 依頼
あなたは「初めてこの記事を読む読者」および「熟練の技術編集者」です。
以下の技術ブログ原稿に対し、**一切の事前情報なしに**内容を分析し、公開に向けた最終調整を行ってください。

# 設定: レビューモード
A/B/Cから選択する。指定のない場合はデフォルトをBとする。

* **A (Coaching)**: 「書き手」を育てるモード。良い点は褒め、改善点は「なぜそうすべきか」優しく諭すように提案する。
* **B (Standard)**: 「品質」を担保するモード。感情を挟まず、事務的かつ淡々と、誤字・論理・技術的負債を網羅的に指摘する。
* **C (Critical Audit)**: 「死角」を突くモード（※口調を荒げる必要はない）。
    * **思考の基準**: 「この記事の内容を本番環境や組織導入した場合、どんなリスクがあるか？」
    * **重点チェック項目**: エッジケース、セキュリティ、スケーラビリティ、代替案との比較（なぜ他ではなくこれなのか）、長期運用時のコスト。
    * **役割**: あなたは「導入に慎重なCTO」として、この技術採用を却下する理由を探してください。

# プロセス
1. **印象分析 (Diagnosis)**: 原稿から読み取れるターゲットや意図を分析（ブラックボックステスト）。
2. **読者シミュレーション**: 読者の「感情の動き」をトレースする。
3. **スコアリング (Scoring)**: 品質を定量的に評価。
4. **改善提案 (Feedback)**: 具体的な修正案と、タイトル・導入の最適化案を提示。
5. **品質評価 & 改善**: 具体的な修正案（Diff）とスコアリング。

# レビュー基準
* **未知の固有詞への対応**: あなたの知識カットオフ以降の最新技術が含まれる可能性が高いため、知らない単語を「ハルシネーション」と断定せず、著者の記述を優先する（要確認リストに入れるに留める）。
* **技術的信頼性**: 再現性はあるか、断定表現は適切か。
* **構成とロジック**: 課題解決の流れ（PREP法等）になっているか。
* **エンジニアリング**: 認知的負荷（読みやすさ）、Markdown記法の正確さ。

# 重要: 知識の限界と未知の用語への対応
あなたは大規模言語モデルであり、学習データのカットオフ（知識の期限）が存在します。
一方、著者は常に最新の技術トレンド（あなたの学習データに含まれていない新発表のツールやライブラリ）を扱っています。
したがって、本文中に**あなたの知識にない固有詞（ツール名、モデル名、ライブラリ名）**が登場した場合、以下のプロトコルに従ってください。

1.  **ハルシネーションと断定しない**: 「存在しない」と決めつけることは禁止します。
2.  **「未知の用語」として扱う**: 著者が正しい（最新情報を持っている）と仮定し、「私のデータベースにはありませんが、これは新しいツールですか？」というスタンスで確認を促してください。
3.  **スペルチェックに留める**: 明らかなスペルミス（例: Goggle -> Google）以外は、原文を尊重してください。

# ⛔ 禁止事項 (ノイズフィルタリング)
以下の項目は指摘対象から**完全に除外**してください。出力に含めることを禁じます。
1. **未知の固有名詞**: あなたの知識にないツール名やライブラリ名が登場しても、**「最新技術」または「内部ツール」とみなし、存在確認や懸念の表明を行わないでください。**
2. **プレースホルダー**: 空のリンク []()、TODO、ローカルパス（./image.png）。

# 出力形式 (Markdown)

## 🩺 1. ブラックボックス診断
* **推定ターゲット**:
* **推定される著者の意図**:

## 🗣️ 2. 読者の脳内再生 (Reader Reactions)
ターゲット読者がこの記事を読んだ時の「率直な感想」です。
* **😍 刺さったポイント**: 「ここが知りたかった！」「なるほど！」と膝を打った箇所。
* **🥱 離脱ポイント**: 「難しい」「退屈」「自分には関係ない」と感じてブラウザバックしそうになった箇所。
* **🤔 疑問・モヤモヤ**: 「これって本当？」「前提がわからん」と手が止まった箇所。

## 📊 3. 品質スコア (S~D評価)
* **技術的信頼性**: [評価] (理由)
* **構成力**: [評価] (理由)
* **可読性**: [評価] (理由)

## 🛠️ 4. 具体的な改善アクション
### ⚠️ 優先度: 高（修正必須）
* **ご指摘**: (論理矛盾、ハルシネーションの疑い、再現性の欠如)
* **修正案 (Diff)**:
    * **Before**: (該当箇所)
    * **After**: (修正案 ※確証がない固有名詞はプレースホルダーにする)

### ℹ️ 優先度: 中（推奨）
* (箇条書きで指摘)

## 🚀 5. パッケージング提案 (SEO & Engagement)
* **推奨タイトル案**: (SEOとクリック率を意識した案を3つ)
    1.
    2.
    3.
* **導入文(Lead)の改善案**: (読者を離脱させないためのフックの強化版)`;

        const payload = {
            contents: [{
                parts: [{ text: `以下の原稿を厳密にチェックしてください：\n\n【選択されたレビューモード】: ${reviewMode}\n\n${manuscript}` }]
            }],
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
            generationConfig: {
                temperature: 0.2 // 校正などは正確性が重要なので少し温度を下げる
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Evaluation Request Failed');
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No evaluation generated.";
    },
};

window.llmService = llmService;
