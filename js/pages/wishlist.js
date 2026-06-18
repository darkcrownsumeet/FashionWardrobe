/* ============================================
   FashionWardrobe — Wishlist Page
   ============================================ */
const WishlistPage = (() => {
    function render() {
        const wishlist = Store.getWishlist();

        const cardsHtml = wishlist.length === 0
            ? `<div class="col-span-full flex flex-col items-center justify-center py-section-gap text-center">
                <span class="material-symbols-outlined text-[64px] text-outline-variant mb-6">favorite_border</span>
                <h3 class="font-headline-md text-headline-md text-primary mb-4">Your wishlist is empty</h3>
                <p class="font-body-md text-secondary mb-8 max-w-md">Browse our curated collections and tap the heart icon on items you love to add them here.</p>
                <button class="px-12 py-5 bg-primary text-on-primary font-button text-button uppercase hover:opacity-90 transition-all" onclick="Router.navigate('/landing')">Explore Collections</button>
              </div>`
            : wishlist.map(item => `
                <div class="group">
                    <div class="relative overflow-hidden rounded-xl aspect-[3/4] mb-4">
                        <img class="w-full h-full object-cover transition-transform duration-700 [transform:translateZ(0)] backface-hidden" src="${item.image}" alt="${item.name.replace(/'/g, "&#39;")}" onerror="this.onerror=null; this.src='https://image.pollinations.ai/prompt/${encodeURIComponent(item.name + ' fashion')}?width=400&height=500&nologo=true';"/>
                        <div class="absolute top-4 right-4">
                            <button class="wishlist-remove-btn w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-all" data-id="${item.id}">
                                <span class="material-symbols-outlined text-red-500 text-[20px]" style="font-variation-settings:'FILL' 1;">favorite</span>
                            </button>
                        </div>
                        <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 class="font-headline-md text-white mb-1 leading-tight">${item.name}</h3>
                            <div class="flex justify-between items-center mt-2">
                                <p class="font-label-caps text-[10px] text-white/70">${item.category || 'FASHION'}</p>
                                <span class="font-body-md text-white font-semibold">$${item.price || 0}</span>
                            </div>
                        </div>
                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                            <div class="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-3">
                                <a href="${item.affiliateUrl || '#'}" target="_blank" class="w-32 bg-primary text-on-primary px-4 py-3 font-button text-[10px] uppercase rounded-full shadow-lg hover:opacity-90 transition-all text-center">Shop Now</a>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

        return `
<nav class="fixed top-0 left-0 w-full z-50 nav-solid">
    <div class="flex justify-between items-center px-4 sm:px-6 md:px-10 lg:px-16 py-4 md:py-5 gap-2 sm:gap-4">
        <!-- Left: Back + Search -->
        <div class="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <button class="nav-icon flex items-center gap-2 hover:opacity-70 transition-opacity" onclick="window.history.length > 1 ? history.back() : Router.navigate('/landing')">
                <span class="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <button class="nav-icon flex items-center gap-2 hover:opacity-70 transition-opacity">
                <span class="material-symbols-outlined text-[20px]">search</span>
                <span class="hidden lg:inline font-label-caps text-[11px] tracking-[0.15em]">Search</span>
            </button>
        </div>
        <!-- Center: Brand -->
        <div class="flex justify-center flex-1 min-w-0">
            <span class="nav-brand font-display-lg tracking-[0.08em] font-bold cursor-pointer text-center" onclick="Router.navigate('/landing')">FASHIONWARDROBE</span>
        </div>
        <!-- Right: Links + Icons -->
        <div class="flex items-center justify-end gap-3 sm:gap-6 flex-shrink-0">
            <div class="hidden md:flex items-center gap-4 lg:gap-6">
                <a class="nav-icon font-label-caps text-[11px] tracking-[0.15em] hover:opacity-70 transition-opacity" href="#/landing">Discover</a>
                <a class="nav-icon font-label-caps text-[11px] tracking-[0.15em] hover:opacity-70 transition-opacity" href="#/saved">Saved</a>
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
<main class="pt-28 md:pt-40 mb-20 md:mb-section-gap px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
    <div class="mb-16">
        <h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">Wishlist</h1>
        <p class="font-body-lg text-secondary max-w-xl">Items you've loved. Add them to your wardrobe when you're ready.</p>
        ${wishlist.length > 0 ? `<p class="font-label-caps text-label-caps text-primary mt-4">${wishlist.length} ITEM${wishlist.length > 1 ? 'S' : ''}</p>` : ''}
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">${cardsHtml}</div>
</main>

<!-- Mobile Bottom Nav -->
<div class="md:hidden fixed bottom-0 left-0 w-full glass-panel z-50 flex justify-around items-center py-4 border-t border-white/20">
    <button class="flex flex-col items-center gap-1" onclick="Router.navigate('/landing')">
        <span class="material-symbols-outlined text-secondary">home</span><span class="font-label-caps text-[10px] text-secondary">HOME</span>
    </button>
    <button class="flex flex-col items-center gap-1" onclick="Router.navigate('/saved')">
        <span class="material-symbols-outlined text-secondary">bookmark</span><span class="font-label-caps text-[10px] text-secondary">SAVED</span>
    </button>
    <button class="flex flex-col items-center gap-1">
        <span class="material-symbols-outlined text-primary" style="font-variation-settings:'FILL' 1;">favorite</span><span class="font-label-caps text-[10px] text-primary">WISHLIST</span>
    </button>
</div>`;
    }

    function init() {
        document.querySelectorAll('.wishlist-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                Store.removeFromWishlist(btn.dataset.id);
                App.showToast('Removed from wishlist');
                Router.navigate('/wishlist'); // re-render
            });
        });
    }

    return { render, init };
})();
