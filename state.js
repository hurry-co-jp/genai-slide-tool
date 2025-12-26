import { DEFAULT_GLOBAL_DESIGN, DEFAULT_LAYOUT_PATTERNS, DEFAULT_SAMPLE_DESIGN_DOC, DEFAULT_MANUSCRIPT } from './defaults.js';

export const state = {
    currentMode: 'draft', // 'draft' | 'slide'
    assetMode: 'global-preview',   // 'global-edit'|'global-preview'|'layout-edit'|'layout-preview'
    manuscriptMode: 'edit', // 'edit' | 'preview'
    evalMode: 'preview', // 'preview' | 'raw'
    definitions: {
        globalDesign: DEFAULT_GLOBAL_DESIGN,
        layoutPatterns: DEFAULT_LAYOUT_PATTERNS,
        sampleDesignDoc: DEFAULT_SAMPLE_DESIGN_DOC
    },
    manuscript: DEFAULT_MANUSCRIPT,
    designDoc: '',
    marpCode: '',
    plan: {
        evaluation: "",
        isAnalyzing: false
    }
};
