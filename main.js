import { DEFAULT_GLOBAL_DESIGN, DEFAULT_LAYOUT_PATTERNS, DEFAULT_SAMPLE_DESIGN_DOC, DEFAULT_MANUSCRIPT } from './defaults.js';
import { llmService } from './llm_service.js';
import { marpGenerator } from './generator.js';
import { renderPreview } from './preview_renderer.js';
import MarkdownIt from 'https://esm.sh/markdown-it@14.1.0';
import { Marpit } from 'https://esm.sh/@marp-team/marpit@2.0.0';

// --- DOM Elements ---
const el = (id) => document.getElementById(id);

// Layout Slots
const col1 = el('col-1');
const col2 = el('col-2');
const col3 = el('col-3');
const componentStore = el('component-store');

// Components
const compAssets = el('comp-assets');
const compManuscript = el('comp-manuscript');
const compDesign = el('comp-design');
const compMarp = el('comp-marp');
const compPreview = el('comp-preview');

// Mode Switcher
const btnModeDraft = el('mode-draft');
const btnModeSlide = el('mode-slide');

// Editors & UI inside components
const assetEditor = el('assetEditor');
// const assetEditorLabel = el('assetEditorLabel'); // Removed in UI
const assetPreview = el('assetPreview');

const editorManuscript = el('editorManuscript');
const editorDesignDoc = el('editorDesignDoc');
const editorMarp = el('editorMarp');
const marpPreviewContainer = el('marpPreviewContainer');

// Buttons
const btnGenerateDesign = el('btnGenerateDesign');
const btnRenderMarp = el('btnRenderMarp');

const btnCopyDesign = el('btnCopyDesign');
const btnDownloadDesign = el('btnDownloadDesign');
const btnCopyMarp = el('btnCopyMarp');
const btnDownloadMarp = el('btnDownloadMarp');

// Marp Tabs (now just local UI logic within the Marp component if needed, 
// though separate components for Code/Preview makes tabs potentially redundant in wide view?
// Actually, the user might want to swap Code/Preview in the limited slots if they had less space,
// but with Slide Mode we have distinct columns for Code and Preview, so tabs are less critical 
// BUT we kept the "Code" component and "Preview" component separate in DOM.
// Wait, in previous index.html I kept "Code" and "Preview" buttons in the Marp component header?
// No, I separated them into `comp-marp` (Code) and `comp-preview` (Preview). 
// So the tabs inside comp-marp might be removed or repurposed?
// Let's check the new index.html ... 
// Ah, `comp-marp` has "Code" label. `comp-preview` has "Preview" label.
// The tabs "Code/Preview" were REMOVED from the index.html in the last refactor?
// Let me double check... Yes, I replaced the complex 3rd column with distinct components.
// `comp-marp` header has "Code". `comp-preview` header has "Preview".
// So no tab logic needed for Marp anymore between Code/Preview! They are separate columns in Slide Mode.
// However, in Draft Mode, we don't see Marp.
// So effectively "Slide Mode" IS the split view.
// Tabs are obsolete. Good.)

// State
let state = {
    currentMode: 'draft', // 'draft' | 'slide'
    assetMode: 'global-preview',   // 'global-edit'|'global-preview'|'layout-edit'|'layout-preview'
    definitions: {
        globalDesign: DEFAULT_GLOBAL_DESIGN,
        layoutPatterns: DEFAULT_LAYOUT_PATTERNS,
        sampleDesignDoc: DEFAULT_SAMPLE_DESIGN_DOC
    },
    manuscript: DEFAULT_MANUSCRIPT,
    designDoc: '',
    marpCode: ''
};

