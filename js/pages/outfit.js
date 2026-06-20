/* ============================================
   FashionWardrobe — Current Outfit (Step 4)
   ============================================ */
const OutfitPage = (() => {
    function _getItemsForGender() {
        const gender = Store.get('gender') || 'female';
        const occasions = Store.get('occasions') || [];
        const occasion = occasions.length > 0 ? occasions[0] : null;
        const styles = Store.get('stylePersonality') || [];
        const all = MockData.getProducts();
        
        return all.filter(p => {
            if (p.gender !== gender) return false;
            if (occasion && !p.occasions.includes(occasion)) return false;
            if (styles.length > 0 && !p.styles.some(s => styles.includes(s))) return false;
            return true;
        });
    }

    function _renderCategory(title, category, items, savedIds) {
        const cardsHtml = items.map(item => {
            const isSelected = savedIds.includes(item.id);
            return `
            <div class="group cursor-pointer outfit-item ${isSelected ? 'selected-outfit' : ''}" data-id="${item.id}" data-category="${category}">
            <div class="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-high animate-pulse mb-4 transition-all duration-500 ${isSelected ? 'ring-2 ring-primary ring-offset-4 ring-offset-background' : ''}">
                    <img loading="lazy" alt="${item.name.replace(/'/g, "&#39;")}" class="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-[.selected-outfit]:grayscale-0 transition-all duration-700 [transform:translateZ(0)] backface-hidden" onload="this.parentElement.classList.remove('animate-pulse', 'bg-surface-container-high')" src="${item.image}" ${item.objectPosition ? `style="object-position: ${item.objectPosition};"` : ''} onerror="this.onerror=null; this.src='https://image.pollinations.ai/prompt/${encodeURIComponent(item.name + ' fashion isolated')}?width=300&height=400&nologo=true';"/>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                    <div class="absolute top-4 right-4 bg-white rounded-full p-1.5 ${isSelected ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 shadow-xl z-20 flex items-center justify-center check-mark">
                        <span class="material-symbols-outlined text-primary text-[24px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                    </div>
                </div>
                <h3 class="font-label-caps text-primary mb-1">${item.name}</h3>
                <p class="text-[10px] font-label-caps text-secondary">${item.description}</p>
            </div>`;
        }).join('');

        return `
        <section>
            <div class="flex justify-between items-end mb-8 border-b border-outline-variant pb-4">
                <h2 class="font-headline-lg text-headline-lg">${title}</h2>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-gutter">${cardsHtml}</div>
        </section>`;
    }

    function render() {
        const items = _getItemsForGender();
        let saved = Store.get('currentOutfit');
        if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
            saved = { topwear: [], outerwear: [], bottomwear: [], footwear: [], accessories: [] };
        }
        
        const safeTopwear = saved.topwear || [];
        const safeOuterwear = saved.outerwear || [];
        const safeBottomwear = saved.bottomwear || [];
        const safeFootwear = saved.footwear || [];
        const safeAccessories = saved.accessories || [];

        // Purge stale items that no longer match current filters
        const validItemIds = items.map(i => i.id);
        saved.topwear = safeTopwear.filter(id => validItemIds.includes(id));
        saved.outerwear = safeOuterwear.filter(id => validItemIds.includes(id));
        saved.bottomwear = safeBottomwear.filter(id => validItemIds.includes(id));
        saved.footwear = safeFootwear.filter(id => validItemIds.includes(id));
        saved.accessories = safeAccessories.filter(id => validItemIds.includes(id));
        Store.set('currentOutfit', saved);
        
        const allSavedIds = [...saved.topwear, ...saved.outerwear, ...saved.bottomwear, ...saved.footwear, ...saved.accessories];

        const topwear = items.filter(i => i.category === 'topwear');
        const outerwear = items.filter(i => i.category === 'outerwear');
        const bottomwear = items.filter(i => i.category === 'bottomwear');
        const footwear = items.filter(i => i.category === 'footwear');
        const accessories = items.filter(i => i.category === 'accessories');

        return `
<header class="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-surface-container-highest px-4 sm:px-6 md:px-10 lg:px-16 py-4">
    <div class="flex justify-between items-center max-w-[1440px] mx-auto w-full gap-4">
        <span class="font-display-lg text-[18px] sm:text-[20px] uppercase tracking-[0.2em] text-primary cursor-pointer transition-opacity hover:opacity-70" onclick="Router.navigate('/landing')">FASHIONWARDROBE</span>
        <div class="flex items-center gap-4 sm:gap-6">
            <div class="hidden sm:flex items-center gap-2 bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/30">
                <span class="font-label-caps text-primary text-[10px] tracking-[0.15em]">STEP 4 OF 7</span>
            </div>
            <button class="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30 text-primary group" onclick="Router.navigate('/landing')">
                <span class="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform duration-300">close</span>
            </button>
        </div>
    </div>
    <div class="absolute bottom-0 left-0 w-full bg-surface-container-highest h-[3px] overflow-hidden">
        <div class="progress-bar-fill bg-gradient-to-r from-primary to-primary/70 h-full shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-1000 ease-out" style="width: 57.1%;"></div>
    </div>
</header>
<main class="flex-grow px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl mx-auto w-full pt-[100px] pb-32 md:pb-40">
    <section class="text-center mb-10 lg:mb-12 w-full">
        <h1 class="font-['Playfair_Display'] font-medium text-primary text-[36px] lg:text-[48px] leading-tight tracking-tight mb-2">Current <span class="italic font-light">Selection</span></h1>
        <p class="font-['Inter'] text-[14px] lg:text-[15px] text-secondary max-w-[500px] mx-auto font-light">Define your base layer. Select the items you are wearing or planning to wear.</p>
    </section>
    <div class="space-y-16 md:space-y-24">
        ${_renderCategory('Topwear', 'topwear', topwear, allSavedIds)}
        ${outerwear.length > 0 ? _renderCategory('Outerwear', 'outerwear', outerwear, allSavedIds) : ''}
        ${_renderCategory('Bottomwear', 'bottomwear', bottomwear, allSavedIds)}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            ${_renderCategory('Footwear', 'footwear', footwear, allSavedIds)}
            ${_renderCategory('Accessories', 'accessories', accessories, allSavedIds)}
        </div>
    </div>
</main>
<footer class="fixed bottom-0 left-0 w-full z-40 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-0" id="floating-footer">
    <div class="bg-white/70 backdrop-blur-2xl border-t border-surface-container-highest shadow-[0_-10px_40px_rgba(0,0,0,0.05)] py-4 sm:py-6 px-4 sm:px-6 md:px-10 lg:px-16">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <button class="w-full sm:w-auto font-button text-[12px] tracking-[0.15em] text-secondary hover:text-primary transition-colors flex items-center justify-center group" onclick="Router.navigate('/style')">
                <span class="material-symbols-outlined text-[16px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span> BACK
            </button>
            <div class="flex items-center gap-6">
                <div class="text-right hidden sm:block">
                    <h4 class="font-label-caps text-primary text-[11px] mb-0 tracking-widest" id="selection-count">${allSavedIds.length} Items Selected</h4>
                </div>
                <button class="w-full sm:w-auto bg-primary text-on-primary font-button px-12 py-4 uppercase tracking-[0.15em] transition-all duration-500 hover:bg-tertiary-container whitespace-nowrap group flex items-center justify-center" id="next-btn">
                    Continue
                    <span class="material-symbols-outlined text-[16px] inline-block ml-3 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            </div>
        </div>
    </div>
</footer>`;
    }

    function init() {
        const items = document.querySelectorAll('.outfit-item');
        const countEl = document.getElementById('selection-count');
        let outfit = Store.get('currentOutfit');
        if (!outfit || typeof outfit !== 'object' || Array.isArray(outfit)) {
            outfit = { topwear: [], outerwear: [], bottomwear: [], footwear: [], accessories: [] };
        }
        
        outfit.topwear = outfit.topwear || [];
        outfit.outerwear = outfit.outerwear || [];
        outfit.bottomwear = outfit.bottomwear || [];
        outfit.footwear = outfit.footwear || [];
        outfit.accessories = outfit.accessories || [];

        items.forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                const cat = item.dataset.category;
                const container = item.querySelector('.relative');
                const idx = outfit[cat].indexOf(id);

                if (idx > -1) {
                    outfit[cat].splice(idx, 1);
                    item.classList.remove('selected-outfit');
                    container.classList.remove('ring-2', 'ring-primary', 'ring-offset-4', 'ring-offset-background');
                    container.querySelector('.check-mark')?.classList.remove('opacity-100');
                    container.querySelector('.check-mark')?.classList.add('opacity-0');
                } else {
                    outfit[cat].push(id);
                    item.classList.add('selected-outfit');
                    container.classList.add('ring-2', 'ring-primary', 'ring-offset-4', 'ring-offset-background');
                    container.querySelector('.check-mark')?.classList.remove('opacity-0');
                    container.querySelector('.check-mark')?.classList.add('opacity-100');
                }

                Store.set('currentOutfit', outfit);
                const total = outfit.topwear.length + outfit.outerwear.length + outfit.bottomwear.length + outfit.footwear.length + outfit.accessories.length;
                if (countEl) countEl.textContent = `${total} Items Selected`;
            });
        });

        document.getElementById('next-btn')?.addEventListener('click', () => {
            const outfit = Store.get('currentOutfit');
            const hasOutfit = outfit && Object.values(outfit).some(arr => arr.length > 0);
            if (!hasOutfit) {
                App.showToast('Please select at least one item');
                return;
            }
            Router.navigate('/color-budget');
        });
    }

    return { render, init };
})();
