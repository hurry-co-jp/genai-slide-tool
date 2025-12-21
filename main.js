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
const manuscriptPreview = el('manuscriptPreview');

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

// State
let state = {
    currentMode: 'draft', // 'draft' | 'slide'
    assetMode: 'global-preview',   // 'global-edit'|'global-preview'|'layout-edit'|'layout-preview'
    manuscriptMode: 'edit', // 'edit' | 'preview'
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
            if (state.manuscriptMode === 'preview') {
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

        // Manuscript Tabs
        document.querySelectorAll('.manuscript-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.target.closest('.manuscript-tab');
                const mode = targetBtn.dataset.mode;
                if (mode) switchManuscriptMode(mode);
            });
        });


        // Initial State
        updateAssetView();
        updateManuscriptView();
        setMode('draft');

        // Init Generation Settings
        if (typeof initGenerationSettings === 'function') {
            initGenerationSettings();
        }

        // --- Layout Preview Modal Logic ---
        const modal = el('modalLayout');
        const modalContent = el('modalLayoutContent');
        const btnClose = el('btnCloseModal');
        const modalPreview = el('modalPreviewContainer');
        const modalTitle = el('modalTitle');
        const modalDesc = el('modalDesc');

        if (modal && modalContent && btnClose) {
            // Close Modal Function
            const closeModal = () => {
                console.log("Closing Modal...");

                // Reset Opacity (Trigger transition)
                modal.classList.add('opacity-0');
                modal.style.opacity = '0'; // Explicit override

                modalContent.classList.remove('scale-100');
                modalContent.classList.add('scale-95');

                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.style.display = 'none'; // Explicit override
                }, 200);
            };

            // Event: Close Button
            btnClose.addEventListener('click', closeModal);

            // Event: Outside Click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            // Event: Open Modal (Delegation)
            // We attach this to document because gallery items are dynamic
            document.addEventListener('click', (e) => {
                // console.log("Click detected on:", e.target);
                const card = e.target.closest('.layout-card');

                if (card && card.dataset.layoutId) {
                    console.log("Layout card clicked:", card.dataset.layoutId);
                    e.stopPropagation(); // Just in case
                    const id = card.dataset.layoutId;

                    // Simplify: Use first child for preview container
                    const previewNode = card.children[0];
                    if (!previewNode) {
                        console.error("Preview node not found for card:", card);
                        return;
                    }

                    const titleText = card.querySelector('.font-bold')?.textContent || "No Title";
                    const descText = card.querySelector('.line-clamp-2')?.title || "";

                    // --- FORCE VISIBILITY FIRST ---
                    // This is CRITICAL. The modal must be visible (display: flex) 
                    // before we can get `modalPreview.offsetWidth`.
                    // If it is hidden, offsetWidth is 0, scale becomes 0/Infinity.
                    // We keep opacity-0 so it is technically invisible but rendered.
                    modal.classList.remove('hidden');
                    modal.style.display = 'flex';

                    // Populate Modal with Scaled Content
                    // console.log("Populating modal with scaled content:", id);

                    // Clear previous content
                    modalPreview.innerHTML = '';

                    // Create a wrapper that mimics the original card size but scaled up
                    const wrapper = document.createElement('div');
                    wrapper.innerHTML = previewNode.innerHTML;

                    // Get dimensions
                    const srcWidth = previewNode.offsetWidth || 300; // Fallback
                    const srcHeight = previewNode.offsetHeight || 169;
                    const targetWidth = modalPreview.offsetWidth; // Now this should be valid (~800-900 usually)

                    // Calculate Scale
                    // We want to fit width
                    const scale = targetWidth / srcWidth;
                    // console.log(`Scale Calc: ${targetWidth} / ${srcWidth} = ${scale}`);

                    if (!isFinite(scale) || scale <= 0) {
                        console.warn("Invalid scale calculated, fallback to 1", scale);
                        wrapper.style.transform = 'scale(1)';
                    } else {
                        // Apply styles to wrapper to force it to be "thumbnail size" then scaled up
                        wrapper.style.width = `${srcWidth}px`;
                        wrapper.style.height = `${srcHeight}px`;
                        wrapper.style.transform = `scale(${scale})`;
                        wrapper.style.transformOrigin = 'top left';
                    }

                    modalPreview.appendChild(wrapper);

                    modalTitle.textContent = `${id} - ${titleText}`;
                    modalDesc.textContent = descText;

                    // Force Opacity Reset immediately to trigger fade-in
                    requestAnimationFrame(() => {
                        modal.classList.remove('opacity-0');
                        modal.style.opacity = '1';
                        modalContent.classList.remove('scale-95');
                        modalContent.classList.add('scale-100');
                    });
                }
            });
        } else {
            console.error("Layout Preview Modal elements not found! Check index.html IDs.", { modal, modalContent, btnClose });
        }

        // --- API Key Persistence ---
        const apiKeyInput = el('apiKeyInput');
        if (apiKeyInput) {
            // Load
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) apiKeyInput.value = savedKey;

            // Save on Change
            apiKeyInput.addEventListener('input', (e) => {
                localStorage.setItem('gemini_api_key', e.target.value);
            });
        }


        // --- Manuscript Line Numbers ---
        setupLineNumbers(editorManuscript, el('ln-manuscript'));
        setupLineNumbers(editorDesignDoc, el('ln-design'));
        setupLineNumbers(editorMarp, el('ln-marp'));
        setupLineNumbers(assetEditor, el('ln-assets'));

    } catch (e) {
        console.error("Critical Init Error:", e);
    }
}

