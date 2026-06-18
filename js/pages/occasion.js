/* ============================================
   FashionWardrobe — Occasion Selection (Step 2)
   ============================================ */
const OccasionPage = (() => {
    function render() {
        const gender = Store.get('gender') || 'unisex';
        const occasions = MockData.getOccasions(gender);
        const saved = Store.get('occasions') || [];
        const cardsHtml = occasions.map(o => {
            let objPos = 'center';
            if (gender === 'female') {
                if (['college', 'wedding', 'formal'].includes(o.key)) objPos = 'center 25%';
                if (o.key === 'gym') objPos = 'center 80%';
            }
            return `
            <button class="group relative overflow-hidden rounded-xl aspect-[4/5] bg-surface-container transition-all duration-500 w-full text-left cursor-pointer ${saved.includes(o.key) ? 'selected-card' : ''}" data-occasion="${o.key}">
                <img alt="${o.label}" style="object-position: ${objPos};" class="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-[.selected-card]:grayscale-0 transition-all duration-700 [transform:translateZ(0)] backface-hidden" src="${o.img}"/>
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                <div class="absolute bottom-6 left-6 z-10">
                    <h3 class="font-headline-md text-headline-md text-white">${o.label}</h3>
                </div>
                <div class="absolute top-4 right-4 bg-white rounded-full p-1.5 opacity-0 group-[.selected-card]:opacity-100 transition-opacity duration-300 shadow-xl z-20 flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary text-[24px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                </div>
            </button>
        `}).join('');

        return `
<header class="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-surface-container-highest px-4 sm:px-6 md:px-10 lg:px-16 py-4">
    <div class="flex justify-between items-center max-w-[1440px] mx-auto w-full gap-4">
        <span class="font-display-lg text-[18px] sm:text-[20px] uppercase tracking-[0.2em] text-primary cursor-pointer transition-opacity hover:opacity-70" onclick="Router.navigate('/landing')">FASHIONWARDROBE</span>
        <div class="flex items-center gap-4 sm:gap-6">
            <div class="hidden sm:flex items-center gap-2 bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/30">
                <span class="font-label-caps text-primary text-[10px] tracking-[0.15em]">STEP 2 OF 7</span>
            </div>
            <button class="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30 text-primary group" onclick="Router.navigate('/landing')">
                <span class="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform duration-300">close</span>
            </button>
        </div>
    </div>
    <div class="absolute bottom-0 left-0 w-full bg-surface-container-highest h-[3px] overflow-hidden">
        <div class="progress-bar-fill bg-gradient-to-r from-primary to-primary/70 h-full shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-1000 ease-out" style="width: 28.5%;"></div>
    </div>
</header>
<main class="flex-grow px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl mx-auto w-full flex flex-col items-center justify-center min-h-[100dvh] pt-[100px] pb-32 md:pb-40">
    <section class="text-center mb-6 lg:mb-8 w-full mt-auto">
        <h1 class="font-['Playfair_Display'] font-medium text-primary text-[36px] lg:text-[48px] leading-tight tracking-tight mb-2">What's the <span class="italic font-light">occasion</span>?</h1>
        <p class="font-['Inter'] text-[14px] lg:text-[15px] text-secondary max-w-[500px] mx-auto font-light">Select the primary setting for your next look.</p>
    </section>
    <div class="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-auto">${cardsHtml}</div>
</main>
<footer class="fixed bottom-0 left-0 w-full z-40 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-0" id="floating-footer">
    <div class="bg-white/70 backdrop-blur-2xl border-t border-surface-container-highest shadow-[0_-10px_40px_rgba(0,0,0,0.05)] py-4 sm:py-6 px-4 sm:px-6 md:px-10 lg:px-16">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <button class="w-full sm:w-auto font-button text-[12px] tracking-[0.15em] text-secondary hover:text-primary transition-colors flex items-center justify-center group" onclick="Router.navigate('/gender')">
                <span class="material-symbols-outlined text-[16px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span> BACK
            </button>
            <button class="w-full sm:w-auto bg-primary text-on-primary font-button px-12 py-4 uppercase tracking-[0.15em] transition-all duration-500 hover:bg-tertiary-container disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap group flex items-center justify-center" id="next-btn" ${saved.length > 0 ? '' : 'disabled'}>
                Continue
                <span class="material-symbols-outlined text-[16px] inline-block ml-3 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
        </div>
    </div>
</footer>`;
    }

    function init() {
        const cards = document.querySelectorAll('[data-occasion]');
        const btn = document.getElementById('next-btn');
        let selected = new Set(Store.get('occasions') || []);

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const key = card.dataset.occasion;

                // If clicking the already selected card, deselect it
                if (selected.has(key)) {
                    selected.clear();
                    card.classList.remove('selected-card');
                } else {
                    const prevOccasion = Store.get('occasions')?.[0];

                    // Clear previous selection
                    selected.clear();
                    cards.forEach(c => c.classList.remove('selected-card'));

                    // Select new card
                    selected.add(key);
                    card.classList.add('selected-card');

                    // If occasion changed, wipe downstream state so stale items never appear
                    if (key !== prevOccasion) {
                        Store.set('stylePersonality', []);
                        const oldOutfit = Store.get('currentOutfit');
                        const hadOutfit = oldOutfit && Object.values(oldOutfit).some(arr => arr.length > 0);
                        Store.set('currentOutfit', { topwear: [], outerwear: [], bottomwear: [], footwear: [], accessories: [] });
                        Store.set('itemColors', {});
                        if (hadOutfit) App.showToast('Outfit selection reset for new occasion.');
                    }
                }

                Store.set('occasions', [...selected]);
                btn.disabled = selected.size === 0;

                // micro-interaction
                if (card.classList.contains('selected-card')) {
                    card.style.transform = 'scale(0.98)';
                    setTimeout(() => { card.style.transform = ''; }, 100);
                }
            });
        });

        btn?.addEventListener('click', () => { if (selected.size > 0) Router.navigate('/style'); });

        // Reveal animation
        cards.forEach((card, i) => {
            card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
            setTimeout(() => { card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 80 * i);
        });
    }

    return { render, init };
})();