// --- Initialization ---
function init() {
    try {
        console.log("Initializing App...");

        // Load Defaults
        editorManuscript.value = state.manuscript;

        // Event Listeners: Input
        editorManuscript.addEventListener('input', (e) => {
            state.manuscript = e.target.value;
            // Update preview if visible
            const preview = el('manuscriptPreview');
            if (preview && !preview.classList.contains('hidden')) {
                renderManuscriptPreview();
            }
        });
        editorDesignDoc.addEventListener('input', (e) => state.designDoc = e.target.value);
        editorMarp.addEventListener('input', (e) => state.marpCode = e.target.value);

        assetEditor.addEventListener('input', (e) => {
            if (state.assetMode.includes('global')) {
                state.definitions.globalDesign = e.target.value;
            } else {
                state.definitions.layoutPatterns = e.target.value;
            }
        });

        // Event Listeners: Actions
        btnGenerateDesign.addEventListener('click', handleGenerateDesign);
        btnRenderMarp.addEventListener('click', handleRenderMarp);

        // Copy/Download
        btnCopyDesign.addEventListener('click', () => copyToClipboard(state.designDoc));
        btnDownloadDesign.addEventListener('click', () => downloadFile('design_doc.md', state.designDoc));
        btnCopyMarp.addEventListener('click', () => copyToClipboard(state.marpCode));
        btnDownloadMarp.addEventListener('click', () => downloadFile('slides.md', state.marpCode));

        // Reset Button
        const btnResetAssets = el('btnResetAssets');
        if (btnResetAssets) {
            btnResetAssets.addEventListener('click', () => {
                const isGlobal = state.assetMode.includes('global');
                const targetName = isGlobal ? 'Global Design' : 'Layout Patterns';
                if (confirm(`Reset ${targetName} to default?`)) {
                    if (isGlobal) {
                        state.definitions.globalDesign = DEFAULT_GLOBAL_DESIGN;
                    } else {
                        state.definitions.layoutPatterns = DEFAULT_LAYOUT_PATTERNS;
                    }
                    updateAssetView();
                }
            });
        }

        // Mode Switching
        btnModeDraft.addEventListener('click', () => setMode('draft'));
        btnModeSlide.addEventListener('click', () => setMode('slide'));

        // Asset Tabs
        document.querySelectorAll('.asset-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Find button element (in case icon clicked)
                const targetBtn = e.target.closest('.asset-tab');
                const mode = targetBtn.dataset.mode;
                if (mode) switchAssetMode(mode);
            });
        });

        // Initial State
        updateAssetView();
        setMode('draft');

        // Init Generation Settings
        if (typeof initGenerationSettings === 'function') {
            initGenerationSettings();
        }

        console.log("App Initialized Successfully");
    } catch (e) {
        alert("Init Error: " + e.message);
        console.error(e);
    }
}

// ... (setMode remains same) ...

// --- Mode Logic ---
function setMode(mode) {
    state.currentMode = mode;

    // UI Feedback
    if (mode === 'draft') {
        btnModeDraft.dataset.active = 'true';
        btnModeSlide.dataset.active = 'false';
    } else {
        btnModeDraft.dataset.active = 'false';
        btnModeSlide.dataset.active = 'true';
    }

    // Reset Slots (Move existing children back to store to preserve state)
    // We append children to store so they are effectively "parked"
    [col1, col2, col3].forEach(col => {
        while (col.firstChild) {
            componentStore.appendChild(col.firstChild);
        }
    });

    // Populate Slots based on Mode
    if (mode === 'draft') {
        // Mode 1: Assets | Manuscript | Design
        col1.appendChild(compAssets);
        col2.appendChild(compManuscript);
        col3.appendChild(compDesign);
    } else {
        // Mode 2: Design | Marp | Preview
        col1.appendChild(compDesign);
        col2.appendChild(compMarp);
        col3.appendChild(compPreview);

        // Trigger render when entering slide mode if we have content
        if (state.marpCode) renderMarpitPreview();
    }
}

// --- Asset Logic ---
function switchAssetMode(mode) {
    state.assetMode = mode;
    updateAssetView();
}

function updateAssetView() {
    // 1. Update Tab Styles
    document.querySelectorAll('.asset-tab').forEach(t => {
        if (t.dataset.mode === state.assetMode) {
            t.classList.add('bg-white', 'shadow-sm', 'text-slate-700');
            t.classList.remove('text-slate-500', 'hover:text-slate-700');
        } else {
            t.classList.remove('bg-white', 'shadow-sm', 'text-slate-700');
            t.classList.add('text-slate-500', 'hover:text-slate-700');
        }
    });

    // 2. Logic for Editor vs Preview
    const isEdit = state.assetMode.includes('edit');
    const isGlobal = state.assetMode.includes('global');

    if (isEdit) {
        assetEditor.classList.remove('hidden');
        if (assetPreview) assetPreview.classList.add('hidden');

        // Update Editor Content
        assetEditor.value = isGlobal ? state.definitions.globalDesign : state.definitions.layoutPatterns;
    } else {
        assetEditor.classList.add('hidden');
        if (assetPreview) assetPreview.classList.remove('hidden');
        updateAssetPreview();
    }
}

