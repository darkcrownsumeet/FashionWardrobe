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
        if (items.length === 0) return '';
        
        let pagesHtml = '';
        for (let i = 0; i < items.length; i += 2) {
            const pair = items.slice(i, i + 2);
            const pageIdx = Math.floor(i / 2);
            
            const cardsInPage = pair.map((item, offsetIdx) => {
                const idx = i + offsetIdx;
                const isSelected = savedIds.includes(item.id);
                const classState = isSelected 
                    ? 'opacity-100 border-brand shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10 active' 
                    : 'opacity-80 border-transparent hover:opacity-100';
                const imgState = isSelected ? 'grayscale-0' : 'grayscale';
                const iconState = isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50';
                
                return `
                <div class="selection-card group relative flex flex-col cursor-pointer transition-all duration-700 ease-[var(--ease-out-expo)] border-[4px] h-full w-full overflow-hidden ${classState}" data-id="${item.id}" data-category="${category}">
                    <!-- Background Image -->
                    <img loading="lazy" alt="${item.name.replace(/'/g, "&#39;")}" src="${item.image}" class="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:grayscale-0 group-[.active]:grayscale-0 ${imgState}" ${item.objectPosition ? `style="object-position: ${item.objectPosition};"` : ''} onerror="this.onerror=null; this.src='https://image.pollinations.ai/prompt/${encodeURIComponent(item.name + ' fashion isolated')}?width=300&height=400&nologo=true';"/>
                    
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
                    <div class="absolute top-6 right-6 z-10 material-symbols-outlined text-brand transform transition-all duration-300 group-[.active]:opacity-100 group-[.active]:scale-100 check-mark ${iconState}">check_circle</div>
                    
                    <!-- Bottom Content -->
                    <div class="absolute bottom-0 left-0 w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-1 z-10 transform translate-y-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-[.active]:translate-y-0">
                        <span class="text-xl lg:text-3xl font-extrabold uppercase tracking-tighter text-white">${item.name}</span>
                    </div>
                </div>`;
            }).join('');

            pagesHtml += `
            <div class="page-container absolute inset-0 p-4 lg:p-12 grid grid-cols-2 gap-4 lg:gap-10 transition-all duration-700 ease-[var(--ease-out-expo)]" data-page="${pageIdx}" style="opacity: ${pageIdx === 0 ? '1' : '0'}; transform: translateX(${pageIdx === 0 ? '0' : '1.5rem'}); pointer-events: ${pageIdx === 0 ? 'auto' : 'none'};">
                ${cardsInPage}
            </div>`;
        }

        const totalPages = Math.ceil(items.length / 2);
        let dotsHtml = '';
        if (totalPages > 1) {
            dotsHtml = Array.from({length: totalPages}).map((_, i) => 
                `<div class="w-2 h-2 rounded-full border border-foreground transition-colors ${i === 0 ? 'bg-foreground' : 'bg-transparent'}"></div>`
            ).join('');
        }

        return `
        <div class="category-section hidden h-full w-full relative" id="cat-${category}" data-total-pages="${totalPages}">
            ${pagesHtml}
            <div class="carousel-dots absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
                ${dotsHtml}
            </div>
        </div>`;
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

        const buildLink = (cat, title) => `
            <button class="whitespace-nowrap px-6 py-4 font-mono text-xs uppercase tracking-widest border-b-[2px] transition-all duration-300 cat-link ${cat === 'topwear' ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-foreground'}" data-target="cat-${cat}">
                ${title}
            </button>
        `;

        return `
<div class="h-screen w-screen bg-background text-foreground flex flex-col selection:bg-brand selection:text-brand-foreground overflow-hidden">
    <!-- Top Nav -->
    <nav class="sticky top-0 z-50 flex items-baseline justify-between border-b border-foreground bg-background px-6 py-4">
        <div class="font-mono text-xs font-bold tracking-tighter cursor-pointer" onclick="window.Router.navigate('/landing')">
            FASHIONWARDROBE<sup class="ml-1 text-brand">®</sup>
        </div>
        <div class="flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest">
            <span class="hidden sm:inline-block border border-foreground px-3 py-1">INDEX 04 / 06</span>
            <button class="transition-colors hover:text-brand flex items-center gap-2" onclick="window.Router.navigate('/landing')">
                <span class="material-symbols-outlined text-[14px]">close</span>
            </button>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col lg:flex-row border-b border-foreground h-full overflow-hidden">
        
        <!-- Left Side: Copy -->
        <div class="w-full lg:w-[35%] h-[30%] lg:h-full flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-foreground p-6 lg:p-12 relative overflow-hidden">
            <div class="mt-2 lg:mt-8 z-10">
                <span class="font-mono text-[10px] uppercase tracking-[0.3em] text-brand mb-2 lg:mb-6 block">Step 04 / 07</span>
                <h1 class="text-3xl lg:text-[clamp(2.5rem,4vw,4.5rem)] font-extrabold uppercase leading-[0.85] tracking-tighter font-sans antialiased mb-2 lg:mb-6">
                    Base<br>
                    <span class="text-brand">Layer</span>
                </h1>
                <div class="flex gap-4 items-start mb-12">
                    <div class="w-1 h-full bg-foreground/10 flex-shrink-0 mt-2"></div>
                    <p class="font-mono text-[10px] lg:text-xs leading-relaxed text-muted max-w-sm uppercase tracking-widest hidden sm:block">
                        Select the pieces you are wearing.
                    </p>
                </div>

                <!-- Category Counters (Receipt Style) -->
                <div class="flex flex-col border-[2px] border-foreground bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] w-full max-w-[280px] transition-all duration-300" id="category-counters">
                    <!-- Header -->
                    <div class="px-5 py-3 border-b-[2px] border-foreground bg-foreground/5 flex justify-between items-center">
                        <span class="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">OUTFIT SUMMARY</span>
                        <span class="material-symbols-outlined text-[14px] text-foreground/50">receipt_long</span>
                    </div>
                    <!-- Rows -->
                    <div class="flex flex-col">
                        ${['Topwear', 'Outerwear', 'Bottomwear', 'Footwear', 'Accessories'].map((cat, index) => {
                            const key = cat.toLowerCase();
                            const count = saved[key]?.length || 0;
                            const isLast = index === 4;
                            return `
                            <div class="flex items-center justify-between gap-8 px-5 py-3 ${!isLast ? 'border-b border-foreground/20' : ''} transition-colors hover:bg-foreground/5">
                                <span class="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/70">${cat}</span>
                                <span class="font-mono text-lg font-black ${count > 0 ? 'text-brand' : 'text-foreground/30'}" id="counter-${key}">${count}</span>
                            </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side: Items -->
        <div class="w-full lg:w-[65%] h-[70%] lg:h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] flex flex-col relative" id="lookbook-container">
            <!-- Sticky Category Tabs -->
            <div class="z-40 bg-background/90 backdrop-blur-md border-b border-foreground/20 flex overflow-x-auto no-scrollbar shrink-0">
                ${topwear.length > 0 ? buildLink('topwear', 'Topwear') : ''}
                ${outerwear.length > 0 ? buildLink('outerwear', 'Outerwear') : ''}
                ${bottomwear.length > 0 ? buildLink('bottomwear', 'Bottomwear') : ''}
                ${footwear.length > 0 ? buildLink('footwear', 'Footwear') : ''}
                ${accessories.length > 0 ? buildLink('accessories', 'Accessories') : ''}
            </div>
            
            <!-- Carousels Container -->
            <div class="flex-grow relative overflow-hidden">
                <!-- Carousel Arrows -->
                <button id="prev-btn-carousel" class="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-background/80 backdrop-blur border border-foreground flex items-center justify-center rounded-full hover:bg-foreground hover:text-background transition-colors disabled:opacity-0 disabled:cursor-not-allowed hidden">
                    <span class="material-symbols-outlined text-2xl">chevron_left</span>
                </button>
                <button id="next-btn-carousel" class="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-background/80 backdrop-blur border border-foreground flex items-center justify-center rounded-full hover:bg-foreground hover:text-background transition-colors disabled:opacity-0 disabled:cursor-not-allowed hidden">
                    <span class="material-symbols-outlined text-2xl">chevron_right</span>
                </button>

                ${_renderCategory('Topwear', 'topwear', topwear, allSavedIds)}
                ${_renderCategory('Outerwear', 'outerwear', outerwear, allSavedIds)}
                ${_renderCategory('Bottomwear', 'bottomwear', bottomwear, allSavedIds)}
                ${_renderCategory('Footwear', 'footwear', footwear, allSavedIds)}
                ${_renderCategory('Accessories', 'accessories', accessories, allSavedIds)}
            </div>
        </div>
    </main>

    <!-- Bottom Bar -->
    <footer class="bg-background flex flex-col md:flex-row items-stretch border-t border-foreground shrink-0 z-50 relative">
        <div class="flex-1 p-6 flex items-center justify-between md:justify-start gap-12 border-b md:border-b-0 md:border-r border-foreground">
            <button class="font-mono text-[10px] uppercase tracking-[0.3em] text-muted hover:text-foreground transition-colors flex items-center group" onclick="window.Router.navigate('/style')">
                <span class="material-symbols-outlined text-[14px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span> BACK
            </button>
        </div>
        <button id="next-btn-main" class="flex-1 bg-brand text-brand-foreground font-mono text-xs uppercase tracking-widest p-6 transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed group flex items-center justify-center gap-4" ${allSavedIds.length > 0 ? '' : 'disabled'}>
            Continue to Colors
            <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
    </footer>
