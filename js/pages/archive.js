/* ============================================
   FashionWardrobe — Archive (Saved Looks)
   ============================================ */
const ArchivePage = (() => {

    function render() {
        return `
<div class="min-h-screen bg-background dark:bg-foreground text-foreground dark:text-background selection:bg-brand selection:text-brand-foreground" id="archive-wrapper">
    <!-- Top Nav -->
    <nav class="sticky top-0 z-50 flex items-baseline justify-between border-b border-foreground dark:border-background bg-background dark:bg-foreground px-6 py-4">
        <div class="font-mono text-xs font-bold tracking-tighter cursor-pointer" onclick="window.Router.navigate('/landing')">
            FASHIONWARDROBE<sup class="ml-1 text-brand">®</sup>
        </div>
        <div class="flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest">
            <span class="hidden sm:inline-block border border-foreground dark:border-background px-3 py-1">ARCHIVE</span>
            <button class="transition-colors hover:text-brand flex items-center gap-2" onclick="if(window.Walkthrough) window.Walkthrough.startArchiveTour()" title="Replay Walkthrough" id="archive-help-btn">
                <span class="material-symbols-outlined text-[14px]">help</span>
            </button>
            <button class="transition-colors hover:text-brand flex items-center gap-2" onclick="window.Router.navigate('/landing')">
                <span class="material-symbols-outlined text-[14px]">close</span>
            </button>
        </div>
    </nav>

    <main class="px-6 py-12 lg:py-20 max-w-[1440px] mx-auto flex-grow w-full flex flex-col">
        <div class="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-foreground/10 dark:border-background/10 pb-6 animate-[reveal_0.8s_var(--ease-out-expo)_both]">
            <div>
                <p class="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted">
                    <span class="h-px w-8 bg-brand"></span>
                    YOUR DIGITAL CLOSET
                </p>
                <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase leading-[0.85] tracking-tighter font-sans antialiased">
                    CURATED<br><span class="text-brand">ARCHIVE</span>.
                </h1>
            </div>
            <div class="flex flex-col items-end gap-4" id="archive-sort-container">
                <span class="font-mono text-[10px] uppercase tracking-widest text-muted" id="archive-count-display">0 LOOKS SAVED</span>
                <div class="flex border-[2px] border-foreground dark:border-background">
                    <button id="sort-newest" class="px-4 py-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-colors bg-foreground dark:bg-background text-background dark:text-foreground" onclick="ArchivePage.setSort('newest')">NEWEST</button>
                    <button id="sort-score" class="px-4 py-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-colors bg-background dark:bg-foreground text-foreground dark:text-background hover:bg-foreground/10 dark:hover:bg-background/10" onclick="ArchivePage.setSort('score')">SCORE</button>
                </div>
            </div>
        </div>

        <div id="archive-grid" class="flex-grow grid grid-cols-1 gap-0 border-t border-l border-foreground dark:border-background bg-background dark:bg-foreground md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 content-start animate-[reveal_0.8s_var(--ease-out-expo)_both] [animation-delay:150ms]">
            <!-- Rendered via JS -->
        </div>
    </main>

    <!-- Footer matching landing -->
    <footer class="px-6 py-12 border-t border-foreground dark:border-background">
        <div class="grid grid-cols-2 gap-12 lg:grid-cols-4 max-w-[1440px] mx-auto">
            <div class="col-span-2">
                <div class="mb-8 text-3xl font-extrabold tracking-tighter sm:text-4xl">FASHIONWARDROBE<span class="text-brand">.</span></div>
                <p class="max-w-xs font-mono text-xs uppercase leading-relaxed text-muted">© FASHIONWARDROBE. DESIGNED FOR YOU.</p>
            </div>
        </div>
    </footer>
</div>`;
    }

    let currentSort = 'newest';

    function init() {
        let savedOutfits = Store.getSaved() || [];
        const grid = document.getElementById('archive-grid');
        const countDisplay = document.getElementById('archive-count-display');
        
        if (countDisplay) {
            countDisplay.innerText = `${savedOutfits.length} LOOK${savedOutfits.length === 1 ? '' : 'S'} SAVED`;
        }

        if (currentSort === 'newest') {
            savedOutfits.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        } else if (currentSort === 'score') {
            savedOutfits.sort((a, b) => (b.score || 0) - (a.score || 0));
        }

        if (savedOutfits.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full bg-background dark:bg-foreground py-16 flex flex-col items-center justify-center text-center animate-[reveal_0.8s_var(--ease-out-expo)_both]">
                    <span class="material-symbols-outlined text-6xl text-muted mb-6">inventory_2</span>
                    <h2 class="text-2xl lg:text-4xl font-extrabold uppercase tracking-tighter mb-4">ARCHIVE IS EMPTY</h2>
                    <p class="font-mono text-xs text-muted mb-8 max-w-md">You haven't saved any curated looks yet. Generate a look and save it to build your digital wardrobe.</p>
                    <button onclick="window.Router.navigate('/gender')" class="group flex items-center gap-3 bg-brand px-6 py-3 font-mono text-xs uppercase tracking-tighter text-brand-foreground transition-opacity hover:opacity-90 mx-auto">
                        Generate Look <span class="transition-transform group-hover:translate-x-1">→</span>
                    </button>
                </div>
            `;
            grid.className = 'w-full animate-[reveal_0.8s_var(--ease-out-expo)_both] [animation-delay:150ms] border-t border-foreground/10 dark:border-background/10 mt-8';
            return;
        }

        grid.className = 'flex-grow grid grid-cols-1 gap-0 border-t border-l border-foreground dark:border-background bg-background dark:bg-foreground md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 content-start animate-[reveal_0.8s_var(--ease-out-expo)_both] [animation-delay:150ms]';

        // Render saved looks
        grid.innerHTML = savedOutfits.map((outfit, index) => {
            const dateStr = new Date(outfit.savedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            
            return `
            <div class="archive-card group flex flex-col bg-background dark:bg-foreground p-6 transition-colors hover:bg-secondary relative border-r border-b border-foreground dark:border-background" id="archive-card-${outfit.id}">
                <div class="mb-6 flex items-center justify-between font-mono text-xs">
                    <span class="font-bold">0${(index + 1).toString()}</span>
                    <div class="flex items-center gap-3">
                        <button onclick="ArchivePage.shareOutfit('${outfit.id}')" class="archive-share-btn text-brand opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1 hover:text-foreground" title="Share Look">
                            <span class="material-symbols-outlined text-[14px]">ios_share</span>
                        </button>
                        <button onclick="ArchivePage.deleteOutfit('${outfit.id}')" class="archive-delete-btn text-red-500 opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1 hover:text-red-700" title="Delete Look">
                            <span class="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                    </div>
                </div>
                <div class="mb-6 aspect-[3/4] w-full overflow-hidden bg-[var(--neutral-100)] relative border-[2px] border-transparent group-hover:border-brand transition-colors duration-500 cursor-pointer" onclick="ArchivePage.viewOutfit('${outfit.id}')" title="View Details">
                    <img src="${outfit.image}" alt="${outfit.name.replace(/'/g, "&#39;")}" loading="lazy" class="h-full w-full object-cover grayscale transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:grayscale-0">
                    <div class="absolute bottom-4 right-4 bg-background/90 dark:bg-foreground/90 backdrop-blur-sm border border-foreground dark:border-background px-3 py-2 font-mono text-[10px] font-bold">
                        SCORE: ${outfit.score || 90}
                    </div>
                    <div class="absolute inset-0 bg-brand/0 group-hover:bg-brand/20 transition-colors flex items-center justify-center">
                        <span class="bg-background dark:bg-foreground text-foreground dark:text-background font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-foreground dark:border-background opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 shadow-lg">View Look</span>
                    </div>
                </div>
                <h3 class="text-xl font-extrabold uppercase tracking-tighter transition-colors group-hover:text-brand cursor-pointer" onclick="ArchivePage.viewOutfit('${outfit.id}')">${outfit.name}</h3>
                <p class="mt-2 font-mono text-[10px] uppercase text-muted mb-4">${dateStr}</p>
                <div class="flex flex-wrap gap-2 mt-auto">
                    ${(outfit.items || []).slice(0, 3).map(i => `<span class="px-2 py-1 bg-foreground/5 dark:bg-background/5 text-foreground dark:text-background border border-foreground/10 dark:border-background/10 text-[8px] font-mono uppercase truncate max-w-[120px]" title="${i.name.replace(/'/g, "&#39;")}">${i.name}</span>`).join('')}
                    ${(outfit.items && outfit.items.length > 3) ? `<span class="px-2 py-1 bg-foreground/5 dark:bg-background/5 text-foreground dark:text-background border border-foreground/10 dark:border-background/10 text-[8px] font-mono uppercase">+${outfit.items.length - 3}</span>` : ''}
                </div>
            </div>
            `;
        }).join('');

        // Trigger tour if needed
        setTimeout(() => {
            if (!localStorage.getItem('fw_has_seen_archive_tour')) {
                localStorage.setItem('fw_has_seen_archive_tour', 'true');
                if (window.Walkthrough) window.Walkthrough.startArchiveTour();
            }
        }, 1000);
    }

    function deleteOutfit(id) {
        if(confirm("Are you sure you want to remove this look from your archive?")) {
            Store.removeOutfit(id);
            init();
            App.showToast("Look removed from archive");
        }
    }

    function viewOutfit(id) {
        const outfit = Store.getSaved().find(o => o.id === id);
        if (outfit) {
            Store.set('shared_look', outfit);
            window.Router.navigate('/view');
        }
    }

    function shareOutfit(id) {
        const outfit = Store.getSaved().find(o => o.id === id);
        if (outfit) {
            try {
                // Minify data for URL
                const minified = {
                    name: outfit.name,
                    image: outfit.image,
                    score: outfit.score,
                    items: outfit.items.map(i => ({ name: i.name, image: i.image }))
                };
                const base64 = btoa(JSON.stringify(minified));
                const url = window.location.origin + window.location.pathname + '#/view?data=' + base64;
                
                navigator.clipboard.writeText(url).then(() => {
                    App.showToast("Share link copied to clipboard!");
                }).catch(err => {
                    console.error("Could not copy text: ", err);
                    App.showToast("Failed to copy link.");
                });
            } catch (e) {
                console.error(e);
                App.showToast("Failed to generate share link.");
            }
        }
    }

    function setSort(mode) {
        currentSort = mode;
        document.getElementById('sort-newest').className = mode === 'newest' ? 'px-4 py-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-colors bg-foreground dark:bg-background text-background dark:text-foreground' : 'px-4 py-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-colors bg-background dark:bg-foreground text-foreground dark:text-background hover:bg-foreground/10 dark:hover:bg-background/10';
        document.getElementById('sort-score').className = mode === 'score' ? 'px-4 py-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-colors bg-foreground dark:bg-background text-background dark:text-foreground' : 'px-4 py-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-colors bg-background dark:bg-foreground text-foreground dark:text-background hover:bg-foreground/10 dark:hover:bg-background/10';
        init();
    }

    return { render, init, deleteOutfit, viewOutfit, shareOutfit, setSort };
})();

window.ArchivePage = ArchivePage;