async function updateAssetPreview() {
    if (!assetPreview || assetPreview.classList.contains('hidden')) return;

    assetPreview.innerHTML = '<div class="p-4 text-slate-400">Rendering preview...</div>';
    try {
        if (renderPreview) {
            if (state.assetMode.includes('global')) {
                assetPreview.innerHTML = await renderPreview.renderStyleGuide(state.definitions.globalDesign);
            } else {
                assetPreview.innerHTML = await renderPreview.renderLayoutGallery(state.definitions.layoutPatterns);
            }
        }
    } catch (e) {
        assetPreview.innerHTML = `<div class="p-4 text-red-500">Preview Error: ${e.message}</div>`;
    }
}

// --- Marp Logic ---
function renderMarpitPreview() {
    if (!state.marpCode) {
        marpPreviewContainer.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400">No content to preview</div>';
        return;
    }

    try {
        const marpit = new Marpit({
            markdown: { html: true, breaks: true },
            inlineSVG: true
        });

        const { html, css } = marpit.render(state.marpCode);

        marpPreviewContainer.innerHTML = `
            <style>
                ${css}
                .marpit { 
                    margin: 0 auto; 
                    padding: 20px; 
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                }
                .marpit > svg { 
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); 
                    margin-bottom: 20px; 
                    width: 100%;
                    height: auto;
                    display: block;
                }
            </style>
            <div class="marpit">${html}</div>
        `;

    } catch (e) {
        console.error("Marpit Render Error (ESM):", e);
        marpPreviewContainer.innerHTML = `<div class="text-red-400 p-4">Preview Error: ${e.message}<br><small>Check console for details</small></div>`;
    }
}

// --- Generation Settings Logic ---
function initGenerationSettings() {
    const btnSettings = el('btnDesignSettings');
    const popoverSettings = el('popoverDesignSettings');

    // Safety check if elements exist (in case index.html update failed)
    if (!btnSettings || !popoverSettings) return;

    // Toggle Popover
    btnSettings.addEventListener('click', (e) => {
        e.stopPropagation();
        popoverSettings.classList.toggle('hidden');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!popoverSettings.classList.contains('hidden') &&
            !popoverSettings.contains(e.target) &&
            !btnSettings.contains(e.target)) {
            popoverSettings.classList.add('hidden');
        }
    });

    // Dynamic Slider Labels
    const depthMap = ["", "要約", "やや簡潔", "標準", "やや詳細", "網羅"];
    const visualMap = ["", "文字", "やや文字", "標準", "やや図解", "図解"];
    const toneMap = ["", "堅め", "やや堅め", "標準", "やや緩め", "緩め"];
    const audienceMap = ["", "初学", "基礎", "標準", "実務", "専門"];

    const bindSlider = (key, map) => {
        const range = el(`param-${key}`);
        if (range) {
            const update = () => {
                const valEl = el(`val-${key}`);
                if (valEl) valEl.innerText = map[range.value] || range.value;
            }
            range.addEventListener('input', update);
            update(); // Init
        }
    };

    bindSlider('depth', depthMap);
    bindSlider('visual', visualMap);
    bindSlider('tone', toneMap);
    bindSlider('audience', audienceMap);
}

function getInstructionFromSettings() {
    const getVal = (id) => {
        const elRange = el(id);
        return elRange ? parseInt(elRange.value) : 3;
    }

    const depth = getVal('param-depth');
    const visual = getVal('param-visual');
    const tone = getVal('param-tone');
    const audience = getVal('param-audience');

    const depthMap = ["", "極めて簡潔（要点のみ）", "やや簡潔", "標準", "やや詳細", "詳細（網羅的）"];
    const visualMap = ["", "テキスト中心", "ややテキスト多め", "標準", "やや図解多め", "ビジュアル・図解中心"];
    const toneMap = ["", "極めてフォーマル・堅め", "やや堅め", "標準", "やや親しみやすく", "エモーショナル・フランク"];
    const audienceMap = ["", "完全な初学者・一般層", "基礎知識レベル", "標準", "実務経験者", "高度な専門家"];

    const instructions = [];
    if (depth != 3) instructions.push(`詳細度: ${depthMap[depth]}`);
    if (visual != 3) instructions.push(`ビジュアル比率: ${visualMap[visual]}`);
    if (tone != 3) instructions.push(`トーン: ${toneMap[tone]}`);
    if (audience != 3) instructions.push(`ターゲット読者: ${audienceMap[audience]}`);

    return instructions.join('\n');
};