// --- Generation Settings Helpers ---
function getInstructionFromSettings() {
    // Corrected IDs to match index.html: param-{key}
    const sVis = document.getElementById('param-visual')?.value || 3;
    const sDetail = document.getElementById('param-depth')?.value || 3; // depth -> Detail
    const sTone = document.getElementById('param-tone')?.value || 3;
    const sAud = document.getElementById('settingAudience')?.value || 3; // Is it param-audience? Check HTML.

    // Checked HTML: Audience ID is not visible in snippet. Assuming param-audience logic or similar.
    // Let's verify via el('param-audience') if it fails fallback to 3.
    // Wait, snippet didn't show Audience entirely. 
    // Assuming param-audience based on pattern.

    // Map 1-5 to text (UI uses 1-5 range now?)
    // Snippet showed min=1 max=5 value=3.
    const mapVal = (val, labels) => {
        const v = parseInt(val);
        if (v <= 2) return labels[0]; // 1, 2
        if (v === 3) return labels[1]; // 3
        return labels[2]; // 4, 5
    };

    // More explicit/stronger instruction mapping
    const visualText = mapVal(sVis, [
        "Text-heavy, minimal visuals.",
        "Balanced text and visuals.",
        "Visual-first, minimal text."
    ]);

    const detailText = mapVal(sDetail, [
        "Concise summary, bullet points.",
        "Standard detail.",
        "Comprehensive coverage, detailed explanations."
    ]);

    const toneText = mapVal(sTone, [
        "Friendly, casual.",
        "Professional, standard.",
        "Formal, academic."
    ]);

    // Audience (if ID matches)
    // const audText = ... (omitted if unsure, or use default)

    return `
SETTINGS PRIORITY:
- Detail Level: ${detailText} (Value: ${sDetail})
- Visual Ratio: ${visualText} (Value: ${sVis})
- Tone: ${toneText}
`;
}

function initGenerationSettings() {
    // Corrected IDs: btnDesignSettings, popoverDesignSettings
    const btnSettings = el('btnDesignSettings');
    const popover = el('popoverDesignSettings');

    // Close button might not exist in popover? 
    // HTML snippet didn't show a close button inside popover, just title.
    // Index.html logic can rely on outside click.

    if (!btnSettings || !popover) {
        console.warn("Generation Settings elements not found: btnDesignSettings or popoverDesignSettings");
        return;
    }

    const toggleSettings = () => {
        popover.classList.toggle('hidden');
    };

    btnSettings.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSettings();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!popover.contains(e.target) && e.target !== btnSettings) {
            popover.classList.add('hidden');
        }
    });

    // Slider display updates (param-{key} -> val-{key})
    const paramMap = {
        'depth': 'val-depth',
        'visual': 'val-visual',
        'tone': 'val-tone'
        // 'audience': 'val-audience' // Check HTML if needed
    };

    Object.keys(paramMap).forEach(key => {
        const slider = el(`param-${key}`);
        const disp = el(paramMap[key]);
        const labels = {
            'depth': ['要約', '標準', '網羅'],
            'visual': ['文字', '標準', '図解'],
            'tone': ['固め', '標準', '緩め']
        };

        if (slider && disp) {
            slider.addEventListener('input', (e) => {
                // Update text based on 1-5 value? 
                // HTML says: <span>要約</span><span>網羅</span> keys.
                // Simple mapping: 1-2=Left, 3=Mid, 4-5=Right
                const v = parseInt(e.target.value);
                let text = "標準";
                if (v <= 2) text = labels[key][0];
                else if (v >= 4) text = labels[key][2];
                else text = labels[key][1];

                disp.textContent = text;
            });
        }
    });
}

// --- Action Handlers ---

