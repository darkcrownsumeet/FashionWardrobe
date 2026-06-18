/* ============================================
   FashionWardrobe — Saved Outfits
   ============================================ */
const SavedPage = (() => {
    function getNavHTML() {
        return `
<nav id="main-nav" class="fixed top-0 left-0 w-full z-50 nav-solid">
    <div class="flex justify-between items-center px-4 sm:px-6 md:px-10 lg:px-16 py-4 md:py-5 gap-2 sm:gap-4">
        <!-- Left: Menu + Search -->
        <div class="flex items-center gap-3 sm:gap-5 flex-1 justify-start">
            <button class="nav-icon flex items-center gap-2 hover:opacity-70 transition-opacity md:hidden">
                <span class="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <button class="nav-icon flex items-center gap-2 hover:opacity-70 transition-opacity">
                <span class="material-symbols-outlined text-[20px]">search</span>
                <span class="hidden lg:inline font-label-caps text-[11px] tracking-[0.15em]">Search</span>
            </button>
        </div>
        <!-- Center: Brand -->
        <div class="flex justify-center flex-shrink-0">
            <span class="nav-brand font-display-lg tracking-[0.08em] font-bold cursor-pointer text-center" onclick="Router.navigate('/landing')">FASHIONWARDROBE</span>
        </div>
        <!-- Right: Links + Icons -->
        <div class="flex items-center justify-end gap-3 sm:gap-6 flex-1">
            <div class="hidden md:flex items-center gap-4 lg:gap-6">
                <a class="nav-icon font-label-caps text-[11px] tracking-[0.15em] hover:opacity-70 transition-opacity" href="#/landing">Discover</a>
                <a class="nav-icon nav-link-active font-label-caps text-[11px] tracking-[0.15em] hover:opacity-70 transition-opacity" href="#/saved">Saved</a>
            </div>
            <button class="nav-icon hover:opacity-70 transition-opacity" onclick="Router.navigate('/wishlist')" title="Wishlist">
                <span class="material-symbols-outlined text-[22px]" style="font-variation-settings:'FILL' 1;">favorite</span>
            </button>
            <button class="nav-icon hover:opacity-70 transition-opacity" onclick="Router.navigate('/auth')" title="Account">
                <span class="material-symbols-outlined text-[22px]">person_outline</span>
            </button>
        </div>
    </div>
</nav>
        `;
    }

    function render() {
        const saved = Store.getSaved();

        const cardsHtml = saved.length === 0
            ? `<div class="col-span-full flex flex-col items-center justify-center py-section-gap text-center">
                <span class="material-symbols-outlined text-[64px] text-outline-variant mb-6">bookmark_border</span>
                <h3 class="font-headline-md text-headline-md text-primary mb-4">No saved outfits yet</h3>
                <p class="font-body-md text-secondary mb-8 max-w-md">Start your style journey and save your favorite AI-curated looks to build your personal collection.</p>
                <button class="px-12 py-5 bg-primary text-on-primary font-button text-button uppercase hover:opacity-90 transition-all" onclick="Router.navigate('/gender')">Start Style Quiz</button>
              </div>`
            : saved.map(outfit => `
                <div class="group">
                    <div class="relative overflow-hidden rounded-xl aspect-[3/4] mb-4">
                        <img class="w-full h-full object-cover transition-transform duration-700 [transform:translateZ(0)] backface-hidden" src="${outfit.image}" alt="${outfit.name.replace(/'/g, "&#39;")}" onerror="this.onerror=null; this.src='https://image.pollinations.ai/prompt/${encodeURIComponent(outfit.name + ' fashion outfit')}?width=400&height=500&nologo=true';"/>
                        <div class="absolute top-4 right-4 glass-panel rounded-full px-3 py-1">
                            <span class="font-label-caps text-[10px] text-primary">${outfit.score}% MATCH</span>
                        </div>
                        <div class="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
                            <h3 class="font-headline-md text-white mb-1">${outfit.name}</h3>
                            <p class="font-label-caps text-[10px] text-white/70">Saved ${new Date(outfit.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <div class="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-3">
                                <button class="restyle-btn bg-primary text-on-primary px-6 py-3 font-button text-[11px] uppercase rounded-full shadow-lg hover:opacity-90 transition-all flex items-center gap-2 justify-center" data-id="${outfit.id}">
                                    <span class="material-symbols-outlined text-[14px]">auto_awesome</span> Re-Style
                                </button>
                                <button class="remove-btn bg-white/90 text-primary px-6 py-3 font-button text-[11px] uppercase rounded-full shadow-lg hover:bg-white transition-all flex items-center gap-2 justify-center" data-id="${outfit.id}">
                                    <span class="material-symbols-outlined text-[14px]">delete</span> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                    ${outfit.items && outfit.items.length > 0 ? `
                    <div class="flex -space-x-2 mt-2">
                        ${outfit.items.slice(0, 4).map(item => `<div class="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-surface-container"><img src="${item.image}" class="w-full h-full object-cover" alt="${item.name.replace(/'/g, "&#39;")}" onerror="this.onerror=null; this.src='https://image.pollinations.ai/prompt/${encodeURIComponent(item.name + ' fashion item')}?width=100&height=100&nologo=true';"/></div>`).join('')}
                        ${outfit.items.length > 4 ? `<div class="w-8 h-8 rounded-full border-2 border-white bg-primary-container flex items-center justify-center text-white text-[9px] font-bold">+${outfit.items.length - 4}</div>` : ''}
                    </div>` : ''}
                </div>
            `).join('');

        return `
<main class="pt-28 md:pt-40 mb-20 md:mb-section-gap px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
    <div class="mb-16">
        <h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">Your Collection</h1>
        <p class="font-body-lg text-secondary max-w-xl">Your personally curated and saved looks, ready for any occasion.</p>
        ${saved.length > 0 ? `<p class="font-label-caps text-label-caps text-primary mt-4">${saved.length} SAVED LOOK${saved.length > 1 ? 'S' : ''}</p>` : ''}
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">${cardsHtml}</div>
</main>

<!-- Mobile Bottom Nav -->
<div class="md:hidden fixed bottom-0 left-0 w-full glass-panel z-50 flex justify-around items-center py-4 border-t border-white/20">
    <button class="flex flex-col items-center gap-1" onclick="Router.navigate('/landing')">
        <span class="material-symbols-outlined text-secondary">home</span><span class="font-label-caps text-[10px] text-secondary">HOME</span>
    </button>
    <button class="flex flex-col items-center gap-1" onclick="Router.navigate('/results')">
        <span class="material-symbols-outlined text-secondary">auto_awesome</span><span class="font-label-caps text-[10px] text-secondary">MATCHES</span>
    </button>
    <button class="flex flex-col items-center gap-1">
        <span class="material-symbols-outlined text-primary" style="font-variation-settings:'FILL' 1;">bookmark</span><span class="font-label-caps text-[10px] text-primary">SAVED</span>
    </button>
</div>`;
    }

    function init() {
        // Render Nav into persistent container
        const navContainer = document.getElementById('persistent-nav');
        if (navContainer) {
            navContainer.innerHTML = getNavHTML();
        }

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                Store.removeOutfit(btn.dataset.id);
                App.showToast('Outfit removed');
                Router.navigate('/saved'); // re-render
            });
        });

        document.querySelectorAll('.restyle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const outfit = Store.getSaved().find(o => o.id === id);
                if (outfit && outfit.preferences) {
                    // Load saved preferences into current session
                    Object.keys(outfit.preferences).forEach(key => {
                        Store.set(key, outfit.preferences[key]);
                    });
                    
                    // Bypass Router Guard
                    if (!Store.get('budget')) {
                        Store.set('budget', 'Mid-range');
                    }
                    
                    App.showToast('Restyling saved look...');
                    Router.navigate('/results');
                }
            });
        });
    }

    return { render, init };
})();
