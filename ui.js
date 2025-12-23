import { el } from './utils.js';
import { state } from './state.js';
import { renderPreview } from './preview_renderer.js';
import MarkdownIt from 'https://esm.sh/markdown-it@14.1.0';
import { Marp } from 'https://esm.sh/@marp-team/marp-core@4.0.0?bundle';

// --- DOM Elements ---
// (We still access them via el() on demand or cache relevant ones if needed)
// For UI module, we can define getters or just lookup.
// Keeping it simple with direct el() calls for now to minimize refactor risk.

const LayoutMap = {
    draft: () => {
        el('col-1').appendChild(el('comp-assets'));
        el('col-2').appendChild(el('comp-manuscript'));
        el('col-3').appendChild(el('comp-design'));
        el('col-1').classList.remove('hidden');
        el('col-2').classList.remove('hidden');
        el('col-3').classList.remove('hidden');
        el('comp-assets').classList.remove('hidden');
        el('comp-manuscript').classList.remove('hidden');
        el('comp-design').classList.remove('hidden');
        el('comp-marp').classList.add('hidden');
        el('comp-preview').classList.add('hidden');
    },
    slide: () => {
        el('col-1').appendChild(el('comp-design'));
        el('col-2').appendChild(el('comp-marp'));
        el('col-3').appendChild(el('comp-preview'));
        el('col-1').classList.remove('hidden');
        el('col-2').classList.remove('hidden');
        el('col-3').classList.remove('hidden');
        el('comp-design').classList.remove('hidden');
        el('comp-marp').classList.remove('hidden');
        el('comp-preview').classList.remove('hidden');
        el('comp-assets').classList.add('hidden');
        el('comp-manuscript').classList.add('hidden');
    }
};

