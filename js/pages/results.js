/* ============================================
   FashionWardrobe — Style Curation Results (Step 6)
   ============================================ */
const ResultsPage = (() => {

    function render() {
        return `
<div class="h-screen w-screen bg-background text-foreground flex flex-col selection:bg-brand selection:text-brand-foreground overflow-hidden" id="results-wrapper">
    <!-- Top Nav -->
    <nav class="sticky top-0 z-50 flex items-baseline justify-between border-b border-foreground bg-background px-6 py-4 shrink-0">
        <div class="font-mono text-xs font-bold tracking-tighter cursor-pointer" onclick="window.Router.navigate('/landing')">
            FASHIONWARDROBE<sup class="ml-1 text-brand">®</sup>
        </div>
        <div class="flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest">
            <span class="hidden sm:inline-block border border-foreground px-3 py-1">INDEX 06 / 06</span>
            <button class="transition-colors hover:text-brand flex items-center gap-2" onclick="window.Router.navigate('/landing')">
                <span class="material-symbols-outlined text-[14px]">close</span>
            </button>
        </div>
    </nav>

    <main class="flex-grow flex items-center justify-center border-b border-foreground h-full overflow-hidden relative bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')]" id="results-container">
        <div class="flex flex-col items-center bg-background p-12 border-[2px] border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <span class="material-symbols-outlined text-5xl text-brand mb-6 animate-pulse">auto_awesome</span>
            <div class="font-sans font-extrabold text-4xl uppercase tracking-tighter mb-4">Analyzing</div>
            <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground" id="loading-text">Extracting style DNA...</span>
        </div>
    </main>

    <!-- Bottom Bar (Disabled while loading) -->
    <footer class="bg-background flex flex-col md:flex-row items-stretch shrink-0 z-50 relative pointer-events-none opacity-50">
        <div class="flex-1 p-6 flex items-center justify-between md:justify-start gap-12 border-b md:border-b-0 md:border-r border-foreground">
            <button class="font-mono text-[10px] uppercase tracking-[0.3em] text-muted flex items-center gap-2">
                <span class="material-symbols-outlined text-[14px]">arrow_back</span> BACK
            </button>
        </div>
        <div class="flex-1 p-6"></div>
    </footer>
</div>`;
    }

    async function init() {
        const prefs = Store.getAll();
        
        const container = document.getElementById('results-wrapper');
        
        // Cycle loading messages
        const messages = ["Curating style profile...", "Checking color harmony...", "Preparing style suggestions...", "Finalizing lookbook..."];
        let msgIndex = 0;
        const msgInterval = setInterval(() => {
            const el = document.getElementById('loading-text');
            if (el) {
                msgIndex = (msgIndex + 1) % messages.length;
                el.style.opacity = 0;
                setTimeout(() => {
                    el.textContent = messages[msgIndex];
                    el.style.opacity = 1;
                }, 300);
            }
        }, 2000);

        try {
            const result = await RecommendationEngine.generate(prefs);
            clearInterval(msgInterval);
            
            const { yourLook, clashes, accessories, explanation, matchScore } = result;
            
            let finalScore = matchScore || 92; 
            finalScore = Math.max(45, Math.min(99, finalScore));
            
            const splitLayoutHtml = `
            <!-- Top Nav -->
            <nav class="sticky top-0 z-50 flex items-baseline justify-between border-b border-foreground bg-background px-6 py-4 shrink-0">
                <div class="font-mono text-xs font-bold tracking-tighter cursor-pointer" onclick="window.Router.navigate('/landing')">
                    FASHIONWARDROBE<sup class="ml-1 text-brand">®</sup>
                </div>
                <div class="flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest">
                    <span class="hidden sm:inline-block border border-foreground px-3 py-1">INDEX 06 / 06</span>
                    <button class="transition-colors hover:text-brand flex items-center gap-2" onclick="window.Router.navigate('/landing')">
                        <span class="material-symbols-outlined text-[14px]">close</span>
                    </button>
                </div>
            </nav>

            <!-- Main Content -->
            <main class="flex-grow flex flex-col lg:flex-row border-b border-foreground h-full overflow-hidden">
                
                <!-- Left Side: Base Look -->
                <div class="w-full lg:w-[35%] h-[40%] lg:h-full flex flex-col border-b lg:border-b-0 lg:border-r border-foreground p-6 lg:p-12 relative overflow-y-auto">
                    <div class="mt-2 lg:mt-8 z-10 flex flex-col">
                        <span class="font-mono text-[10px] uppercase tracking-[0.3em] text-brand mb-2 block">Step 06 / 06</span>
                        <h1 class="text-3xl lg:text-[clamp(2.5rem,3.5vw,4.5rem)] font-extrabold uppercase leading-[0.85] tracking-tighter font-sans antialiased mb-10">
                            Base<br>
                            <span class="text-brand">Look</span>
                        </h1>
                        
                        <!-- Items list -->
                        <div class="flex flex-col gap-8 mb-10 px-2 pb-4">
                            ${(yourLook || []).map((item, idx) => `
                                <div class="relative flex flex-col border-[4px] border-brand shadow-[0_20px_50px_rgba(0,0,0,0.3)] aspect-[4/5] w-full overflow-hidden rounded-sm">
                                    <!-- Background Image -->
                                    <img src="${item.image}" alt="${item.name.replace(/'/g, "&#39;")}" class="absolute inset-0 w-full h-full object-cover" style="object-position: ${item.objectPosition || 'center top'};">
                                    
                                    <!-- Gradients -->
                                    <div class="absolute top-0 inset-x-0 h-1/4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>
                                    <div class="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                                    
                                    <!-- Top Left Number -->
                                    <div class="absolute top-6 left-6 font-mono text-[10px] text-white tracking-[0.3em] font-bold z-10">0${idx + 1}</div>
                                    
                                    <!-- Top Right Icon -->
                                    <div class="absolute top-6 right-6 z-10 material-symbols-outlined text-brand">check_circle</div>
                                    
                                    <!-- Bottom Content -->
                                    <div class="absolute bottom-0 left-0 w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-1 z-10">
                                        <span class="text-xl lg:text-3xl font-extrabold uppercase tracking-tighter text-white leading-none">${item.name}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="bg-foreground/5 p-5 border-l-[4px] border-brand">
                            <span class="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground block mb-3">WHY IT WORKS</span>
                            <p class="font-mono text-xs text-foreground/80 leading-relaxed">${explanation || 'This combination provides a solid foundation for your selected vibe.'}</p>
                        </div>
                    </div>
                </div>

                <!-- Right Side: Style Suggestions -->
                <div class="w-full lg:w-[65%] h-[60%] lg:h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] overflow-y-auto p-6 lg:p-12 relative">
                    
                    <div class="flex flex-col sm:flex-row sm:items-end justify-between border-b-[2px] border-foreground pb-6 mb-10 gap-6">
                        <h2 class="font-sans font-extrabold text-3xl lg:text-5xl uppercase tracking-tighter leading-none">AI<br>Analysis</h2>
                        <div class="inline-flex items-center gap-4 px-6 py-3 border-[2px] border-foreground bg-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] w-fit shrink-0">
                            <span class="font-mono text-3xl font-black text-brand">${finalScore}</span>
                            <div class="w-px h-8 bg-foreground/20"></div>
                            <span class="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">SCORE</span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-8 pb-12">
                        <!-- Clashes first -->
                        ${(clashes || []).map(clash => `
                            <div class="border-[2px] border-red-500 bg-red-500/10 p-6 lg:p-8 flex flex-col gap-3 relative overflow-hidden">
                                <div class="flex items-center gap-3 mb-2">
                                    <span class="material-symbols-outlined text-red-500">warning</span>
                                    <span class="font-mono text-[10px] uppercase tracking-widest text-red-500 font-bold">Conflict Detected</span>
                                </div>
                                <p class="font-sans font-bold text-lg uppercase tracking-tight text-foreground">${clash.reason}</p>
                                <p class="font-mono text-xs text-foreground/70 border-l-[2px] border-red-500/50 pl-4 py-1 mt-2">${clash.tip}</p>
                            </div>
                        `).join('')}

                        <div class="flex items-center gap-4 mt-4">
                            <span class="font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">RECOMMENDED ADDITIONS</span>
                            <div class="h-px bg-foreground/20 flex-grow"></div>
                        </div>

                        <!-- Text-only Suggestions -->
                        ${(accessories || []).map((acc, i) => `
                            <div class="border-[2px] border-foreground bg-background p-6 lg:p-8 flex flex-col relative transition-all hover:bg-foreground/5 group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1">
                                <div class="absolute top-6 right-6 font-mono text-[10px] text-muted-foreground tracking-[0.3em] font-bold">0${i + 1}</div>
                                
                                <span class="font-mono text-[10px] text-brand tracking-widest uppercase mb-3 block">${acc.category || 'Accessory'}</span>
                                <h3 class="font-sans font-extrabold text-2xl lg:text-3xl uppercase tracking-tighter mb-4 w-5/6 leading-tight">${acc.name}</h3>
                                
                                <p class="font-mono text-xs text-foreground/80 leading-relaxed mb-8 max-w-2xl">${acc.why || acc.description || 'A highly recommended addition to complete your intended aesthetic.'}</p>
                                
                                ${acc.colors ? `
                                <div class="flex flex-col sm:flex-row gap-6 border-t-[2px] border-foreground/10 pt-5 mt-auto">
                                    <div class="flex items-start gap-3">
                                        <span class="material-symbols-outlined text-[16px] text-brand mt-0.5">check_circle</span>
                                        <div class="flex flex-col">
                                            <span class="font-mono text-[9px] uppercase tracking-widest font-bold mb-1">PAIRS WITH</span>
                                            <span class="font-mono text-xs text-muted-foreground">${(acc.colors.match || []).join(', ')}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span class="material-symbols-outlined text-[16px] text-foreground/30 mt-0.5">cancel</span>
                                        <div class="flex flex-col">
                                            <span class="font-mono text-[9px] uppercase tracking-widest font-bold mb-1">LESS RECOMMENDED</span>
                                            <span class="font-mono text-xs text-muted-foreground">${(acc.colors.avoid || []).join(', ')}</span>
                                        </div>
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </main>

            <!-- Bottom Bar -->
            <footer class="bg-background flex flex-col md:flex-row items-stretch border-t border-foreground shrink-0 z-50 relative">
                <div class="flex-1 p-6 flex items-center justify-between md:justify-start gap-12 border-b md:border-b-0 md:border-r border-foreground">
                    <button class="font-mono text-[10px] uppercase tracking-[0.3em] text-muted hover:text-foreground transition-colors flex items-center group" onclick="window.Router.navigate('/color-budget')">
                        <span class="material-symbols-outlined text-[14px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span> BACK
                    </button>
                </div>
                <div class="flex-1 flex items-stretch">
                    <button class="flex-1 bg-background text-foreground font-mono text-xs uppercase tracking-widest p-6 transition-all hover:bg-foreground/5 border-r border-foreground flex items-center justify-center gap-3" onclick="Store.clearSession(); window.Router.navigate('/gender')">
                        <span class="material-symbols-outlined">restart_alt</span> Create New Look
                    </button>
                    <button id="save-look-btn" class="flex-1 bg-brand text-brand-foreground font-mono text-xs uppercase tracking-widest p-6 transition-all hover:opacity-90 flex items-center justify-center gap-3 group">
                        <span class="material-symbols-outlined group-hover:-translate-y-1 transition-transform">bookmark</span> Save Look
                    </button>
                </div>
            </footer>
            `;

            container.innerHTML = splitLayoutHtml;

            // Bind events
            document.getElementById('save-look-btn')?.addEventListener('click', () => {
                const lookName = yourLook.map(i => i.name).join(' + ') || 'Curated Look';
                if (Store.isOutfitSaved(lookName)) { App.showToast('Outfit already saved'); return; }
                
                Store.saveOutfit({
                    name: lookName,
                    image: yourLook[0]?.image || '',
                    score: finalScore,
                    items: [
                        ...yourLook.map(i => ({ name: i.name, price: 0, image: i.image })),
                        ...(accessories || []).map(a => ({ name: a.name, price: a.price || 0, image: '' }))
                    ],
                    preferences: prefs
                });
                App.showToast('Look added to collection');
                const btn = document.getElementById('save-look-btn');
                if (btn) {
                    btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">bookmark_added</span> Saved';
                    btn.classList.replace('bg-brand', 'bg-foreground');
                    btn.classList.replace('text-brand-foreground', 'text-background');
                }
            });

        } catch (error) {
            clearInterval(msgInterval);
            console.error('Results page error:', error);
            container.innerHTML = `
            <div class="flex-grow flex items-center justify-center border-b border-foreground h-full">
                <div class="flex flex-col items-center max-w-md text-center p-6">
                    <span class="material-symbols-outlined text-5xl text-red-500 mb-6">error</span>
                    <h2 class="font-sans font-extrabold text-2xl uppercase tracking-tighter mb-4">Analysis Failed</h2>
                    <p class="font-mono text-xs text-muted-foreground mb-8">The styling engine is temporarily unreachable.</p>
                    <button class="px-6 py-3 border-[2px] border-foreground font-mono text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors" onclick="ResultsPage._retryInit()">Try Again</button>
                </div>
            </div>`;
        }
    }

    function _retryInit() {
        const container = document.getElementById('results-wrapper');
        if(container) {
            container.innerHTML = render();
            init();
        }
    }

    return { render, init, _retryInit };
})();