// --- Action Handlers ---
async function handleGenerateDesign() {
    // Generation Settings Logic
    const btnSettings = el('btnDesignSettings');
    const popoverSettings = el('popoverDesignSettings');
    const params = {
        depth: el('param-depth'),
        visual: el('param-visual'),
        tone: el('param-tone'),
        audience: el('param-audience')
    };

    // Toggle Popover
    if (btnSettings && popoverSettings) {
        btnSettings.addEventListener('click', (e) => {
            e.stopPropagation();
            popoverSettings.classList.toggle('hidden');
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!popoverSettings.classList.contains('hidden') &&
                !popoverSettings.contains(e.target) &&
                !btnSettings.contains(e.target)) {
                popoverSettings.classList.add('hidden');
            }
        });
    }

    // Helper to get text from slider values
    const getInstructionFromSettings = () => {
        const p = params;
        if (!p.depth) return '';

        const depthMap = ["", "極めて簡潔（要点のみ）", "やや簡潔", "標準", "やや詳細", "詳細（網羅的）"];
        const visualMap = ["", "テキスト中心", "ややテキスト多め", "標準", "やや図解多め", "ビジュアル・図解中心"];
        const toneMap = ["", "極めてフォーマル・堅め", "やや堅め", "標準", "やや親しみやすく", "エモーショナル・フランク"];
        const audienceMap = ["", "完全な初学者・一般層", "基礎知識レベル", "標準", "実務経験者", "高度な専門家"];

        const instructions = [];
        if (p.depth.value != 3) instructions.push(`詳細度: ${depthMap[p.depth.value]}`);
        if (p.visual.value != 3) instructions.push(`ビジュアル比率: ${visualMap[p.visual.value]}`);
        if (p.tone.value != 3) instructions.push(`トーン: ${toneMap[p.tone.value]}`);
        if (p.audience.value != 3) instructions.push(`ターゲット読者: ${audienceMap[p.audience.value]}`);

        return instructions.join('\n');
    };

    const apiKey = el('apiKeyInput').value;
    const model = el('modelSelect').value;

    if (!apiKey) { alert('Please enter Gemini API Key.'); return; }

    const originalText = btnGenerateDesign.innerHTML;
    btnGenerateDesign.disabled = true;
    btnGenerateDesign.innerHTML = '<span class="loader border-white/30 border-t-white w-3 h-3"></span>';

    try {
        if (llmService) {
            const instruction = getInstructionFromSettings();
            console.log("Generating with instruction:", instruction);
            const doc = await llmService.generateDesignDoc(apiKey, state.manuscript, state.definitions, model, instruction);
            state.designDoc = doc;
            editorDesignDoc.value = doc;
            editorDesignDoc.dispatchEvent(new Event('input'));
        }
    } catch (e) {
        alert('Error: ' + e.message);
    } finally {
        btnGenerateDesign.disabled = false;
        btnGenerateDesign.innerHTML = originalText;
    }
}

async function handleRenderMarp() {
    const apiKey = el('apiKeyInput').value;
    const model = el('modelSelect').value;

    if (!state.designDoc) { alert('Design Doc required.'); return; }
    if (!apiKey) { alert('API Key required.'); return; }

    const originalText = btnRenderMarp.innerHTML;
    btnRenderMarp.disabled = true;
    btnRenderMarp.innerHTML = '<span class="loader border-white/30 border-t-white w-3 h-3"></span>';

    try {
        if (marpGenerator && llmService) {
            let cssTheme = '';
            try {
                const globalDesign = jsyaml.load(state.definitions.globalDesign);
                cssTheme = marpGenerator.generateCSS(globalDesign);
            } catch (e) { cssTheme = "/* CSS Gen Failed */"; }

            const marpContent = await llmService.generateMarpCode(
                apiKey, state.designDoc, state.definitions, cssTheme, model
            );

            state.marpCode = marpContent;
            editorMarp.value = marpContent;
            editorMarp.dispatchEvent(new Event('input'));

            // If in Slide Mode, update preview immediately
            if (state.currentMode === 'slide') renderMarpitPreview();

            // Auto switch to Slide Mode if not already? Maybe better let user choose.
            // But if they clicked generate in Draft Mode (which doesn't have Render Marp button... wait)
            // The Render Marp button is in 'comp-marp'.
            // 'comp-marp' is ONLY visible in Slide Mode.
            // So user MUST be in Slide Mode to generate Marp.
            // So auto-update of preview is safe.
        }
    } catch (e) {
        alert('Error: ' + e.message);
    } finally {
        btnRenderMarp.disabled = false;
        btnRenderMarp.innerHTML = originalText;
    }
}

