/* ============================================
   FashionWardrobe — Gender Selection (Step 1)
   Ported from: step_1_gender_selection_fashionwardrobe_refined/code.html
   ============================================ */

const GenderPage = (() => {
    function render() {
        const saved = Store.get('gender');
        return `
<header class="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-surface-container-highest px-4 sm:px-6 md:px-10 lg:px-16 py-4">
    <div class="flex justify-between items-center max-w-[1440px] mx-auto w-full gap-4">
        <span class="font-display-lg text-[18px] sm:text-[20px] uppercase tracking-[0.2em] text-primary cursor-pointer transition-opacity hover:opacity-70" onclick="Router.navigate('/landing')">FASHIONWARDROBE</span>
        <div class="flex items-center gap-4 sm:gap-6">
            <div class="hidden sm:flex items-center gap-2 bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/30">
                <span class="font-label-caps text-primary text-[10px] tracking-[0.15em]">STEP 1 OF 7</span>
            </div>
            <button class="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30 text-primary group" onclick="Router.navigate('/landing')">
                <span class="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform duration-300">close</span>
            </button>
        </div>
    </div>
    <div class="absolute bottom-0 left-0 w-full bg-surface-container-highest h-[3px] overflow-hidden">
        <div class="progress-bar-fill bg-gradient-to-r from-primary to-primary/70 h-full shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-1000 ease-out" style="width: 14.28%;"></div>
    </div>
</header>

<main class="flex-grow px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl mx-auto w-full flex flex-col items-center justify-center min-h-[100dvh] pt-[100px] pb-32 md:pb-40">
    <section class="text-center mb-6 lg:mb-8 w-full mt-auto">
        <h1 class="font-['Playfair_Display'] font-medium text-primary text-[36px] lg:text-[48px] leading-tight tracking-tight mb-2">Who are we <span class="italic font-light">dressing</span> today?</h1>
        <p class="font-['Inter'] text-[14px] lg:text-[15px] text-secondary max-w-[500px] mx-auto font-light">Choose a style profile to begin your curated journey.</p>
    </section>

    <section class="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-auto">
        <!-- Male Card -->
        <div class="selection-card ${saved === 'male' ? 'active' : ''} relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)]" data-gender="male">
            <img alt="Male Style Profile" class="w-full h-full object-cover transition-transform duration-1000 [transform:translateZ(0)] backface-hidden" src="assets/img/Male.jpg"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
            <div class="absolute bottom-0 left-0 w-full p-8 flex flex-col items-start z-10">
                <span class="font-label-caps text-white/80 mb-2 tracking-[0.2em] text-[10px]">THE ARCHITECT</span>
                <h2 class="font-headline-md text-white text-[28px] uppercase tracking-wide">Male</h2>
            </div>
            <div class="absolute top-6 right-6 bg-white rounded-full p-1.5 opacity-0 group-[.active]:opacity-100 transition-opacity duration-300 shadow-xl z-20 flex items-center justify-center">
                <span class="material-symbols-outlined text-primary text-[24px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            </div>
        </div>

        <!-- Female Card -->
        <div class="selection-card ${saved === 'female' ? 'active' : ''} relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)]" data-gender="female">
            <img alt="Female Style Profile" class="w-full h-full object-cover transition-transform duration-1000 [transform:translateZ(0)] backface-hidden" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6AeAfPmiYI7qgmuzazGygBMTBoLm-ecAL3xJKeh2xfnzQ_q63_BHtF5n6ZR61neCEPHGyRCyO8gwbz8dKQOLgim20FlvEhiZgz_BdZWOGLbQtZ6JlAnP3enHCODTICvwC1equ2CudB7_SJpgngHCTbAvn938HZEBXiq10NA8rHBLx4b1Loigg-w96iKQUXINRXgmvMk_Wk6mHPOpLJ7rTcP5m6gPEeXsdpCnyBd_wjj7g9pGyGi2pGCxlD8PzCtknjQW-S8ip1A"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
            <div class="absolute bottom-0 left-0 w-full p-8 flex flex-col items-start z-10">
                <span class="font-label-caps text-white/80 mb-2 tracking-[0.2em] text-[10px]">THE VISIONARY</span>
                <h2 class="font-headline-md text-white text-[28px] uppercase tracking-wide">Female</h2>
            </div>
            <div class="absolute top-6 right-6 bg-white rounded-full p-1.5 opacity-0 group-[.active]:opacity-100 transition-opacity duration-300 shadow-xl z-20 flex items-center justify-center">
                <span class="material-symbols-outlined text-primary text-[24px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            </div>
        </div>
    </section>

</main>
<footer class="fixed bottom-0 left-0 w-full z-40 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-0" id="floating-footer">
    <div class="bg-white/70 backdrop-blur-2xl border-t border-surface-container-highest shadow-[0_-10px_40px_rgba(0,0,0,0.05)] py-4 sm:py-6 px-4 sm:px-6 md:px-10 lg:px-16">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div class="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span class="font-label-caps text-[10px] sm:text-[11px] text-primary tracking-widest uppercase flex items-center gap-1.5 mb-1">
                    <span class="material-symbols-outlined text-[14px]">diamond</span> Bespoke Styling
                </span>
                <p class="font-body-sm text-[10px] text-secondary uppercase tracking-[0.1em]">Curating pieces that define your signature look</p>
            </div>
            <button class="w-full sm:w-auto bg-primary text-on-primary font-button px-12 py-4 uppercase tracking-[0.15em] transition-all duration-500 hover:bg-tertiary-container disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap group flex items-center justify-center" id="continue-btn" ${saved ? '' : 'disabled'}>
                Continue to Match
                <span class="material-symbols-outlined text-[16px] inline-block ml-3 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
        </div>
    </div>
</footer>
        `;
    }

    function init() {
        const cards = document.querySelectorAll('.selection-card');
        const btn = document.getElementById('continue-btn');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const gender = card.dataset.gender;
                const prevGender = Store.get('gender');

                if (gender !== prevGender) {
                    Store.set('currentOutfit', { topwear: [], outerwear: [], bottomwear: [], footwear: [], accessories: [] });
                }

                Store.set('gender', gender);

                // Clear previous
                cards.forEach(c => {
                    c.classList.remove('active');
                });

                // Set active
                card.classList.add('active');

                // Enable button
                btn.disabled = false;

                // Feedback
                card.style.transform = 'scale(0.97)';
                setTimeout(() => { card.style.transform = ''; }, 150);
            });
        });

        btn?.addEventListener('click', () => {
            if (Store.get('gender')) {
                Router.navigate('/occasion');
            }
        });
    }

    return { render, init };
})();