async function handleGenerateDesign() {
    console.log("Generate Design Clicked");
    const topic = editorManuscript.value.trim();
    if (!topic) {
        alert("Please enter a manuscript or topic first.");
        return;
    }

    const apiKey = el('apiKeyInput').value.trim();
    if (!apiKey) {
        alert("Please enter your Gemini API Key.");
        return;
    }

    // Get selected model
    const modelId = el('modelSelect')?.value || 'gemini-1.5-flash';

    const btn = btnGenerateDesign;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    btn.disabled = true;

    try {
        const settingsInstruction = getInstructionFromSettings();
        // Pass modelId
        const designDoc = await llmService.generateDesignDoc(apiKey, topic, state.definitions, modelId, settingsInstruction);
        state.designDoc = designDoc;
        editorDesignDoc.value = designDoc;
        // Trigger input event to update line numbers
        editorDesignDoc.dispatchEvent(new Event('input'));

        setMode('slide'); // Switch to view result
        // TODO: Notification toast?
    } catch (err) {
        console.error(err);
        alert("Generation failed: " + err.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

async function handleRenderMarp() {
    console.log("Render Marp Clicked");
    const designDoc = editorDesignDoc.value.trim();
    if (!designDoc) {
        alert("Design Document is empty.");
        return;
    }

    const apiKey = el('apiKeyInput').value.trim();
    if (!apiKey) {
        alert("Please enter your Gemini API Key.");
        return;
    }

    // Get selected model
    const modelId = el('modelSelect')?.value || 'gemini-1.5-flash';

    const btn = btnRenderMarp;
    const originalText = btn.innerHTML; // Capture original icon/text
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rendering...';
    btn.disabled = true;

    try {
        // 1. Generate Marp Markdown
        const marpMd = await llmService.generateMarpCode(apiKey, designDoc, state.definitions, null, modelId);
        state.marpCode = marpMd;
        editorMarp.value = marpMd;
        editorMarp.dispatchEvent(new Event('input')); // Update line numbers

        // 2. Render HTML Preview
        renderMarpPreview(marpMd);

    } catch (err) {
        console.error(err);
        alert("Rendering failed: " + err.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// --- UI Helpers ---

function updateAssetView() {
    console.log("updateAssetView called. Mode:", state.assetMode);
    const isGlobal = state.assetMode.includes('global');
    const isEdit = state.assetMode.includes('edit');
    // const isLayout = state.assetMode.includes('layout');

    // Update Tab Active States
    document.querySelectorAll('.asset-tab').forEach(btn => {
        const mode = btn.dataset.mode;
        if (mode === state.assetMode) {
            // Active Style
            btn.classList.add('bg-blue-600', 'text-white');
            btn.classList.remove('bg-gray-200', 'text-gray-700');
        } else {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        }
    });

    // Show/Hide Editor or Preview
    if (isEdit) {
        assetEditor.classList.remove('hidden');
        assetPreview.classList.add('hidden');
        // Set Content
        if (isGlobal) {
            assetEditor.value = state.definitions.globalDesign;
        } else {
            assetEditor.value = state.definitions.layoutPatterns;
        }
        // assetEditor.dispatchEvent(new Event('input')); // Update line numbers
        // We need to manually update lines because setting .value doesn't trigger input
        requestAnimationFrame(() => updateLineNumbers(assetEditor, el('ln-assets')));

    } else {
        assetEditor.classList.add('hidden');
        assetPreview.classList.remove('hidden');

        // Render content based on mode
        if (state.assetMode === 'global-preview') {
            // Use Render Logic from preview_renderer.js
            assetPreview.innerHTML = '<div class="text-center p-4 text-gray-500">Loading Style Guide...</div>';

            renderPreview.renderStyleGuide(state.definitions.globalDesign).then(html => {
                assetPreview.innerHTML = html;
            }).catch(e => {
                console.error("Style Guide Render Error:", e);
                assetPreview.innerHTML = `<div class="text-red-500 p-4">Error rendering style guide: ${e.message}</div><pre class="text-xs text-gray-500 overflow-auto p-4">${state.definitions.globalDesign}</pre>`;
            });

        } else if (state.assetMode === 'layout-preview') {
            // Render Layout Gallery
            renderPreview.renderLayoutGallery(state.definitions.layoutPatterns).then(html => {
                assetPreview.innerHTML = html;
            }).catch(e => {
                console.error("Layout Gallery Render Error:", e);
                assetPreview.innerHTML = `<div class="text-red-500 p-4">Error rendering layout gallery: ${e.message}</div>`;
            });
        }

        el('ln-assets').innerHTML = ''; // Clear lines for preview
    }
}

function switchAssetMode(mode) {
    state.assetMode = mode;
    updateAssetView();
}

function updateManuscriptView() {
    const isEdit = state.manuscriptMode === 'edit';

    // Update Tab Active States
    document.querySelectorAll('.manuscript-tab').forEach(btn => {
        const mode = btn.dataset.mode;
        if (mode === state.manuscriptMode) {
            btn.classList.add('bg-blue-600', 'text-white');
            btn.classList.remove('bg-white', 'text-slate-700', 'shadow-sm'); // Remove default inactive (white/slate)
            btn.classList.remove('text-slate-500', 'hover:text-slate-700'); // Remove inactive text
        } else {
            btn.classList.remove('bg-blue-600', 'text-white');
            // Add inactive classes based on context (simplified)
            btn.classList.add('text-slate-500', 'hover:text-slate-700');
        }
    });

    // Toggle Visibility
    if (isEdit) {
        editorManuscript.classList.remove('hidden');
        manuscriptPreview.classList.add('hidden');
        el('ln-manuscript').classList.remove('hidden');
        requestAnimationFrame(() => updateLineNumbers(editorManuscript, el('ln-manuscript')));
    } else {
        editorManuscript.classList.add('hidden');
        manuscriptPreview.classList.remove('hidden');
        el('ln-manuscript').classList.add('hidden');
        renderManuscriptPreview();
    }
}

function switchManuscriptMode(mode) {
    state.manuscriptMode = mode;
    updateManuscriptView();
}

// --- Layout Map Strategy ---
const LayoutMap = {
    draft: () => {
        // Col 1: Assets (Design Definition)
        col1.appendChild(compAssets);
        // Col 2: Manuscript (Center)
        col2.appendChild(compManuscript);
        // Col 3: Design Doc (Reference/Preview - Right)
        col3.appendChild(compDesign);

        col1.classList.remove('hidden');
        col2.classList.remove('hidden');
        col3.classList.remove('hidden'); // Show all 3 columns

        compAssets.classList.remove('hidden');
        compManuscript.classList.remove('hidden');
        compDesign.classList.remove('hidden');
        compMarp.classList.add('hidden');
        compPreview.classList.add('hidden');
    },
    slide: () => {
        // Move Design to Col 1
        col1.appendChild(compDesign);
        // Move Marp to Col 2
        col2.appendChild(compMarp);
        // Move Preview to Col 3
        col3.appendChild(compPreview);

        col1.classList.remove('hidden');
        col2.classList.remove('hidden');
        col3.classList.remove('hidden');

        compDesign.classList.remove('hidden');
        compMarp.classList.remove('hidden');
        compPreview.classList.remove('hidden');

        compAssets.classList.add('hidden');
        compManuscript.classList.add('hidden');
    }
};

function setMode(mode) {
    state.currentMode = mode;

    // Button Styles
    const activeClass = ['bg-blue-600', 'text-white'];
    const inactiveClass = ['bg-white', 'text-gray-700', 'hover:bg-gray-50'];

    if (mode === 'draft') {
        btnModeDraft.classList.add(...activeClass);
        btnModeDraft.classList.remove(...inactiveClass);
        btnModeSlide.classList.remove(...activeClass);
        btnModeSlide.classList.add(...inactiveClass);

        LayoutMap.draft();

        // Refresh hidden editors if needed
        requestAnimationFrame(() => updateLineNumbers(editorManuscript, el('ln-manuscript')));

    } else {
        btnModeSlide.classList.add(...activeClass);
        btnModeSlide.classList.remove(...inactiveClass);
        btnModeDraft.classList.remove(...activeClass);
        btnModeDraft.classList.add(...inactiveClass);

        LayoutMap.slide();
    }
}


function renderMarpPreview(marpMd) {
    const marpit = new Marpit();

    // render returns { html, css }
    const { html, css } = marpit.render(marpMd);

    const htmlContent = `
        <style>${css}</style>
        <div class="marpit">${html}</div>
    `;

    // We utilize shadow DOM or iframe to isolate styles? 
    // Marpit styles are scoped usually.
    // For simplicity, just innerHTML but watch out for global style pollution.
    // Marpit creates scoped styles if you use proper container.

    marpPreviewContainer.innerHTML = htmlContent;
}

function renderManuscriptPreview() {
    const md = new MarkdownIt();
    const html = md.render(state.manuscript);

    if (manuscriptPreview) {
        manuscriptPreview.innerHTML = html;
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
    });
}

function downloadFile(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// --- Line Number Logic ---
function setupLineNumbers(textarea, lnContainer) {
    if (!textarea || !lnContainer) return;

    const update = () => {
        updateLineNumbers(textarea, lnContainer);
    };

    textarea.addEventListener('input', update);
    textarea.addEventListener('scroll', () => {
        lnContainer.scrollTop = textarea.scrollTop;
    });

    // Initial
    update();

    // Resize observer
    new ResizeObserver(update).observe(textarea);
}

function updateLineNumbers(textarea, lnContainer) {
    const lines = textarea.value.split('\n').length;
    lnContainer.innerHTML = Array(lines).fill(0).map((_, i) => `<div>${i + 1}</div>`).join('');
    lnContainer.scrollTop = textarea.scrollTop;
}

// Run
window.addEventListener('DOMContentLoaded', init);
