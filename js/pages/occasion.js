/* ============================================
   FashionWardrobe — Occasion Selection (Step 2)
   ============================================ */
const OccasionPage = (() => {
    function render() {
        const gender = Store.get('gender') || 'female';
        const occasions = MockData.getOccasions(gender);
        const saved = Store.get('occasions') || [];
                let pagesHtml = '';
        for (let i = 0; i < occasions.length; i += 2) {
            const pair = occasions.slice(i, i + 2);
            const pageIdx = Math.floor(i / 2);
            
            const cardsInPage = pair.map((o, offsetIdx) => {
                const idx = i + offsetIdx;
                const isSelected = saved.includes(o.key);
                const classState = isSelected 
                    ? 'opacity-100 border-brand shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10 active' 
                    : 'opacity-80 border-transparent hover:opacity-100';
                const imgState = isSelected ? 'grayscale-0' : 'grayscale';
                const iconState = isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50';
                
                return `
                <div class="selection-card group relative flex flex-col cursor-pointer transition-all duration-700 ease-[var(--ease-out-expo)] border-[4px] h-full w-full overflow-hidden ${classState}" data-occasion="${o.key}">
                    <!-- Background Image -->
                    <img alt="${o.label}" src="${o.img}" class="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:grayscale-0 group-[.active]:grayscale-0 ${imgState}" style="object-position: center ${o.key === 'gym' ? '80%' : 'center'};">
                    
                    <!-- Gradients -->
                    <div class="absolute top-0 inset-x-0 h-1/4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>
                    <div class="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                    
                    <!-- Top Number -->
                    <div class="absolute top-6 left-6 font-mono text-[10px] text-white tracking-[0.3em] font-bold z-10">0${idx + 1}</div>
                    
                    <!-- Hover Hint -->
                    <div class="absolute top-6 right-6 pointer-events-none z-20">
                        <div class="text-white font-mono text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0 group-[.active]:hidden font-bold drop-shadow-md">SELECT <span class="material-symbols-outlined text-[14px]">arrow_forward</span></div>
                    </div>
                    
                    <!-- Top Right Icon -->
                    <div class="absolute top-6 right-6 z-10 material-symbols-outlined text-brand transform transition-all duration-300 group-[.active]:opacity-100 group-[.active]:scale-100 ${iconState}">check_circle</div>
                    
                    <!-- Bottom Content -->
                    <div class="absolute bottom-0 left-0 w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-1 z-10 transform translate-y-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-[.active]:translate-y-0">
                        <span class="text-xl lg:text-3xl font-extrabold uppercase tracking-tighter text-white">${o.label}</span>
                    </div>
                </div>`;
            }).join('');

            pagesHtml += `
            <div class="page-container absolute inset-0 p-4 lg:p-12 grid grid-cols-2 gap-4 lg:gap-10 transition-all duration-700 ease-[var(--ease-out-expo)]" data-page="${pageIdx}" style="opacity: ${pageIdx === 0 ? '0' : '0'}; transform: translateX(${pageIdx === 0 ? '12px' : '1.5rem'}); pointer-events: ${pageIdx === 0 ? 'auto' : 'none'};">
                ${cardsInPage}
            </div>`;
        }

        return `
<div class="h-screen w-screen bg-background dark:bg-foreground text-foreground dark:text-background flex flex-col selection:bg-brand selection:text-brand-foreground overflow-hidden">
    <!-- Top Nav -->
    <nav class="sticky top-0 z-50 flex items-baseline justify-between border-b border-foreground dark:border-background bg-background dark:bg-foreground px-6 py-4">
        <div class="font-mono text-xs font-bold tracking-tighter cursor-pointer" onclick="window.Router.navigate('/landing')">
            FASHIONWARDROBE<sup class="ml-1 text-brand">®</sup>
        </div>
        <div class="flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest">
            <span class="hidden sm:inline-block border border-foreground dark:border-background px-3 py-1">INDEX 02 / 06</span>
            <button class="transition-colors hover:text-brand flex items-center gap-2" onclick="if(window.Walkthrough) window.Walkthrough.startOccasionTour()" title="Replay Walkthrough">
                <span class="material-symbols-outlined text-[14px]">help</span>
            </button>
            <button class="transition-colors hover:text-brand flex items-center gap-2" onclick="window.Router.navigate('/landing')">
                <span class="material-symbols-outlined text-[14px]">close</span>
            </button>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col lg:flex-row border-b border-foreground dark:border-background h-full overflow-hidden">
        
        <!-- Left Side: Copy -->
        <div class="w-full lg:w-[35%] h-[30%] lg:h-full flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-foreground dark:border-background p-6 lg:p-12 relative overflow-hidden">
            <div class="mt-2 lg:mt-8 z-10">
                <div class="flex items-center gap-3 mb-2 lg:mb-6">
                    <span class="font-mono text-[10px] uppercase tracking-[0.3em] text-brand block">Step 02 / 05</span>
                </div>
                <h1 class="text-3xl lg:text-[clamp(2.5rem,4vw,4.5rem)] font-extrabold uppercase leading-[0.85] tracking-tighter font-sans antialiased mb-2 lg:mb-6">
                    What's the<br>
                    <span class="text-brand">occasion</span>?
                </h1>
                <div class="flex gap-4 items-start mb-12">
                    <div class="w-1 h-full bg-foreground/10 dark:bg-background/10 flex-shrink-0 mt-2"></div>
                    <p class="font-mono text-[10px] lg:text-xs leading-relaxed text-muted max-w-sm uppercase tracking-widest hidden sm:block">
                        Select the primary setting for your next look.
                    </p>
                </div>

                <!-- Prominent Counter -->
                <div class="inline-flex items-center gap-4 px-6 py-4 border-[2px] border-foreground dark:border-background bg-background dark:bg-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] w-fit transition-all duration-300" id="selection-counter-box">
                    <div class="flex items-baseline gap-1">
                        <span class="font-mono text-3xl font-black text-brand" id="selection-counter-num">${saved.length > 0 ? '1' : '0'}</span>
                        <span class="font-mono text-lg font-bold text-foreground dark:text-background">/1</span>
                    </div>
                    <div class="w-px h-8 bg-foreground/20 dark:bg-background/20"></div>
                    <span class="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">SELECTED</span>
                </div>
            </div>
        </div>

        <!-- Right Side: Cards -->
        <div id="lookbook-container" class="w-full lg:w-[65%] h-[70%] lg:h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] overflow-hidden relative">
            <!-- Carousel Arrows -->
            <button id="prev-btn" class="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-background/80 dark:bg-foreground/80 backdrop-blur border border-foreground dark:border-background flex items-center justify-center rounded-full hover:bg-foreground dark:hover:bg-background hover:text-background dark:hover:text-foreground transition-colors disabled:opacity-0 disabled:cursor-not-allowed">
                <span class="material-symbols-outlined text-2xl">chevron_left</span>
            </button>
            <button id="next-btn" class="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-background/80 dark:bg-foreground/80 backdrop-blur border border-foreground dark:border-background flex items-center justify-center rounded-full hover:bg-foreground dark:hover:bg-background hover:text-background dark:hover:text-foreground transition-colors disabled:opacity-0 disabled:cursor-not-allowed">
                <span class="material-symbols-outlined text-2xl">chevron_right</span>
            </button>
            
            ${pagesHtml}
            
            <!-- Carousel Dots -->
            <div id="carousel-dots" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
            </div>
        </div>
    </main>

    <!-- Bottom Bar -->
    <footer class="bg-background dark:bg-foreground flex flex-col md:flex-row items-stretch border-t border-foreground dark:border-background shrink-0 z-50 relative">
        <div class="flex-1 p-6 flex items-center justify-between md:justify-start gap-12 border-b md:border-b-0 md:border-r border-foreground dark:border-background">
            <button class="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50 dark:text-background/50 hover:text-foreground dark:hover:text-background transition-colors flex items-center group" onclick="window.Router.navigate('/gender')">
                <span class="material-symbols-outlined text-[14px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span> BACK
            </button>
        </div>
        <button id="next-btn-main" class="flex-1 bg-brand text-brand-foreground font-mono text-xs uppercase tracking-widest p-6 transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed group flex items-center justify-center gap-4" ${saved.length > 0 ? '' : 'disabled'}>
            Continue to Curation
            <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
    </footer>
</div>
        `;
    }

    function init() {
        setTimeout(() => {
            if (!localStorage.getItem('fw_has_seen_occasion_tour')) {
                localStorage.setItem('fw_has_seen_occasion_tour', 'true');
                if (window.Walkthrough) window.Walkthrough.startOccasionTour();
            }
        }, 500);

        const cards = document.querySelectorAll('.selection-card');
        const pages = document.querySelectorAll('.page-container');
        const btn = document.getElementById('next-btn-main');
        const container = document.getElementById('lookbook-container');
        const dotsContainer = document.getElementById('carousel-dots');
        
        let selected = new Set(Store.get('occasions') || []);
        let currentPage = 0;
        const totalPages = pages.length;
        let isAnimating = false;

        const prevBtn = document.getElementById('prev-btn');
        const nxtBtn = document.getElementById('next-btn');
        
        // Generate Dots
        dotsContainer.innerHTML = Array.from({length: totalPages}).map((_, i) => 
            `<div class="w-2 h-2 rounded-full border border-foreground dark:border-background transition-colors ${i === 0 ? 'bg-foreground dark:bg-background' : 'bg-transparent'}"></div>`
        ).join('');
        const dots = dotsContainer.querySelectorAll('div');

        function updatePageState() {
            // Update dots
            dots.forEach((d, i) => {
                d.className = `w-2 h-2 rounded-full border border-foreground dark:border-background transition-colors ${i === currentPage ? 'bg-foreground dark:bg-background' : 'bg-transparent'}`;
            });
            
            prevBtn.disabled = currentPage === 0;
            nxtBtn.disabled = currentPage === totalPages - 1;
            
            pages.forEach((page, idx) => {
                if (idx === currentPage) {
                    page.style.opacity = '1';
                    page.style.transform = 'translateX(0)';
                    page.style.pointerEvents = 'auto';
                } else if (idx < currentPage) {
                    page.style.opacity = '0';
                    page.style.transform = 'translateX(-1.5rem)';
                    page.style.pointerEvents = 'none';
                } else {
                    page.style.opacity = '0';
                    page.style.transform = 'translateX(1.5rem)';
                    page.style.pointerEvents = 'none';
                }
            });
        }

        function nextPage() {
            if (isAnimating || currentPage >= totalPages - 1) return;
            isAnimating = true;
            currentPage++;
            updatePageState();
            setTimeout(() => isAnimating = false, 700);
        }

        function prevPage() {
            if (isAnimating || currentPage <= 0) return;
            isAnimating = true;
            currentPage--;
            updatePageState();
            setTimeout(() => isAnimating = false, 700);
        }

        prevBtn.addEventListener('click', prevPage);
        nxtBtn.addEventListener('click', nextPage);

        // Initialize state
        updatePageState();
        // Initial entrance animation fix since opacity is managed by updatePageState
        setTimeout(() => {
            cards.forEach((c, i) => {
                const cardPage = Math.floor(i / 2);
                if (cardPage === currentPage) {
                    c.style.transform = 'translateX(12px)';
                    c.style.opacity = '0';
                    setTimeout(() => {
                        c.style.transform = 'translateX(0)';
                        c.style.opacity = selected.has(c.dataset.occasion) ? '1' : '0.8';
                    }, i * 100);
                }
            });
        }, 50);

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const key = card.dataset.occasion;

                // Toggle logic
                if (selected.has(key)) {
                    selected.clear();
                } else {
                    const prevOccasion = Store.get('occasions')?.[0];
                    selected.clear();
                    selected.add(key);

                    // If occasion changed, wipe downstream state
                    if (key !== prevOccasion && prevOccasion !== undefined) {
                        Store.set('stylePersonality', []);
                        Store.set('currentOutfit', { topwear: [], outerwear: [], bottomwear: [], footwear: [], accessories: [] });
                        Store.set('itemColors', {});
                    }
                }

                Store.set('occasions', [...selected]);
                btn.disabled = selected.size === 0;
                const counterNum = document.getElementById('selection-counter-num');
                if (counterNum) counterNum.innerText = selected.size > 0 ? '1' : '0';

                cards.forEach(c => {
                    const isSelected = selected.has(c.dataset.occasion);
                    if (isSelected) {
                        c.className = 'selection-card group relative flex flex-col cursor-pointer transition-all duration-700 ease-[var(--ease-out-expo)] border-[4px] h-full w-full overflow-hidden active opacity-100 border-brand shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10';
                        const icon = c.querySelector('.material-symbols-outlined.text-brand');
                        if (icon) {
                            icon.classList.remove('opacity-0', 'scale-50');
                            icon.classList.add('opacity-100', 'scale-100');
                        }
                    } else {
                        c.className = 'selection-card group relative flex flex-col cursor-pointer transition-all duration-700 ease-[var(--ease-out-expo)] border-[4px] h-full w-full overflow-hidden opacity-80 border-transparent hover:opacity-100';
                        const icon = c.querySelector('.material-symbols-outlined.text-brand');
                        if (icon) {
                            icon.classList.remove('opacity-100', 'scale-100');
                            icon.classList.add('opacity-0', 'scale-50');
                        }
                    }
                });
            });
        });

        btn?.addEventListener('click', () => {
            if (!btn.disabled) {
                window.Router.navigate('/style');
            }
        });
    }

    return { render, init };
})();
