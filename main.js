import { DEFAULT_GLOBAL_DESIGN, DEFAULT_LAYOUT_PATTERNS } from './defaults.js';
import { state } from './state.js';
import { ui } from './ui.js';
import { el, copyToClipboard, downloadFile } from './utils.js';
import { handleGenerateDesign, handleRenderMarp, handleAnalyzeManuscript } from './handlers.js';

function init() {
    try {
        console.log("Initializing App (Refactored)...");

        // Init UI Components
        ui.initUI();
        ui.initLayoutPreviewModal();
        ui.initGenerationSettings();

        // 1. Parse URL Parameter
        const params = new URLSearchParams(window.location.search);
        const urlMode = params.get('mode');
        const validModes = ['plan', 'draft', 'slide'];

        let initialMode = 'draft'; // Default
        if (validModes.includes(urlMode)) {
            initialMode = urlMode;
        }


        // 2. Set Initial Mode
        // Note: state.currentMode is 'draft' by default in state.js, 
        // but ui.setMode will update UI visibility and buttons.
        ui.setMode(initialMode);

        // Load Defaults
        el('editorManuscript').value = state.manuscript;

        // --- Event Listeners: Input ---

        // Manuscript
        el('editorManuscript').addEventListener('input', (e) => {
            state.manuscript = e.target.value;
            if (state.manuscriptMode === 'preview') {
                ui.renderManuscriptPreview();
            }
        });

        // Design Doc
        el('editorDesignDoc').addEventListener('input', (e) => state.designDoc = e.target.value);

        // Marp Code
        el('editorMarp').addEventListener('input', (e) => {
            state.marpCode = e.target.value;
            ui.renderMarpPreview(state.marpCode);
        });

        // Asset Editor
        el('assetEditor').addEventListener('input', (e) => {
            if (state.assetMode.includes('global')) {
                state.definitions.globalDesign = e.target.value;
            } else {
                state.definitions.layoutPatterns = e.target.value;
            }
        });

        // --- Event Listeners: Actions ---

        el('btnGenerateDesign').addEventListener('click', handleGenerateDesign);
        el('btnRenderMarp').addEventListener('click', handleRenderMarp);
        el('btnAnalyzeManuscript').addEventListener('click', handleAnalyzeManuscript); // New


        // Copy/Download
        el('btnCopyDesign').addEventListener('click', () => copyToClipboard(state.designDoc));
        el('btnDownloadDesign').addEventListener('click', () => downloadFile('design_doc.md', state.designDoc));
        el('btnCopyMarp').addEventListener('click', () => copyToClipboard(state.marpCode));
        el('btnDownloadMarp').addEventListener('click', () => downloadFile('slides.md', state.marpCode));

        // Reset Assets
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
                    ui.updateAssetView();
                }
            });
        }

        // Mode Switching
        el('mode-plan').addEventListener('click', () => ui.setMode('plan')); // New
        el('mode-draft').addEventListener('click', () => ui.setMode('draft'));
        el('mode-slide').addEventListener('click', () => ui.setMode('slide'));

        // Asset Tabs
        document.querySelectorAll('.asset-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.target.closest('.asset-tab');
                const mode = targetBtn.dataset.mode;
                if (mode) ui.switchAssetMode(mode);
            });
        });

        // Manuscript Tabs
        document.querySelectorAll('.manuscript-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.target.closest('.manuscript-tab');
                const mode = targetBtn.dataset.mode;
                if (mode) ui.switchManuscriptMode(mode);
            });
        });



        // Initial State


    } catch (e) {
        console.error("Critical Init Error:", e);
    }
}

// Run
window.addEventListener('DOMContentLoaded', init);
