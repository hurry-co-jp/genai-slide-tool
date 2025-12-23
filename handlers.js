import { state } from './state.js';
import { ui } from './ui.js';
import { el } from './utils.js';
import { llmService } from './llm_service.js';

export async function handleGenerateDesign() {
    console.log("Generate Design Clicked");
    const topic = el('editorManuscript').value.trim();
    if (!topic) {
        alert("Please enter a manuscript or topic first.");
        return;
    }

    const apiKey = el('apiKeyInput').value.trim();
    if (!apiKey) {
        alert("Please enter your Gemini API Key.");
        return;
    }

    const modelId = el('modelSelect')?.value || 'gemini-1.5-flash';
    const btn = el('btnGenerateDesign');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    btn.disabled = true;

    try {
        const settingsInstruction = ui.getInstructionFromSettings();
        const designDoc = await llmService.generateDesignDoc(apiKey, topic, state.definitions, modelId, settingsInstruction);
        state.designDoc = designDoc;
        el('editorDesignDoc').value = designDoc;
        el('editorDesignDoc').dispatchEvent(new Event('input'));

        ui.setMode('slide');
    } catch (err) {
        console.error(err);
        alert("Generation failed: " + err.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

export async function handleRenderMarp() {
    console.log("Render Marp Clicked");
    const designDoc = el('editorDesignDoc').value.trim();
    if (!designDoc) {
        alert("Design Document is empty.");
        return;
    }

    const apiKey = el('apiKeyInput').value.trim();
    if (!apiKey) {
        alert("Please enter your Gemini API Key.");
        return;
    }

    const modelId = el('modelSelect')?.value || 'gemini-1.5-flash';
    const btn = el('btnRenderMarp');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rendering...';
    btn.disabled = true;

    try {
        const marpMd = await llmService.generateMarpCode(apiKey, designDoc, state.definitions, null, modelId);
        state.marpCode = marpMd;
        el('editorMarp').value = marpMd;
        el('editorMarp').dispatchEvent(new Event('input'));

        ui.renderMarpPreview(marpMd);
    } catch (err) {
        console.error(err);
        alert("Rendering failed: " + err.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