// --- Helpers ---
function copyToClipboard(text) {
    if (!text) return;
    navigator.clipboard.writeText(text);
}

function downloadFile(filename, content) {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// --- Line Numbers Logic ---
function updateLineNumbers(textarea, lnContainer) {
    if (!textarea || !lnContainer) return;

    // Calculate line count
    const lines = textarea.value.split('\n').length;
    // Generate numbers (e.g., 1\n2\n3...)
    lnContainer.innerText = Array(lines).fill(0).map((_, i) => i + 1).join('\n');

    // Sync scroll
    lnContainer.scrollTop = textarea.scrollTop;
}

function setupLineNumbers(textareaId, lnContainerId) {
    const ta = el(textareaId);
    const ln = el(lnContainerId);
    if (!ta || !ln) return;

    ta.addEventListener('input', () => updateLineNumbers(ta, ln));
    ta.addEventListener('scroll', () => { ln.scrollTop = ta.scrollTop; });

    // Initial update
    updateLineNumbers(ta, ln);

    // Resize observer to handle layout changes affecting line wrapping (though wrapping adds complexity, for pure line breaks this is fine)
    // Note: If text wraps effectively increasing visual lines without newlines, this simple method desyncs. 
    // For now assuming Markdown inputs where line breaks are explicit or accept subtle desync on wrap.
    // To handle wrap strictly requires complex DOM mirroring. We'll stick to simple newline counting for now as "faint reference".
}

// --- Manuscript Logic ---
function initManuscriptTabs() {
    document.querySelectorAll('.manuscript-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.currentTarget.dataset.mode; // 'edit' | 'preview'

            // Toggle UI
            document.querySelectorAll('.manuscript-tab').forEach(b => {
                const isActive = b.dataset.mode === mode;
                if (isActive) {
                    b.classList.add('bg-white', 'shadow-sm', 'text-slate-700');
                    b.classList.remove('text-slate-500', 'hover:text-slate-700');
                } else {
                    b.classList.remove('bg-white', 'shadow-sm', 'text-slate-700');
                    b.classList.add('text-slate-500', 'hover:text-slate-700');
                }
            });

            const ln = el('ln-manuscript');
            const editor = editorManuscript;
            const preview = el('manuscriptPreview');

            if (mode === 'edit') {
                ln.classList.remove('hidden');
                editor.classList.remove('hidden');
                preview.classList.add('hidden');
            } else {
                ln.classList.add('hidden');
                editor.classList.add('hidden');
                preview.classList.remove('hidden');
                renderManuscriptPreview();
            }
        });
    });
}

function renderManuscriptPreview() {
    const container = el('manuscriptPreview');
    if (!container || !MarkdownIt) return;

    try {
        const md = new MarkdownIt({ breaks: true });
        container.innerHTML = md.render(state.manuscript);
    } catch (e) {
        container.innerHTML = `<div class="text-red-500">Preview Error: ${e.message}</div>`;
    }
}


// --- Dark Mode Logic ---
function initDarkMode() {
    const btnToggle = el('btnToggleDark');
    if (!btnToggle) return;

    // Check Preference
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'dark' || (!saved && prefersDark);

    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Toggle Handler
    btnToggle.addEventListener('click', () => {
        const isDarkNow = document.documentElement.classList.contains('dark');
        if (isDarkNow) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Start
init();
initManuscriptTabs();
initDarkMode();
// Setup Line Numbers
setupLineNumbers('assetEditor', 'ln-assets');
setupLineNumbers('editorManuscript', 'ln-manuscript');
setupLineNumbers('editorDesignDoc', 'ln-design');
setupLineNumbers('editorMarp', 'ln-marp');
