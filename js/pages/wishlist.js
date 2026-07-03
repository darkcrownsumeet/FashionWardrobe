/* ============================================
   FashionWardrobe — Wishlist Page
   ============================================ */
const WishlistPage = (() => {
    function render() {
        const wishlist = Store.getWishlist();

        const cardsHtml = wishlist.length === 0
            ? `<div class="col-span-full bg-background dark:bg-foreground py-16 flex flex-col items-center justify-center text-center animate-[reveal_0.8s_var(--ease-out-expo)_both] border-t border-foreground/10 dark:border-background/10 mt-8 w-full">
                    <span class="material-symbols-outlined text-6xl text-muted mb-6">favorite_border</span>
                    <h2 class="text-2xl lg:text-4xl font-extrabold uppercase tracking-tighter mb-4">WISHLIST IS EMPTY</h2>
                    <p class="font-mono text-xs text-muted mb-8 max-w-md">You haven't saved any items yet. Browse curated looks and tap the heart icon to save them here.</p>
                    <button onclick="window.Router.navigate('/landing')" class="group flex items-center gap-3 bg-brand px-6 py-3 font-mono text-xs uppercase tracking-tighter text-brand-foreground transition-opacity hover:opacity-90 mx-auto">
                        Explore Collections <span class="transition-transform group-hover:translate-x-1">→</span>
                    </button>
                </div>`
            : wishlist.map((item, index) => `
            <div class="archive-card group flex flex-col bg-background dark:bg-foreground p-6 transition-colors hover:bg-secondary relative border-r border-b border-foreground dark:border-background" id="wishlist-card-${item.id}">
                <div class="mb-6 flex items-center justify-between font-mono text-xs">
                    <span class="font-bold">0${(index + 1).toString()}</span>
                    <div class="flex items-center gap-3">
                        <button class="wishlist-remove-btn text-red-500 opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1 hover:text-red-700" data-id="${item.id}" title="Remove">
                            <span class="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                    </div>
                </div>
                <div class="mb-6 aspect-[3/4] w-full overflow-hidden bg-[var(--neutral-100)] relative border-[2px] border-transparent group-hover:border-brand transition-colors duration-500 cursor-pointer" onclick="window.open('${item.affiliateUrl || '#'}', '_blank', 'noopener,noreferrer')" title="Shop Now">
                    <img src="${item.image}" alt="${item.name.replace(/'/g, "&#39;")}" loading="lazy" class="h-full w-full object-cover grayscale transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:grayscale-0">
                    <div class="absolute inset-0 bg-brand/0 group-hover:bg-brand/20 transition-colors flex items-center justify-center">
                        <span class="bg-background dark:bg-foreground text-foreground dark:text-background font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-foreground dark:border-background opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 shadow-lg">Shop Now</span>
                    </div>
                </div>
                <h3 class="text-xl font-extrabold uppercase tracking-tighter transition-colors group-hover:text-brand cursor-pointer" onclick="window.open('${item.affiliateUrl || '#'}', '_blank', 'noopener,noreferrer')">${item.name}</h3>
                <p class="mt-2 font-mono text-[10px] uppercase text-brand mb-4 font-bold">${item.category || 'FASHION'}</p>
                <div class="flex flex-wrap gap-2 mt-auto border-t border-foreground/10 dark:border-background/10 pt-4 items-center justify-between">
                    <span class="font-mono text-[10px] uppercase tracking-widest text-muted font-bold">EST. PRICE</span>
                    <span class="font-mono text-sm font-bold text-foreground dark:text-background">$${item.price || 0}</span>
                </div>
            </div>
            `).join('');

        return `
<div class="min-h-screen bg-background dark:bg-foreground text-foreground dark:text-background selection:bg-brand selection:text-brand-foreground">
    <!-- Top Nav -->
    <nav class="sticky top-0 z-50 flex items-baseline justify-between border-b border-foreground dark:border-background bg-background dark:bg-foreground px-6 py-4">
        <div class="font-mono text-xs font-bold tracking-tighter cursor-pointer" onclick="window.Router.navigate('/landing')">
            FASHIONWARDROBE<sup class="ml-1 text-brand">®</sup>
        </div>
        <div class="flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest">
            <span class="hidden sm:inline-block border border-foreground dark:border-background px-3 py-1">WISHLIST</span>
            <button class="transition-colors hover:text-brand flex items-center gap-2" onclick="window.Router.navigate('/saved')" title="Archive">
                <span class="material-symbols-outlined text-[14px]">bookmark</span>
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
                    ITEMS YOU'VE LOVED
                </p>
                <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase leading-[0.85] tracking-tighter font-sans antialiased">
                    CURATED<br><span class="text-brand">WISHLIST</span>.
                </h1>
            </div>
            <div class="flex flex-col items-end gap-4">
                <span class="font-mono text-[10px] uppercase tracking-widest text-muted">${wishlist.length} ITEM${wishlist.length === 1 ? '' : 'S'} SAVED</span>
            </div>
        </div>

        <div class="flex-grow ${wishlist.length > 0 ? 'grid grid-cols-1 gap-0 border-t border-l border-foreground dark:border-background bg-background dark:bg-foreground md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 content-start' : 'w-full'} animate-[reveal_0.8s_var(--ease-out-expo)_both] [animation-delay:150ms]">
            ${cardsHtml}
        </div>
    </main>

    <!-- Footer matching landing -->
    <footer class="px-6 py-12 border-t border-foreground dark:border-background mt-auto">
        <div class="grid grid-cols-2 gap-12 lg:grid-cols-4 max-w-[1440px] mx-auto">
            <div class="col-span-2">
                <div class="mb-8 text-3xl font-extrabold tracking-tighter sm:text-4xl">FASHIONWARDROBE<span class="text-brand">.</span></div>
                <p class="max-w-xs font-mono text-xs uppercase leading-relaxed text-muted">© FASHIONWARDROBE. DESIGNED FOR YOU.</p>
            </div>
        </div>
    </footer>
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

