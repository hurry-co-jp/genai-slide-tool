export const renderPreview = {
    async renderStyleGuide(yamlStr) {
        try {
            const data = jsyaml.load(yamlStr);
            const colors = data.colors || {};
            const typo = data.typography || {};

            let html = '<div class="space-y-8">';

            // Colors
            html += '<section><h3 class="text-lg font-bold mb-4 text-slate-800 border-b pb-2">Colors</h3>';
            html += '<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">';
            for (const [key, val] of Object.entries(colors)) {
                html += `
                    <div class="bg-slate-50 rounded p-3 border border-slate-200">
                        <div class="h-12 w-full rounded mb-2 shadow-inner" style="background-color: ${val}"></div>
                        <div class="text-xs font-bold text-slate-700">${key}</div>
                        <div class="text-[10px] text-slate-500 font-mono">${val}</div>
                    </div>
                `;
            }
            html += '</div></section>';

            // Typography
            html += '<section><h3 class="text-lg font-bold mb-4 text-slate-800 border-b pb-2">Typography</h3>';
            html += '<div class="space-y-6">';

            // Title Slide Spec
            if (typo.title_slide) {
                html += '<div class="space-y-2">';
                html += '<h4 class="text-sm font-bold text-slate-500 uppercase">Title Slide</h4>';
                const main = typo.title_slide.main_title;
                const sub = typo.title_slide.sub_title;
                html += `
                    <div class="bg-white border border-slate-200 p-8 rounded shadow-sm">
                        <div style="color: ${main.color}; font-size: ${parseFloat(main.size) * 0.7}px; font-weight: ${main.weight}">Main Title Sample</div>
                        <div style="color: ${sub.color}; font-size: ${parseFloat(sub.size) * 0.7}px; font-weight: ${sub.weight}">Subtitle Sample Text</div>
                    </div>
                `;
                html += '</div>';
            }

            // Body Slide Spec
            if (typo.body_slide) {
                html += '<div class="space-y-2">';
                html += '<h4 class="text-sm font-bold text-slate-500 uppercase">Body Slide</h4>';
                const page = typo.body_slide.page_title;
                const h1 = typo.body_slide.heading1;
                const body = typo.body_slide.body_text;
                html += `
                    <div class="bg-white border border-slate-200 p-8 rounded shadow-sm">
                        <div class="mb-4 pb-2 border-b-2" style="color: ${page.color}; font-size: ${parseFloat(page.size) * 0.6}px; border-color: ${colors.primary || '#000'}">Page Title</div>
                        <div class="mb-2" style="color: ${h1.color}; font-size: ${parseFloat(h1.size) * 0.6}px; font-weight: ${h1.weight}">Heading 1</div>
                        <div style="color: ${body.color}; font-size: ${parseFloat(body.size) * 0.6}px; line-height: ${body.line_height}">
                            This is body text sample. <br>
                            The quick brown fox jumps over the lazy dog.
                        </div>
                    </div>
                `;
                html += '</div>';
            }

            html += '</div></section>';
            html += '</div>';
            return html;

        } catch (e) {
            return `<div class="text-red-500">Error parsing YAML: ${e.message}</div>`;
        }
    },

    async renderLayoutGallery(yamlStr) {
        try {
            const data = jsyaml.load(yamlStr);
            if (!Array.isArray(data)) return '<div class="text-red-500">Layout definition should be a list.</div>';

            let html = '<div class="layout-grid">';

            for (const layout of data) {
                const id = layout.id;
                // Generate CSS Mockup based on ID patterns
                let mockupCSS = 'bg-white';
                let contentHTML = '';

                // Heuristic mapping for mockup
                // Dynamic Rendering based on 'structure' field in YAML
                const type = layout.structure || 'generic';

                // Mapping based on defaults.js
                // Mapping based on defaults.js
                if (id === 'S01' || type === 'title-cover') {
                    contentHTML = `
                        <div class="h-full flex flex-col justify-center items-center text-center p-2">
                            <div class="w-3/4 h-3 bg-slate-800 mb-2 rounded-sm"></div>
                            <div class="w-1/2 h-1.5 bg-blue-500 rounded-sm"></div>
                            <div class="absolute bottom-2 right-2 w-1/4 h-1 bg-slate-300 rounded-sm"></div>
                        </div>`;
                } else if (id === 'S02' || type === 'list-vertical') {
                    // Agenda / List
                    contentHTML = `
                        <div class="h-full p-3 flex flex-col justify-center">
                            <div class="w-1/3 h-2 bg-slate-800 mb-3 rounded-sm"></div>
                            <div class="space-y-2 w-full pl-2 border-l-2 border-slate-200">
                                <div class="flex items-center gap-1"><div class="w-1 h-1 rounded-full bg-blue-500"></div><div class="w-10/12 h-1.5 bg-slate-200 rounded-sm"></div></div>
                                <div class="flex items-center gap-1"><div class="w-1 h-1 rounded-full bg-blue-500"></div><div class="w-11/12 h-1.5 bg-slate-200 rounded-sm"></div></div>
                                <div class="flex items-center gap-1"><div class="w-1 h-1 rounded-full bg-blue-500"></div><div class="w-9/12 h-1.5 bg-slate-200 rounded-sm"></div></div>
                            </div>
                        </div>`;
                } else if (id === 'S03' || type === 'center-message') {
                    contentHTML = `
                        <div class="h-full flex justify-center items-center bg-blue-600 p-4 relative overflow-hidden">
                            <div class="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
                            <div class="w-3/4 h-4 bg-white rounded-sm shadow-sm relative z-10"></div>
                        </div>`;
                } else if (id === 'L04' || type === 'split-image-text') {
                    // Fix for L04 - Specific Handling
                    contentHTML = `
                         <div class="h-full p-3 flex gap-2 items-center">
                            <div class="w-1/2 flex flex-col justify-center gap-1.5">
                                <div class="w-full h-1.5 bg-slate-700 rounded-sm"></div>
                                <div class="w-full h-1 bg-slate-300 rounded-sm"></div>
                                <div class="w-5/6 h-1 bg-slate-300 rounded-sm"></div>
                                <div class="w-full h-1 bg-slate-300 rounded-sm"></div>
                            </div>
                            <div class="w-1/2 h-full bg-slate-200 rounded-sm flex items-center justify-center overflow-hidden relative">
                                <div class="absolute inset-0 bg-slate-300 rotate-12 scale-150 opacity-20"></div>
                                <i class="fa-regular fa-image text-slate-400 text-xs relative z-10"></i>
                            </div>
                         </div>`;
                } else if (id.startsWith('D02') || type === 'visual-cover') {
                    contentHTML = `
                        <div class="h-full w-full bg-slate-800 flex items-center justify-center relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&q=80" class="absolute inset-0 w-full h-full object-cover opacity-40 grayscale mix-blend-overlay" />
                            <div class="relative z-10 text-center text-white p-4 border-y border-white/20 w-full">
                                <div class="text-[8px] font-bold tracking-widest">IMPACT VISUAL</div>
                            </div>
                        </div>`;
                } else if (id.startsWith('L') || type === 'grid-cols') {
                    // L01 is Bullet List (handled by list-vertical usually, but if defaults.js says L01 is list-vertical, it should hit S02 logic?
                    // defaults.js: L01 -> structure: list-vertical.
                    // AH! S02 check is `id === 'S02' || type === 'list-vertical'`.
                    // So L01 falls there.
                    // L02, L03 -> structure: grid-cols.
                    const cols = layout.cols || 2;
                    // Improved Grid Visual
                    contentHTML = `
                         <div class="h-full p-3 flex flex-col justify-center">
                            <div class="w-1/3 h-1.5 bg-slate-700 mb-2 rounded-sm"></div>
                            <div class="grid grid-cols-${cols} gap-2 w-full">
                                ${Array(cols).fill(0).map((_, i) =>
                        `<div class="flex flex-col gap-1 p-1 rounded ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'} border border-slate-100">
                                        <div class="h-1.5 w-1/2 bg-blue-100 rounded-sm mb-0.5"></div>
                                        <div class="h-1 w-full bg-slate-200 rounded-sm"></div>
                                        <div class="h-1 w-5/6 bg-slate-200 rounded-sm"></div>
                                        <div class="h-1 w-full bg-slate-200 rounded-sm"></div>
                                     </div>`
                    ).join('')}
                            </div>
                         </div>`;
                } else if (id === 'P01' || type === 'flow-horizontal') {
                    const steps = layout.steps || 4;
                    let stepHTML = '';
                    for (let i = 1; i <= steps; i++) {
                        stepHTML += `<div class="w-6 h-6 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-[5px] font-bold text-slate-500 relative z-10">${i}</div>`;
                        if (i < steps) stepHTML += `<div class="h-0.5 flex-grow bg-slate-200 -mx-1 relative z-0"></div>`;
                    }
                    contentHTML = `<div class="h-full flex items-center justify-between p-2 px-3">${stepHTML}</div>`;
                } else if (id === 'P02' || type === 'timeline') {
                    contentHTML = `
                        <div class="h-full flex flex-col justify-center p-3 relative">
                             <div class="w-full h-0.5 bg-slate-300 rounded relative">
                                <div class="absolute top-1/2 -mt-1 left-[10%] w-2 h-2 rounded-full bg-blue-500 shadow-sm z-10"></div>
                                <div class="absolute top-2 left-[10%] -translate-x-1/2 w-8 h-1 bg-slate-200 rounded-sm"></div>
                                
                                <div class="absolute top-1/2 -mt-1 left-[50%] w-2 h-2 rounded-full bg-blue-500 shadow-sm z-10"></div>
                                <div class="absolute bottom-2 left-[50%] -translate-x-1/2 w-8 h-1 bg-slate-200 rounded-sm"></div>

                                <div class="absolute top-1/2 -mt-1 left-[90%] w-2 h-2 rounded-full bg-blue-500 shadow-sm z-10"></div>
                                <div class="absolute top-2 left-[90%] -translate-x-1/2 w-8 h-1 bg-slate-200 rounded-sm"></div>
                             </div>
                        </div>`;
                } else if (id === 'P03' || type === 'pyramid') {
                    contentHTML = `
                         <div class="h-full flex flex-col justify-center items-center p-2 gap-0.5">
                            <div class="w-6 h-3 bg-blue-300 mx-auto rounded-t-sm"></div>
                            <div class="w-10 h-3 bg-blue-400 mx-auto"></div>
                            <div class="w-14 h-3 bg-blue-500 mx-auto"></div>
                            <div class="w-20 h-3 bg-blue-600 mx-auto rounded-b-sm"></div>
                         </div>`;
                } else if (id === 'P04' || type === 'hub-spoke') {
                    contentHTML = `
                         <div class="h-full relative flex items-center justify-center p-2">
                            <div class="w-8 h-8 bg-blue-600 rounded-full z-10 shadow-md border-2 border-white"></div>
                            <div class="absolute w-28 h-[1px] bg-slate-300 rotate-0"></div>
                            <div class="absolute w-28 h-[1px] bg-slate-300 rotate-90"></div>
                             <div class="absolute w-3 h-3 bg-slate-100 rounded-full border border-slate-300 top-2 left-[50%] -translate-x-1/2 shadow-sm"></div>
                             <div class="absolute w-3 h-3 bg-slate-100 rounded-full border border-slate-300 bottom-2 left-[50%] -translate-x-1/2 shadow-sm"></div>
                             <div class="absolute w-3 h-3 bg-slate-100 rounded-full border border-slate-300 left-3 top-[50%] -translate-y-1/2 shadow-sm"></div>
                             <div class="absolute w-3 h-3 bg-slate-100 rounded-full border border-slate-300 right-3 top-[50%] -translate-y-1/2 shadow-sm"></div>
                         </div>`;
                } else if (id === 'C01' || type === 'split-contrast') {
                    contentHTML = `
                         <div class="h-full flex">
                            <div class="w-1/2 bg-red-50 p-2 flex flex-col justify-center items-center border-r border-red-100">
                                <span class="text-[7px] text-red-400 font-bold mb-1 tracking-wider">BEFORE</span>
                                <div class="w-6 h-6 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center"></div>
                            </div>
                            <div class="w-1/2 bg-blue-50 p-2 flex flex-col justify-center items-center">
                                <span class="text-[7px] text-blue-500 font-bold mb-1 tracking-wider">AFTER</span>
                                <div class="w-8 h-8 rounded-full bg-blue-500 shadow-lg border-2 border-white flex items-center justify-center">
                                    <i class="fa-solid fa-check text-white text-[8px]"></i>
                                </div>
                            </div>
                         </div>`;
                } else if (id === 'C02' || (type === 'table-grid' && layout.cols === 2)) {
                    // Matrix (4 Grid)
                    contentHTML = `
                         <div class="h-full p-3 relative flex items-center justify-center">
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="w-full h-[1px] bg-slate-300"></div>
                                <div class="absolute h-full w-[1px] bg-slate-300"></div>
                            </div>
                            <div class="grid grid-cols-2 w-full h-full relative z-10 gap-1">
                                <div class="flex items-center justify-center rounded"><div class="w-6 h-1.5 bg-slate-200/50 rounded-sm"></div></div>
                                <div class="flex items-center justify-center rounded"><div class="w-6 h-1.5 bg-slate-200/50 rounded-sm"></div></div>
                                <div class="flex items-center justify-center rounded"><div class="w-6 h-1.5 bg-slate-200/50 rounded-sm"></div></div>
                                <div class="flex items-center justify-center rounded bg-blue-50/50"><div class="w-6 h-1.5 bg-blue-200 rounded-sm"></div></div>
                            </div>
                            <div class="absolute top-1 left-1/2 -translate-x-1/2 text-[5px] text-slate-400 font-bold bg-white px-1 scale-75">High</div>
                         </div>`;
                } else if (id === 'C03' || (type === 'table-grid' && layout.cols > 2)) {
                    // Comparison Table
                    const cols = layout.cols || 4;
                    contentHTML = `
                         <div class="h-full px-3 py-4 flex flex-col justify-center">
                            <div class="flex border-b border-slate-300 pb-1 mb-1 gap-0.5">
                                <div class="w-1/4 h-2 bg-slate-200 rounded-sm"></div>
                                <div class="flex-1 h-2 bg-blue-100 rounded-sm"></div>
                                <div class="flex-1 h-2 bg-slate-100 rounded-sm"></div>
                                <div class="flex-1 h-2 bg-slate-100 rounded-sm"></div>
                            </div>
                            <div class="space-y-1 w-full">
                                ${Array(4).fill(0).map(() =>
                        `<div class="flex gap-0.5 items-center border-b border-slate-50 pb-0.5">
                                        <div class="w-1/4 h-1.5 bg-slate-50 rounded-sm"></div>
                                        <div class="flex-1 h-1.5 flex justify-center"><div class="w-2 h-2 rounded-full border border-blue-400 text-blue-500 text-[6px] flex items-center justify-center">o</div></div>
                                        <div class="flex-1 h-1.5 flex justify-center"><div class="w-2 h-2 text-slate-300 text-[6px] flex items-center justify-center">-</div></div>
                                        <div class="flex-1 h-1.5 flex justify-center"><div class="w-2 h-2 text-slate-300 text-[6px] flex items-center justify-center">x</div></div>
                                     </div>`
                    ).join('')}
                            </div>
                         </div>`;
                } else if (id.startsWith('D01') || type === 'big-number') {
                    contentHTML = `
                        <div class="h-full w-full flex flex-col items-center justify-center bg-white p-2 text-center">
                            <div class="text-3xl font-black text-blue-600 leading-none">90<span class="text-xs align-top">%</span></div>
                            <div class="text-[5px] text-slate-400 tracking-widest mt-1 uppercase">Annual Growth</div>
                        </div>`;
                } else if (id === 'T01' || type === 'split-code-left-context') {
                    // T01: Code & Context
                    contentHTML = `
                         <div class="h-full flex">
                            <div class="w-1/3 bg-slate-50 p-2 flex flex-col justify-center border-r border-slate-200">
                                <div class="w-full h-1.5 bg-slate-700 rounded-sm mb-1.5"></div>
                                <div class="w-full h-1 bg-slate-300 rounded-sm mb-0.5"></div>
                                <div class="w-5/6 h-1 bg-slate-300 rounded-sm mb-0.5"></div>
                            </div>
                            <div class="w-2/3 bg-slate-900 p-2 font-mono text-[5px] text-slate-400 overflow-hidden flex flex-col justify-center">
                                <div class="text-green-400">function hello() {</div>
                                <div class="pl-2">console.log("world");</div>
                                <div class="">}</div>
                            </div>
                         </div>`;
                } else if (id === 'T02' || type === 'window-console') {
                    // T02: Terminal
                    contentHTML = `
                         <div class="h-full p-2 flex items-center justify-center">
                            <div class="w-full h-full bg-slate-900 rounded-md border border-slate-700 shadow-sm flex flex-col overflow-hidden">
                                <div class="h-3 bg-slate-800 border-b border-slate-700 flex items-center px-2 gap-1">
                                    <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                    <div class="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                    <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                </div>
                                <div class="p-2 font-mono text-[4px] text-green-500 leading-tight">
                                    <div>$ build start</div>
                                    <div class="text-slate-400">Compiling... 100%</div>
                                    <div class="text-blue-400">[INFO] Success</div>
                                    <div class="animate-pulse">_</div>
                                </div>
                            </div>
                         </div>`;
                } else if (id === 'T03' || type === 'diagram-mermaid') {
                    // T03: Architecture Diagram (Mermaid mock)
                    contentHTML = `
                         <div class="h-full p-2 flex items-center justify-center bg-white">
                            <div class="border border-slate-300 rounded p-1 flex items-center justify-center gap-2">
                                <div class="w-6 h-6 border border-slate-400 rounded flex items-center justify-center bg-blue-50 text-[3px]">Client</div>
                                <div class="w-4 h-[1px] bg-slate-400 relative"><div class="absolute right-0 top-1/2 -mt-0.5 w-0 h-0 border-l-[3px] border-l-slate-400 border-y-[2px] border-y-transparent"></div></div>
                                <div class="w-6 h-6 border border-slate-400 rounded flex items-center justify-center bg-yellow-50 text-[3px]">API</div>
                                <div class="w-4 h-[1px] bg-slate-400 relative"><div class="absolute right-0 top-1/2 -mt-0.5 w-0 h-0 border-l-[3px] border-l-slate-400 border-y-[2px] border-y-transparent"></div></div>
                                <div class="w-4 h-6 border border-slate-400 rounded-t-full rounded-b-md flex items-center justify-center bg-green-50 text-[3px]">DB</div>
                            </div>
                         </div>`;
                } else if (id === 'T04' || type === 'stack-vertical-code') {
                    // T04: Troubleshooting (Log + Code)
                    contentHTML = `
                         <div class="h-full flex flex-col">
                            <div class="h-1/3 bg-slate-900 p-2 text-[4px] font-mono text-red-400 border-b border-white/20 flex flex-col justify-center">
                                <div>[ERROR] Connection Refused: 500</div>
                                <div class="text-slate-500">at /app/lib/db.js:42</div>
                            </div>
                            <div class="h-2/3 bg-slate-50 p-2 font-mono text-[4px] text-slate-600 border-t border-slate-200 relative">
                                <div class="absolute top-1 right-1 bg-green-100 text-green-700 px-1 rounded text-[3px] font-bold">FIX</div>
                                <div class="text-slate-400">// Fixed timeout</div>
                                <div>const timeout = 5000;</div>
                            </div>
                         </div>`;
                } else {
                    // Generic fallback
                    contentHTML = `
                         <div class="h-full p-2 flex flex-col">
                            <div class="w-1/3 h-2 bg-slate-800 mb-2 rounded-sm"></div>
                            <div class="flex-grow bg-slate-50 rounded border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
                                ${layout.name}
                            </div>
                         </div>`;
                }

                html += `
                    <div class="layout-card bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-all active:scale-95" data-layout-id="${id}">
                        <div class="aspect-[16/9] bg-slate-50 border-b border-slate-100 relative pointer-events-none">
                             ${contentHTML}
                             <div class="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-1.5 rounded">${id}</div>
                        </div>
                        <div class="p-3 pointer-events-none">
                            <div class="font-bold text-sm text-slate-700 mb-1">${layout.name}</div>
                            <div class="text-xs text-slate-500 line-clamp-2" title="${layout.description}">${layout.description}</div>
                        </div>
                    </div>
                `;
            }

            html += '</div>';
            return html;
        } catch (e) {
            return `<div class="text-red-500">Error parsing YAML: ${e.message}</div>`;
        }
    }
};

window.renderPreview = renderPreview;
