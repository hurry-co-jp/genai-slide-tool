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

    const apiKeyInput = el('apiKeyInput');
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        alert("Gemini API Keyが未入力です。\n画面右上の入力ボックスにAPI Keyを入力してください。");
        apiKeyInput.focus();
        apiKeyInput.classList.add('ring-2', 'ring-red-500');
        setTimeout(() => apiKeyInput.classList.remove('ring-2', 'ring-red-500'), 2000);
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

    const apiKeyInput = el('apiKeyInput');
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        alert("Gemini API Keyが未入力です。\n画面右上の入力ボックスにAPI Keyを入力してください。");
        apiKeyInput.focus();
        apiKeyInput.classList.add('ring-2', 'ring-red-500');
        setTimeout(() => apiKeyInput.classList.remove('ring-2', 'ring-red-500'), 2000);
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

export async function handleAnalyzeManuscript() {
    console.log("Analyze Manuscript Clicked");
    const manuscript = el('editorManuscript').value.trim();
    if (!manuscript) {
        alert("Please enter a manuscript to analyze.");
        return;
    }

    const apiKeyInput = el('apiKeyInput');
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        alert("Gemini API Keyが未入力です。\n画面右上の入力ボックスにAPI Keyを入力してください。");
        apiKeyInput.focus();
        apiKeyInput.classList.add('ring-2', 'ring-red-500');
        setTimeout(() => apiKeyInput.classList.remove('ring-2', 'ring-red-500'), 2000);
        return;
    }

    const modelId = el('modelSelect')?.value || 'gemini-3-flash-preview';

    // Get Review Mode
    const reviewMode = document.querySelector('input[name="review-mode"]:checked')?.value || 'B';

    const btn = el('btnAnalyzeManuscript');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    btn.disabled = true;

    // Switch to Plan mode to ensure result is visible
    ui.setMode('plan');

    // Show loading state
    ui.renderEvaluation('_Generating analysis... please wait..._');

    try {
        const report = await llmService.evaluateManuscript(apiKey, manuscript, modelId, reviewMode);
        state.plan.evaluation = report;
        ui.renderEvaluation(report);
    } catch (err) {
        console.error(err);
        const errorMsg = `## ⚠️ Analysis Failed\n\nThe following error occurred while communicating with Gemini API:\n\n> ${err.message}\n\nPlease check your API key and Internet connection.`;
        ui.renderEvaluation(errorMsg);
        alert("Analysis failed: " + err.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