</div>
<style>
    .category-section.active-section {
        display: block !important;
        animation: fadeIn 0.4s ease-out forwards;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
</style>`;
    }

    function init() {
        // Carousel states per category
        const catSections = document.querySelectorAll('.category-section');
        let activeCatId = null;
        let catStates = {};
        
        catSections.forEach(sec => {
            catStates[sec.id] = {
                currentPage: 0,
                totalPages: parseInt(sec.dataset.totalPages || '1'),
                pages: sec.querySelectorAll('.page-container'),
                dots: sec.querySelectorAll('.carousel-dots div')
            };
        });

        const prevBtnCar = document.getElementById('prev-btn-carousel');
        const nxtBtnCar = document.getElementById('next-btn-carousel');
        let isAnimating = false;

        function updateCarouselUI() {
            if (!activeCatId) return;
            const state = catStates[activeCatId];
            
            if (state.totalPages > 1) {
                state.dots.forEach((d, i) => {
                    d.className = `w-2 h-2 rounded-full border border-foreground transition-colors ${i === state.currentPage ? 'bg-foreground' : 'bg-transparent'}`;
                });
                prevBtnCar.style.display = 'flex';
                nxtBtnCar.style.display = 'flex';
                prevBtnCar.disabled = state.currentPage === 0;
                nxtBtnCar.disabled = state.currentPage === state.totalPages - 1;
            } else {
                prevBtnCar.style.display = 'none';
                nxtBtnCar.style.display = 'none';
            }

            state.pages.forEach((page, idx) => {
                if (idx === state.currentPage) {
                    page.style.opacity = '1';
                    page.style.transform = 'translateX(0)';
                    page.style.pointerEvents = 'auto';
                } else if (idx < state.currentPage) {
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

        if(prevBtnCar) {
            prevBtnCar.addEventListener('click', () => {
                if (!activeCatId || isAnimating) return;
                const state = catStates[activeCatId];
                if (state.currentPage > 0) {
                    isAnimating = true;
                    state.currentPage--;
                    updateCarouselUI();
                    setTimeout(() => isAnimating = false, 700);
                }
            });
        }

        if(nxtBtnCar) {
            nxtBtnCar.addEventListener('click', () => {
                if (!activeCatId || isAnimating) return;
                const state = catStates[activeCatId];
                if (state.currentPage < state.totalPages - 1) {
                    isAnimating = true;
                    state.currentPage++;
                    updateCarouselUI();
                    setTimeout(() => isAnimating = false, 700);
                }
            });
        }

        // Tab Switching Logic
        const links = document.querySelectorAll('.cat-link');
        
        function activateCategory(targetId) {
            catSections.forEach(s => {
                s.classList.remove('active-section');
                s.classList.add('hidden');
            });
            const target = document.getElementById(targetId);
            if(target) {
                target.classList.remove('hidden');
                target.classList.add('active-section');
                activeCatId = targetId;
                
                // Initialize entrance animations for this specific category
                const state = catStates[activeCatId];
                setTimeout(() => {
                    state.pages.forEach((page, pIdx) => {
                        if (pIdx === state.currentPage) {
                            const pCards = page.querySelectorAll('.selection-card');
                            pCards.forEach((c, cIdx) => {
                                c.style.transform = 'translateX(12px)';
                                c.style.opacity = '0';
                                setTimeout(() => {
                                    c.style.transform = 'translateX(0)';
                                    c.style.opacity = Store.get('currentOutfit')?.[c.dataset.category]?.includes(c.dataset.id) ? '1' : '0.8';
                                }, cIdx * 100);
                            });
                        }
                    });
                }, 50);

                updateCarouselUI();
            }
        }

        if (sections = document.querySelectorAll('.category-section'), sections.length > 0) {
            activateCategory(sections[0].id);
        }

        links.forEach(link => {
            link.addEventListener('click', () => {
                links.forEach(l => {
                    l.classList.remove('border-brand', 'text-brand', 'active-cat');
                    l.classList.add('border-transparent', 'text-muted');
                });
                link.classList.remove('border-transparent', 'text-muted');
                link.classList.add('border-brand', 'text-brand', 'active-cat');
                
                activateCategory(link.dataset.target);
            });
        });

        // Item Selection Logic
        const items = document.querySelectorAll('.selection-card');
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
                const idx = outfit[cat].indexOf(id);

                if (idx > -1) {
                    outfit[cat].splice(idx, 1);
                    item.classList.remove('active', 'border-brand', 'shadow-[0_20px_50px_rgba(0,0,0,0.3)]', 'opacity-100', 'z-10');
                    item.classList.add('border-transparent', 'opacity-80');
                    
                    const img = item.querySelector('img');
                    img.classList.remove('grayscale-0');
                    img.classList.add('grayscale');

                    const icon = item.querySelector('.check-mark');
                    if(icon) {
                        icon.classList.remove('opacity-100', 'scale-100');
                        icon.classList.add('opacity-0', 'scale-50');
                    }
                } else {
                    const total = outfit.topwear.length + outfit.outerwear.length + outfit.bottomwear.length + outfit.footwear.length + outfit.accessories.length;
                    if (total >= 12) {
                        if (window.App && window.App.showToast) {
                            window.App.showToast('You can only select up to 12 items.');
                        } else {
                            alert('You can only select up to 12 items.');
                        }
                        return;
                    }
                    
                    outfit[cat].push(id);
                    item.classList.add('active', 'border-brand', 'shadow-[0_20px_50px_rgba(0,0,0,0.3)]', 'opacity-100', 'z-10');
                    item.classList.remove('border-transparent', 'opacity-80');
                    
                    const img = item.querySelector('img');
                    img.classList.remove('grayscale');
                    img.classList.add('grayscale-0');

                    const icon = item.querySelector('.check-mark');
                    if(icon) {
                        icon.classList.remove('opacity-0', 'scale-50');
                        icon.classList.add('opacity-100', 'scale-100');
                    }
                }

                Store.set('currentOutfit', outfit);
                
                // Update specific category counter
                const catCount = outfit[cat].length;
                const catCounterEl = document.getElementById(`counter-${cat}`);
                if (catCounterEl) {
                    catCounterEl.innerText = catCount;
                    if (catCount > 0) {
                        catCounterEl.classList.remove('text-foreground/30');
                        catCounterEl.classList.add('text-brand');
                    } else {
                        catCounterEl.classList.add('text-foreground/30');
                        catCounterEl.classList.remove('text-brand');
                    }
                }

                const total = outfit.topwear.length + outfit.outerwear.length + outfit.bottomwear.length + outfit.footwear.length + outfit.accessories.length;
                
                const btn = document.getElementById('next-btn-main');
                if (btn) btn.disabled = total === 0;
            });
        });

        document.getElementById('next-btn-main')?.addEventListener('click', (e) => {
            if (e.target.disabled) return;
            window.Router.navigate('/color');
        });
    }

    return { render, init };
})();
