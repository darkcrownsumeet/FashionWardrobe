/* ============================================
   FashionWardrobe — Style Personality (Step 3)
   ============================================ */
const StylePage = (() => {
    function render() {
        const gender = Store.get('gender') || 'female';
        const occasions = Store.get('occasions') || [];
        const occasionKey = occasions.length > 0 ? occasions[0] : 'casual'; // Fallback
        const styles = MockData.getStyles(gender, occasionKey);
        const validStyleKeys = styles.map(s => s.key);
        let saved = Store.get('stylePersonality') || [];
        saved = saved.filter(k => validStyleKeys.includes(k));
        Store.set('stylePersonality', saved);
        const count = saved.length;
        const cardsHtml = styles.map(s => {
            let imgStyle = '';
            if (gender === 'female' && occasionKey === 'casual') {
                if (s.key === 'effortless-chic') {
                    imgStyle = 'transform: scale(1.2) translate(8%, -5%) translateZ(0);';
                }
                if (s.key === 'cozy') {
                    imgStyle = 'object-position: center 0%;';
                }
            }
            if (gender === 'female' && occasionKey === 'formal') {
                if (s.key === 'power-dressing') {
                    imgStyle = 'object-position: center 15%;';
                }
            }
            if (gender === 'female' && occasionKey === 'gym') {
                if (s.key === 'high-intensity') {
                    imgStyle = 'object-position: center 0%;';
                }
                if (s.key === 'athleisure') {
                    imgStyle = 'object-position: center 10%;';
                }
            }
            if (gender === 'female' && occasionKey === 'vacation') {
                if (s.key === 'resort-wear' || s.key === 'euro-summer') {
                    imgStyle = 'transform: scale(1.3) translateY(-10%) translateZ(0);';
                }
            }
            return `
            <button class="group relative overflow-hidden rounded-xl style-card aspect-[4/5] bg-surface-container transition-all duration-500 ${saved.includes(s.key) ? 'active' : ''}" data-style="${s.key}">
                <img style="${imgStyle}" class="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-[.active]:grayscale-0 transition-all duration-700 [transform:translateZ(0)] backface-hidden" src="${s.img}"/>
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                <div class="absolute bottom-6 left-6 text-left z-10">
                    <span class="font-label-caps text-label-caps text-white block mb-2 opacity-80 uppercase">${s.sub}</span>
                    <h3 class="font-headline-md text-headline-md text-white">${s.label}</h3>
                </div>
                <div class="absolute top-4 right-4 bg-white rounded-full p-1.5 opacity-0 group-[.active]:opacity-100 transition-opacity duration-300 shadow-xl z-20 flex items-center justify-center">
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
                <span class="font-label-caps text-primary text-[10px] tracking-[0.15em]">STEP 3 OF 7</span>
            </div>
            <button class="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30 text-primary group" onclick="Router.navigate('/landing')">
                <span class="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform duration-300">close</span>
            </button>
        </div>
    </div>
    <div class="absolute bottom-0 left-0 w-full bg-surface-container-highest h-[3px] overflow-hidden">
        <div class="progress-bar-fill bg-gradient-to-r from-primary to-primary/70 h-full shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-1000 ease-out" style="width: 42.8%;"></div>
    </div>
</header>
<main class="flex-grow px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl mx-auto w-full flex flex-col items-center justify-center min-h-[100dvh] pt-[100px] pb-32 md:pb-40">
    <section class="text-center mb-6 lg:mb-8 w-full mt-auto">
        <h1 class="font-['Playfair_Display'] font-medium text-primary text-[36px] lg:text-[48px] leading-tight tracking-tight mb-2">What matches your <span class="italic font-light">vibe</span>?</h1>
        <p class="font-['Inter'] text-[14px] lg:text-[15px] text-secondary max-w-[500px] mx-auto font-light">Select the aesthetic that resonates with your personal style.</p>
    </section>
    <div class="w-full grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-auto">${cardsHtml}</div>
</main>
<footer class="fixed bottom-0 left-0 w-full z-40 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-0" id="floating-footer">
    <div class="bg-white/70 backdrop-blur-2xl border-t border-surface-container-highest shadow-[0_-10px_40px_rgba(0,0,0,0.05)] py-4 sm:py-6 px-4 sm:px-6 md:px-10 lg:px-16">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <button class="w-full sm:w-auto font-button text-[12px] tracking-[0.15em] text-secondary hover:text-primary transition-colors flex items-center justify-center group" onclick="Router.navigate('/occasion')">
                <span class="material-symbols-outlined text-[16px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span> BACK
            </button>
            <button class="w-full sm:w-auto bg-primary text-on-primary font-button px-12 py-4 uppercase tracking-[0.15em] transition-all duration-500 hover:bg-tertiary-container disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap group flex items-center justify-center" id="continue-btn" ${count > 0 ? '' : 'disabled'}>
                <span id="btn-text">${count > 0 ? `Continue with ${count} style${count > 1 ? 's' : ''}` : 'Continue'}</span>
                <span class="material-symbols-outlined text-[16px] inline-block ml-3 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
        </div>
    </div>
</footer>`;
    }

    function init() {
        const cards = document.querySelectorAll('[data-style]');
        const btn = document.getElementById('continue-btn');
        let selected = new Set(Store.get('stylePersonality') || []);

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const key = card.dataset.style;
                const wasSelected = selected.has(key);
                if (wasSelected) { selected.delete(key); card.classList.remove('active'); }
                else {
                    const prevStyles = Store.get('stylePersonality') || [];
                    selected.add(key);
                    card.classList.add('active');
                    
                    // Only wipe outfit if this is the very first style being selected
                    // (prevent wiping if user goes back just to add a 2nd style)
                    if (prevStyles.length === 0) {
                        Store.set('currentOutfit', { topwear: [], outerwear: [], bottomwear: [], footwear: [], accessories: [] });
                        Store.set('itemColors', {});
                    }
                }
                Store.set('stylePersonality', [...selected]);
                btn.disabled = selected.size === 0;
                document.getElementById('btn-text').innerText = selected.size > 0 ? `Continue with ${selected.size} style${selected.size > 1 ? 's' : ''}` : 'Continue';
            });
        });

        btn?.addEventListener('click', () => { if (selected.size > 0) Router.navigate('/outfit'); });
    }

    return { render, init };
})();
