export const llmService = {
    async generateDesignDoc(apiKey, manuscript, definitions, modelId = 'gemini-3-flash-preview', additionalInstruction = '') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

        const systemInstruction = `あなたはプロのプレゼンテーションデザイナーです。
与えられた「原稿」と「定義書（デザイン・レイアウト）」に基づき、最適なスライド構成を設計してください。

## 入力データ
1. **原稿**: スライド化する内容の全文。
2. **デザイン定義書**: トンマナ、フォント、配色のルール。
3. **レイアウト定義書**: 使用可能なレイアウトパターンの一覧（IDと用途）。
4. **サンプル**: 出力形式の見本。

## タスク
原稿の内容を読み解き、適切な枚数のスライドに分割してください。
各スライドについて、最も効果的な「レイアウトパターンID」を選定し、そのレイアウトに必要な要素（タイトル、本文、図解の指示など）を具体的に記述してください。

## 制約事項
* **必ず**提供された「レイアウト定義書」にあるID（S01, D01など）を使用すること。
* **必ず**「サンプル」通りのMarkdown形式で出力すること。
* 原稿の意図を汲み取り、単なる要約ではなく「伝わるスライド」になるよう構成すること。
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
   \`\`\`markdown
   ---
   marp: true
   theme: default
   size: 16:9
   pagination: true
   style: |
     (ここに提供されたCSSテーマをそのまま埋め込む)
     /* 追加: 個別のレイアウト調整が必要ならここに追記 */
   ---
   \`\`\`

2. **スライドのレンダリング**:
   * 設計書にある \`layoutId\` (例: S01, P01) や \`structure\` (例: grid-cols, title-cover) を見て、適切なHTMLタグ (\`<div class="...">\`) を組み立ててください。
   * 単純なテキストスライド以外は、HTMLとCSSクラス（.grid-2, .box, .flex-rowなど）を駆使してレイアウトを再現してください。
   * CSSテーマには既にユーティリティクラス（.grid-2, .text-primaryなど）が定義されているので、それらを活用してください。

3. **出力**:
   * **Markdownコードのみ**を出力してください。コードブロック(\`\`\`)で囲まないでください。
   * 説明や雑談は一切不要です。
`;

        const userPrompt = `
# スライド設計書
${designDoc}

# レイアウト定義書 (YAML)
${definitions.layoutPatterns}

# ベースCSSテーマ (これをstyleブロックに含める)
${cssTheme}
`;

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
