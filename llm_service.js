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
    }
};

window.llmService = llmService;
