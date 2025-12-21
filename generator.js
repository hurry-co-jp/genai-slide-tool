export const marpGenerator = {
    convertDesignToMarp(designDoc, globalDesignYaml, layoutPatternsYaml) {
        // 1. Parse YAMLs
        let globalDesign = {};
        try { globalDesign = jsyaml.load(globalDesignYaml); } catch (e) { console.error(e); }

        // 2. Generate CSS Theme
        const css = this.generateCSS(globalDesign);

        // 3. Parse Design Doc into Slides
        const slides = this.parseDesignDoc(designDoc);

        // 4. Render Slides
        let output = `---
marp: true
theme: default
size: 16:9
pagination: true
style: |
${css}
---

`;

        slides.forEach(slide => {
            output += this.renderSlide(slide, globalDesign, layoutPatternsYaml) + '\n\n---\n\n';
        });

        // Remove last delimiter
        output = output.replace(/\n\n---\n\n$/, '');
        return output;
    },

    generateCSS(design) {
        const colors = design.colors || {};
        const typo = design.typography || {};

        // Helper to get color safely
        const c = (key) => colors[key] || '#000000';

        return `
  /* Global Resets */
  section {
    background-color: ${c('base_background')};
    color: ${c('base_text')};
    font-family: "${typo.font_family_ja || 'sans-serif'}", "${typo.font_family_en || 'sans-serif'}";
    padding: 40px 60px;
    font-size: 24pt;
  }

  /* Headings */
  h1 { font-size: 32pt; color: ${c('primary')}; }
  h2 { font-size: 28pt; color: ${c('primary')}; }
  h3 { font-size: 24pt; color: ${c('base_text')}; }

  /* Layout Utilities */
  .center { text-align: center; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; height: 100%; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; align-items: start; height: 100%; }
  .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; align-items: start; height: 100%; }
  .grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; align-items: start; height: 100%; }
  .box { background: #f8f9fa; padding: 20px; border-radius: 8px; height: 100%; }
  
  /* Flex Utils */
  .flex-col { display: flex; flex-direction: column; gap: 20px; }
  .flex-row { display: flex; flex-direction: row; gap: 20px; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }

  /* Specific Layout Classes */
  .title-slide { 
    display: flex; flex-direction: column; justify-content: center; text-align: center; height: 100%; 
  }
  .title-slide h1 { font-size: ${typo.title_slide?.main_title?.size || '48pt'}; color: ${typo.title_slide?.main_title?.color || c('base_text')}; margin-bottom: 20px; }
  .title-slide p { font-size: ${typo.title_slide?.sub_title?.size || '24pt'}; color: ${typo.title_slide?.sub_title?.color || c('primary')}; }
  
  .section-divider {
    background-color: ${c('primary')};
    color: ${c('base_background')};
    display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;
  }
  .section-divider h1, .section-divider h2 { color: ${c('base_background')}; }

  /* Utility Colors */
  .text-primary { color: ${c('primary')}; }
  .text-accent { color: ${c('accent')}; }
  .bg-primary { background-color: ${c('primary')}; color: white; }
`;
    },

    parseDesignDoc(doc) {
        // Split by slide headers (## スライドN: ...) or separators (---)
        const slideTexts = doc.split(/^---$/m).map(s => s.trim()).filter(s => s);

        return slideTexts.map(text => {
            const lines = text.split('\n');
            const data = {
                title: '',
                layoutId: '',
                params: {},
                elements: {}
            };

            let currentElementKey = null;

            lines.forEach(line => {
                line = line.trim();

                // 1. Header (Title)
                if (line.startsWith('## ')) {
                    data.title = line.replace('## ', '');
                }
                // 2. Layout ID
                else if (line.includes('* **適用レイアウトパターンID:**')) {
                    const match = line.match(/`([A-Z0-9]+)`/);
                    if (match) data.layoutId = match[1];
                }
                // 3. Layout Params (JSON parsing)
                else if (line.includes('* **レイアウト・パラメータ:**')) {
                    try {
                        const jsonStr = line.replace(/\* \*\*[^:]+:\*\*\s*/, '').replace(/`/g, '');
                        data.params = JSON.parse(jsonStr);
                    } catch (e) {
                        console.warn('Failed to parse layout params:', line);
                    }
                }
                // 4. Elements Parsing
                else if (line.match(/^\s*\*\s*\*\*([^*]+):\*\*\s*(.*)/)) {
                    const m = line.match(/^\s*\*\s*\*\*([^*]+):\*\*\s*(.*)/);
                    const key = m[1].trim();
                    const val = m[2].trim();

                    data.elements[key] = val;
                    currentElementKey = key;
                }
                // 5. Continued Text
                else if (line.startsWith('*') && currentElementKey && !line.includes('**')) {
                    data.elements[currentElementKey] += '\n' + line.replace(/^[\s*]+/, '');
                }
            });
            return data;
        });
    },

    renderSlide(slide, globalDesign, layoutPatterns) {
        // Find layout definition
        let layoutDef = {};
        if (layoutPatterns) {
            try {
                const patterns = jsyaml.load(layoutPatterns);
                layoutDef = patterns.find(p => p.id === slide.layoutId) || {};
            } catch (e) { console.error('YAML Load Error', e); }
        }

        // Merge defaults with overrides
        const structure = layoutDef.structure || 'generic';
        // params can override layout defaults if keys match
        const params = { cols: layoutDef.cols, steps: layoutDef.steps, ...slide.params };

        const el = slide.elements;
        const raw = (key) => {
            const k = Object.keys(el).find(k => k.includes(key));
            return k ? el[k] : '';
        };

        // Standard Wrapper
        let content = '';

        if (structure === 'title-cover') {
            content = `
<!-- _class: title-slide -->
# ${raw('メインタイトル') || slide.title}

${raw('サブタイトル')}

<div style="position:absolute; bottom:30px; right:30px; font-size:18pt">
${raw('右下情報') || raw('発表者')}
</div>
             `;
        } else if (structure === 'list-vertical') {
            const listItems = Object.keys(el).filter(k => k.includes('リスト')).map(k => '- ' + el[k]).join('\n');
            content = `# ${slide.title}\n\n${listItems}`;
        } else if (structure === 'center-message') {
            content = `
<!-- _class: section-divider -->
# ${raw('中央テキスト') || raw('タイトル') || slide.title}

${raw('サブ')}
             `;
        } else if (structure === 'grid-cols') {
            const cols = params.cols || 2;
            let gridContent = '';
            for (let i = 1; i <= cols; i++) {
                // Try to find content for column i
                // Keys might be '列1', 'ポイント1', 'Point 1' etc.
                const key = Object.keys(el).find(k => k.match(new RegExp(`[列Pointポイント]\\s*${i}`)));
                const val = key ? el[key] : '(No Content)';
                gridContent += `<div class="box">\n\n### Point ${i}\n${val}\n</div>\n`;
            }
            content = `# ${slide.title}\n\n<div class="grid-${cols} align-center">\n${gridContent}</div>`;
        } else if (structure === 'split-image-text') {
            content = `# ${slide.title}\n\n<div class="grid-2">\n<div class="flex-col justify-center">\n\n${raw('テキスト') || raw('説明') || 'Text content goes here.'}\n</div>\n<div class="box center">\n<!-- Image Placeholder -->\n(Image)\n</div>\n</div>`;
        } else if (structure === 'flow-horizontal') {
            const steps = params.steps || 3;
            let flowContent = '';
            for (let i = 1; i <= steps; i++) {
                const key = Object.keys(el).find(k => k.match(new RegExp(`Step\\s*${i}`, 'i')));
                const val = key ? el[key] : `Step ${i}`;
                flowContent += `<div class="box center">\n${val}\n</div>\n`;
                if (i < steps) flowContent += `<div class="center" style="font-size:30px">→</div>\n`;
            }
            content = `# ${slide.title}\n\n<div class="flex-row justify-center items-center h-full">\n${flowContent}</div>`;
        } else if (structure === 'timeline') {
            // Basic timeline fallback
            content = `# ${slide.title}\n\n<div class="center">\n(Timeline Structure Not Fully Implemented in CSS yet)\n</div>`;
        } else if (structure === 'visual-cover') {
            content = `
<!-- _class: section-divider -->
<!-- bg-image would go here -->
# ${slide.title}
             `;
        } else if (structure === 'big-number') {
            content = `# ${slide.title}\n\n<div class="center" style="font-size: 100pt; color: var(--primary); font-weight: bold;">\n${raw('数値') || '100%'}\n</div>`;
        } else {
            // Fallback
            content = `# ${slide.title}\n\n(Structure: ${structure})\n\n${Object.entries(el).map(([k, v]) => `- **${k}**: ${v}`).join('\n')}`;
        }

        return content;
    }
};

window.marpGenerator = marpGenerator;