export const ui = {
    initUI() {
        // Initial setup
        this.initDarkMode();
        this.updateAssetView();
        this.updateManuscriptView();


        // Line Numbers
        this.setupLineNumbers(el('editorManuscript'), el('ln-manuscript'));
        this.setupLineNumbers(el('editorDesignDoc'), el('ln-design'));
        this.setupLineNumbers(el('editorMarp'), el('ln-marp'));
        this.setupLineNumbers(el('assetEditor'), el('ln-assets'));

        // API Key Persistence
        const apiKeyInput = el('apiKeyInput');
        if (apiKeyInput) {
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) apiKeyInput.value = savedKey;
            apiKeyInput.addEventListener('input', (e) => {
                localStorage.setItem('gemini_api_key', e.target.value);
            });
        }
    },

    setMode(mode) {
        state.currentMode = mode;
        const btnModeDraft = el('mode-draft');
        const btnModeSlide = el('mode-slide');
        const activeClass = ['bg-blue-600', 'text-white'];
        const inactiveClass = ['bg-white', 'text-gray-700', 'hover:bg-gray-50'];

        if (mode === 'draft') {
            btnModeDraft.classList.add(...activeClass);
            btnModeDraft.classList.remove(...inactiveClass);
            btnModeSlide.classList.remove(...activeClass);
            btnModeSlide.classList.add(...inactiveClass);
            LayoutMap.draft();
            requestAnimationFrame(() => this.updateLineNumbers(el('editorManuscript'), el('ln-manuscript')));
        } else {
            btnModeSlide.classList.add(...activeClass);
            btnModeSlide.classList.remove(...inactiveClass);
            btnModeDraft.classList.remove(...activeClass);
            btnModeDraft.classList.add(...inactiveClass);
            LayoutMap.slide();
        }
    },

    updateAssetView() {
        const isEdit = state.assetMode.includes('edit');
        const assetEditor = el('assetEditor');
        const assetPreview = el('assetPreview');

        // Tab Styles
        document.querySelectorAll('.asset-tab').forEach(btn => {
            if (btn.dataset.mode === state.assetMode) {
                btn.classList.add('bg-blue-600', 'text-white');
                btn.classList.remove('bg-gray-200', 'text-gray-700');
            } else {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            }
        });

        if (isEdit) {
            assetEditor.classList.remove('hidden');
            assetPreview.classList.add('hidden');
            if (state.assetMode.includes('global')) {
                assetEditor.value = state.definitions.globalDesign;
            } else {
                assetEditor.value = state.definitions.layoutPatterns;
            }
            requestAnimationFrame(() => this.updateLineNumbers(assetEditor, el('ln-assets')));
        } else {
            assetEditor.classList.add('hidden');
            assetPreview.classList.remove('hidden');

            if (state.assetMode === 'global-preview') {
                assetPreview.innerHTML = '<div class="text-center p-4 text-gray-500">Loading Style Guide...</div>';
                renderPreview.renderStyleGuide(state.definitions.globalDesign).then(html => {
                    assetPreview.innerHTML = html;
                }).catch(e => {
                    assetPreview.innerHTML = `<div class="text-red-500 p-4">Error: ${e.message}</div>`;
                });
            } else if (state.assetMode === 'layout-preview') {
                renderPreview.renderLayoutGallery(state.definitions.layoutPatterns).then(html => {
                    assetPreview.innerHTML = html;
                }).catch(e => {
                    assetPreview.innerHTML = `<div class="text-red-500 p-4">Error: ${e.message}</div>`;
                });
            }
            el('ln-assets').innerHTML = '';
        }
    },

    switchAssetMode(mode) {
        state.assetMode = mode;
        this.updateAssetView();
    },

    updateManuscriptView() {
        const isEdit = state.manuscriptMode === 'edit';
        const editorManuscript = el('editorManuscript');
        const manuscriptPreview = el('manuscriptPreview');

        document.querySelectorAll('.manuscript-tab').forEach(btn => {
            if (btn.dataset.mode === state.manuscriptMode) {
                btn.classList.add('bg-blue-600', 'text-white');
                btn.classList.remove('bg-white', 'text-slate-700', 'shadow-sm', 'text-slate-500', 'hover:text-slate-700');
            } else {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('text-slate-500', 'hover:text-slate-700');
            }
        });

        if (isEdit) {
            editorManuscript.classList.remove('hidden');
            manuscriptPreview.classList.add('hidden');
            el('ln-manuscript').classList.remove('hidden');
            requestAnimationFrame(() => this.updateLineNumbers(editorManuscript, el('ln-manuscript')));
        } else {
            editorManuscript.classList.add('hidden');
            manuscriptPreview.classList.remove('hidden');
            el('ln-manuscript').classList.add('hidden');
            this.renderManuscriptPreview();
        }
    },

    switchManuscriptMode(mode) {
        state.manuscriptMode = mode;
        this.updateManuscriptView();
    },

    renderManuscriptPreview() {
        const md = new MarkdownIt();
        const html = md.render(state.manuscript);
        const container = el('manuscriptPreview');
        if (container) container.innerHTML = html;
    },

    renderMarpPreview(marpMd) {
        const marp = new Marp({ inlineSVG: true });
        const { html, css } = marp.render(marpMd);
        const htmlContent = `<style>${css}</style><div class="marpit">${html}</div>`;
        el('marpPreviewContainer').innerHTML = htmlContent;
    },

    setupLineNumbers(textarea, lnContainer) {
        if (!textarea || !lnContainer) return;
        const update = () => this.updateLineNumbers(textarea, lnContainer);
        textarea.addEventListener('input', update);
        textarea.addEventListener('scroll', () => lnContainer.scrollTop = textarea.scrollTop);
        update();
        new ResizeObserver(update).observe(textarea);
    },

    updateLineNumbers(textarea, lnContainer) {
        const lines = textarea.value.split('\n').length;
        lnContainer.innerHTML = Array(lines).fill(0).map((_, i) => `<div>${i + 1}</div>`).join('');
        lnContainer.scrollTop = textarea.scrollTop;
    },

    initLayoutPreviewModal() {
        const modal = el('modalLayout');
        const modalContent = el('modalLayoutContent');
        const btnClose = el('btnCloseModal');
        const modalPreview = el('modalPreviewContainer');

        if (!modal || !modalContent || !btnClose) return;

        const closeModal = () => {
            modal.classList.add('opacity-0');
            modal.style.opacity = '0';
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.style.display = 'none';
            }, 200);
        };

        btnClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

        document.addEventListener('click', (e) => {
            const card = e.target.closest('.layout-card');
            if (card && card.dataset.layoutId) {
                const previewNode = card.children[0];
                if (!previewNode) return;

                modal.classList.remove('hidden');
                modal.style.display = 'flex';
                modalPreview.innerHTML = '';

                const wrapper = document.createElement('div');
                wrapper.innerHTML = previewNode.innerHTML;

                const srcWidth = previewNode.offsetWidth || 300;
                const srcHeight = previewNode.offsetHeight || 169;
                const targetWidth = modalPreview.offsetWidth;
                const scale = targetWidth / srcWidth;

                if (isFinite(scale) && scale > 0) {
                    wrapper.style.width = `${srcWidth}px`;
                    wrapper.style.height = `${srcHeight}px`;
                    wrapper.style.transform = `scale(${scale})`;
                    wrapper.style.transformOrigin = 'top left';
                }

                modalPreview.appendChild(wrapper);
                el('modalTitle').textContent = `${card.dataset.layoutId} - ${card.querySelector('.font-bold')?.textContent || ""}`;
                el('modalDesc').textContent = card.querySelector('.line-clamp-2')?.title || "";

                requestAnimationFrame(() => {
                    modal.classList.remove('opacity-0');
                    modal.style.opacity = '1';
                    modalContent.classList.remove('scale-95');
                    modalContent.classList.add('scale-100');
                });
            }
        });
    },

    initGenerationSettings() {
        const btnSettings = el('btnDesignSettings');
        const popover = el('popoverDesignSettings');
        if (!btnSettings || !popover) return;

        btnSettings.addEventListener('click', (e) => {
            e.stopPropagation();
            popover.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!popover.contains(e.target) && e.target !== btnSettings) {
                popover.classList.add('hidden');
            }
        });

        const paramMap = { 'depth': 'val-depth', 'visual': 'val-visual', 'tone': 'val-tone', 'audience': 'val-audience' };
        const labels = {
            'depth': ['要約', '標準', '網羅'],
            'visual': ['文字', '標準', '図解'],
            'tone': ['固め', '標準', '緩め'],
            'audience': ['初学', '標準', '専門']
        };

        Object.keys(paramMap).forEach(key => {
            const slider = el(`param-${key}`);
            const disp = el(paramMap[key]);
            if (slider && disp) {
                slider.addEventListener('input', (e) => {
                    const v = parseInt(e.target.value);
                    let text = "標準";
                    if (v <= 2) text = labels[key][0];
                    else if (v >= 4) text = labels[key][2];
                    disp.textContent = text;
                });
            }
        });
    },

    getInstructionFromSettings() {
        const sVis = document.getElementById('param-visual')?.value || 3;
        const sDetail = document.getElementById('param-depth')?.value || 3;
        const sTone = document.getElementById('param-tone')?.value || 3;

        const mapVal = (val, labels) => {
            const v = parseInt(val);
            if (v <= 2) return labels[0];
            if (v === 3) return labels[1];
            return labels[2];
        };

        return `
SETTINGS PRIORITY:
- Detail Level: ${mapVal(sDetail, ["Concise summary", "Standard detail", "Comprehensive"])}
- Visual Ratio: ${mapVal(sVis, ["Text-heavy", "Balanced", "Visual-first"])}
- Tone: ${mapVal(sTone, ["Casual", "Professional", "Formal"])}
`;
    },

    initDarkMode() {
        const btn = el('btnToggleDark');
        if (!btn) return;

        // Check preference
        const isDark = localStorage.theme === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        btn.addEventListener('click', () => {
            const isNowDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isNowDark ? 'dark' : 'light');
        });
    }
};
