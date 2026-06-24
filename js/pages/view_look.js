/* ============================================
   FashionWardrobe — View Look (Shared/Read-Only)
   ============================================ */
const ViewLookPage = (() => {

    let externalColorMap = {};
    let activeResCatId = null;
    let resCatStates = {};
    
    function render() {
        return `
<div class="h-screen w-screen bg-background text-foreground flex flex-col selection:bg-brand selection:text-brand-foreground overflow-hidden" id="view-wrapper">
    <div class="flex-grow flex items-center justify-center h-full">
        <span class="material-symbols-outlined animate-spin text-4xl text-brand">sync</span>
    </div>
</div>`;
    }

    function _buildLink(id, text) {
        return `<button class="res-cat-link px-6 py-4 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-foreground/50 hover:text-foreground transition-colors whitespace-nowrap border-b-[3px] border-transparent [&.active]:border-brand [&.active]:text-foreground focus:outline-none" onclick="ViewLookPage.activateCategory('res-cat-${id}', this)">${text}</button>`;
    }

    function _getColorStyle(colorName) {
        if (!colorName) return '';
        const name = colorName.toLowerCase().replace(/[^a-z]/g, '');
        
        const map = {
            black: '#000000', white: '#ffffff', gray: '#808080', grey: '#808080', charcoal: '#36454F',
            silver: '#C0C0C0', navy: '#000080', navyblue: '#000080', blue: '#0000FF', lightblue: '#ADD8E6', cyan: '#00FFFF',
            teal: '#008080', green: '#008000', olive: '#808000', olivegreen: '#808000', lime: '#00FF00', yellow: '#FFFF00',
            gold: '#FFD700', orange: '#FFA500', brown: '#A52A2A', tan: '#D2B48C', khaki: '#C3B091',
            beige: '#F5F5DC', red: '#FF0000', maroon: '#800000', burgundy: '#800020', pink: '#FFC0CB',
            purple: '#800080', magenta: '#FF00FF', violet: '#EE82EE', cream: '#FFFDD0', rust: '#B7410E',
            mustard: '#FFDB58', coral: '#FF7F50', salmon: '#FA8072', mint: '#98FF98', peach: '#FFE5B4',
            indigo: '#4B0082', taupe: '#483C32', offwhite: '#FAF9F6', darkgrey: '#A9A9A9', lightgrey: '#D3D3D3',
            darkbrown: '#5C4033', lightbrown: '#B5651D', darkblue: '#00008B', darkgreen: '#006400',
            brightyellow: '#FFEA00', brightred: '#EE4B2B', neongreen: '#39FF14', emerald: '#50C878',
            forestgreen: '#228B22', crimson: '#DC143C', wine: '#722F37', plum: '#DDA0DD',
            lavender: '#E6E6FA', slate: '#708090', slategrey: '#708090', slategray: '#708090',
            ivory: '#FFFFF0', sand: '#C2B280', camel: '#C19A6B', cognac: '#9A463D',
            mahogany: '#C04000', oxblood: '#4A0000', burntorange: '#CC5500',
            terracotta: '#E2725B', blush: '#DE5D83', rose: '#FF007F', fuchsia: '#FF00FF',
            lilac: '#C8A2C8', aubergine: '#472C4C', sapphire: '#0F52BA', cobalt: '#0047AB',
            cerulean: '#007BA7', turquoise: '#40E0D0', aquamarine: '#7FFFD4',
            seafoam: '#71EEB8', sage: '#9DC183', mintgreen: '#98FF98',
            huntergreen: '#355E3B', neon: '#39FF14', pastels: '#FDFD96',
            earthtones: '#8B4513', neutraltones: '#D3D3D3', jeweltones: '#4B0082',
            denim: '#1560BD', lightwash: '#8CBED6', darkwash: '#00416A',
            acidwash: '#9DB1CC', chambray: '#A5C1E7', monochrome: '#808080',
            mustardyellow: '#FFDB58', pale: '#FDFD96', brick: '#B22222', brickred: '#B22222',
            steel: '#4682B4', steelblue: '#4682B4', copper: '#B87333', bronze: '#CD7F32',
            silvergrey: '#C0C0C0', mutedtones: '#A9A9A9'
        };
        
        let hex = externalColorMap[name] || map[name];
        if (!hex) return '';

        let r = parseInt(hex.substr(1, 2), 16);
        let g = parseInt(hex.substr(3, 2), 16);
        let b = parseInt(hex.substr(5, 2), 16);
        let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        let textColor = (yiq >= 128) ? '#000000' : '#ffffff';

        return `background-color: ${hex}; color: ${textColor}; border-color: ${hex};`;
    }

    function _renderResultCategory(category, items, collectionIdx) {
        if (items.length === 0) return '';
        let pagesHtml = items.map((item, idx) => `
            <div class="res-page-container absolute inset-0 p-6 pb-10 transition-all duration-700 ease-[var(--ease-out-expo)]" data-page="${idx}" style="opacity: ${idx === 0 ? '1' : '0'}; transform: translateX(${idx === 0 ? '0' : '1.5rem'}); pointer-events: ${idx === 0 ? 'auto' : 'none'};">
                <div class="relative flex flex-col border-[4px] border-brand shadow-[0_20px_50px_rgba(0,0,0,0.3)] h-full w-full overflow-hidden rounded-sm">
                    <img src="${item.image}" alt="${item.name.replace(/'/g, "&#39;")}" class="absolute inset-0 w-full h-full object-cover" onerror="this.onerror=null; this.src='https://image.pollinations.ai/prompt/${encodeURIComponent(item.name + ' fashion')}?width=400&height=500&nologo=true';">
                    <div class="absolute top-0 inset-x-0 h-1/4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>
                    <div class="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                    <div class="absolute top-6 left-6 font-mono text-[10px] text-white tracking-[0.3em] font-bold z-10">0${idx + 1}</div>
                    <div class="absolute bottom-0 left-0 w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-2 z-10">
                        <span class="text-xl lg:text-3xl font-extrabold uppercase tracking-tighter text-white leading-none">${item.name}</span>
                    </div>
                </div>
            </div>
        `).join('');

        let dotsHtml = '';
        if (items.length > 1) {
            dotsHtml = Array.from({length: items.length}).map((_, i) => 
                `<div class="w-2 h-2 rounded-full border border-foreground transition-colors ${i === 0 ? 'bg-foreground' : 'bg-transparent'}"></div>`
            ).join('');
        }

        return `
        <div class="res-category-section hidden h-full w-full relative" id="res-cat-${category}-${collectionIdx}" data-total-pages="${items.length}">
            ${pagesHtml}
            <div class="res-carousel-dots absolute bottom-2 left-1/2 -translate-x-1/2 z-50 flex gap-2">
                ${dotsHtml}
            </div>
        </div>`;
    }

    function activateCategory(targetId, btnEl) {
        const sections = document.querySelectorAll('.res-category-section');
        sections.forEach(s => {
            s.classList.remove('active-section');
            s.classList.add('hidden');
        });

        const target = document.getElementById(targetId);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active-section');
            activeResCatId = targetId;
            updateCarouselUI();
        }

        if (btnEl) {
            const container = btnEl.closest('.flex');
            if (container) {
                container.querySelectorAll('.res-cat-link').forEach(b => b.classList.remove('active'));
                btnEl.classList.add('active');
            }
        }
    }

    function updateCarouselUI() {
        if (!activeResCatId) return;
        const state = resCatStates[activeResCatId];
        if (!state) return;

        const section = document.getElementById(activeResCatId);
        if(!section) return;

        const prevBtn = section.parentElement.querySelector('.res-prev-btn-carousel');
        const nextBtn = section.parentElement.querySelector('.res-next-btn-carousel');
        
        if(prevBtn && nextBtn) {
            if (state.totalPages > 1) {
                prevBtn.classList.remove('hidden');
                nextBtn.classList.remove('hidden');
                prevBtn.disabled = state.currentPage === 0;
                nextBtn.disabled = state.currentPage === state.totalPages - 1;
            } else {
                prevBtn.classList.add('hidden');
                nextBtn.classList.add('hidden');
            }
        }

        state.dots.forEach((d, idx) => {
            if (idx === state.currentPage) d.classList.replace('bg-transparent', 'bg-foreground');
            else d.classList.replace('bg-foreground', 'bg-transparent');
        });

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

    async function init() {
        const container = document.getElementById('view-wrapper');
        
        // Fetch outfit data either from Store (internal navigation) or URL hash (external share)
        let outfit = Store.get('shared_look');
        
        if (!outfit) {
            // Check URL
            const hash = window.location.hash;
            if (hash.includes('?data=')) {
                try {
                    const encoded = hash.split('?data=')[1];
                    outfit = JSON.parse(atob(encoded));
                } catch(e) {
                    console.error("Failed to parse shared look", e);
                }
            }
        }

        if (!outfit) {
            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center p-6 text-center">
                    <span class="material-symbols-outlined text-5xl text-red-500 mb-6">error</span>
                    <h2 class="font-sans font-extrabold text-2xl uppercase tracking-tighter mb-4">Link Expired or Invalid</h2>
                    <p class="font-mono text-xs text-muted-foreground mb-8">We couldn't load this outfit.</p>
                    <button class="px-6 py-3 bg-brand text-brand-foreground font-mono text-xs uppercase tracking-widest hover:opacity-90" onclick="window.Router.navigate('/landing')">Return Home</button>
                </div>`;
            return;
        }

        // Clean up store to avoid state bleeding
        Store.set('shared_look', null);

        const baseCats = ['topwear', 'outerwear', 'bottomwear', 'footwear'];
        const catNames = { topwear: 'Topwear', outerwear: 'Outerwear', bottomwear: 'Bottomwear', footwear: 'Footwear' };
        
        let accessories = [];
        const catItems = {};
        let activeCats = [];

        const hasAnyCategories = (outfit.items || []).some(i => i.category);

        if (hasAnyCategories) {
            accessories = (outfit.items || []).filter(i => i.isAccessory || !baseCats.includes(i.category));
            baseCats.forEach(c => {
                catItems[c] = (outfit.items || []).filter(item => item.category === c && !item.isAccessory);
            });
            activeCats = baseCats.filter(c => catItems[c] && catItems[c].length > 0);
            
            // Failsafe: if somehow all items ended up as accessories
            if (activeCats.length === 0 && accessories.length > 0) {
                 catItems['topwear'] = accessories;
                 activeCats = ['topwear'];
                 accessories = [];
            }
        } else {
            // Old format fallback: split the array in half
            const items = outfit.items || [];
            const half = Math.ceil(items.length / 2);
            catItems['topwear'] = items.slice(0, half);
            accessories = items.slice(half);
            activeCats = ['topwear'];
        }
        
        let tabsHtml = '';
        let viewsHtml = '';

        // Just one collection
        const idx = 0;



        viewsHtml += `
        <div class="collection-view flex w-full lg:w-[35%] h-[40%] lg:h-full flex-col border-b lg:border-b-0 lg:border-r border-foreground relative overflow-hidden bg-background" data-collection-idx="${idx}">
            <div class="z-40 border-b border-foreground/20 flex overflow-x-auto no-scrollbar shrink-0 px-2 pt-2">
                ${activeCats.map(c => _buildLink(c + '-' + idx, catNames[c])).join('')}
            </div>
            <div class="flex-grow relative overflow-hidden">
                <button class="res-prev-btn-carousel absolute left-2 top-1/2 -translate-y-1/2 z-50 w-8 h-8 bg-background/80 backdrop-blur border border-foreground flex items-center justify-center rounded-full hover:bg-foreground hover:text-background transition-colors disabled:opacity-0 disabled:cursor-not-allowed hidden">
                    <span class="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button class="res-next-btn-carousel absolute right-2 top-1/2 -translate-y-1/2 z-50 w-8 h-8 bg-background/80 backdrop-blur border border-foreground flex items-center justify-center rounded-full hover:bg-foreground hover:text-background transition-colors disabled:opacity-0 disabled:cursor-not-allowed hidden">
                    <span class="material-symbols-outlined text-lg">chevron_right</span>
                </button>
                ${activeCats.map(c => _renderResultCategory(c, catItems[c], idx)).join('')}
            </div>
        </div>

        <!-- Right Side -->
        <div class="collection-view flex w-full lg:w-[65%] h-[60%] lg:h-full flex-col bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] overflow-y-auto p-6 lg:p-12 relative" data-collection-idx="${idx}">
            
            <div class="flex flex-col xl:flex-row xl:items-end justify-between border-b-[2px] border-foreground pb-6 mb-10 gap-6">
                <h2 class="font-sans font-extrabold text-4xl lg:text-5xl uppercase tracking-tighter leading-none text-brand">${outfit.name || 'Shared Look'}</h2>
                
                <!-- Dual Scoreboard -->
                <div class="flex items-stretch gap-4 shrink-0">
                    <!-- Current Score -->
                    <div class="flex flex-col items-center justify-center px-4 py-3 border-[2px] border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                        <span class="font-mono text-[9px] uppercase tracking-widest font-bold text-muted-foreground mb-1">YOUR BASE</span>
                        <span class="font-mono text-3xl font-black text-foreground">${outfit.currentScore || 70}</span>
                    </div>
                    
                    <!-- Arrow -->
                    <div class="flex items-center justify-center text-brand">
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </div>

                    <!-- Projected Score -->
                    <div class="flex flex-col items-center justify-center px-4 py-3 border-[2px] border-brand bg-brand shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] text-brand-foreground">
                        <span class="font-mono text-[9px] uppercase tracking-widest font-bold mb-1 opacity-80">PROJECTED</span>
                        <span class="font-mono text-3xl font-black">${outfit.score || 90}</span>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-4 mb-8">
                <span class="font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">OUTFIT COMPOSITION</span>
                <div class="h-px bg-foreground/20 flex-grow"></div>
            </div>

            <div class="flex flex-col gap-8 pb-12">
                ${accessories.length > 0 ? accessories.map((acc, i) => `
                    <div class="border-[2px] border-foreground bg-background p-6 lg:p-8 flex flex-col relative transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                        <div class="absolute top-6 right-6 font-mono text-[10px] text-muted-foreground tracking-[0.3em] font-bold">0${i + 1}</div>
                        
                        <span class="font-mono text-[10px] text-brand tracking-widest uppercase mb-2 block">${acc.category || 'Recommended'}</span>
                        <h3 class="font-sans font-extrabold text-2xl uppercase tracking-tighter mb-4 leading-tight">${acc.name}</h3>
                        ${acc.why || acc.description ? `<p class="font-mono text-xs text-foreground/80 leading-relaxed max-w-2xl mb-6">${acc.why || acc.description}</p>` : ''}
                        
                        ${acc.colors && (acc.colors.match || acc.colors.avoid) ? `
                        <div class="flex flex-col gap-3 pt-4 border-t border-foreground/20">
                            ${acc.colors.match && acc.colors.match.length > 0 ? `
                            <div class="flex items-center gap-3 flex-wrap">
                                <span class="font-mono text-[10px] uppercase tracking-widest font-bold text-foreground/50 w-16">WORKS WELL WITH</span>
                                ${acc.colors.match.map(c => `<span class="font-mono text-[10px] uppercase border px-2 py-1 shadow-sm font-bold rounded-sm" style="${_getColorStyle(c) || 'background-color: transparent; border-color: rgba(0,0,0,0.2);'}">${c}</span>`).join('')}
                            </div>` : ''}
                            
                            ${acc.colors.avoid && acc.colors.avoid.length > 0 ? `
                            <div class="flex items-center gap-3 flex-wrap">
                                <span class="font-mono text-[10px] uppercase tracking-widest font-bold text-red-500/50 w-16">LESS RECOMMENDED</span>
                                ${acc.colors.avoid.map(c => `<span class="font-mono text-[10px] uppercase border px-2 py-1 shadow-sm font-bold rounded-sm" style="${_getColorStyle(c) || 'background-color: transparent; border-color: rgba(239,68,68,0.2); color: rgb(220,38,38);'}">${c}</span>`).join('')}
                            </div>` : ''}
                        </div>
                        ` : ''}
                    </div>
                `).join('') : `
                    <div class="border border-foreground/20 bg-foreground/5 p-6 lg:p-8 flex items-center justify-center text-center">
                        <span class="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">No additional accessories recommended</span>
                    </div>
                `}
            </div>
        </div>
        `;

        const splitLayoutHtml = `
        <nav class="sticky top-0 z-50 flex items-baseline justify-between border-b border-foreground bg-background px-6 py-4 shrink-0">
            <div class="font-mono text-xs font-bold tracking-tighter cursor-pointer" onclick="window.Router.navigate('/landing')">
                FASHIONWARDROBE<sup class="ml-1 text-brand">®</sup>
            </div>
            <div class="flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest">
                <span class="hidden sm:inline-block border border-foreground px-3 py-1 bg-brand text-brand-foreground font-bold">VIEWING SHARED LOOK</span>
                <button class="transition-colors hover:text-brand flex items-center gap-2" onclick="window.Router.navigate('/landing')">
                    <span class="material-symbols-outlined text-[14px]">close</span>
                </button>
            </div>
        </nav>

        <main class="flex-grow flex flex-col lg:flex-row border-b border-foreground h-full overflow-hidden">
            ${viewsHtml}
        </main>

        <footer class="bg-background flex flex-col md:flex-row items-stretch shrink-0 z-50 relative">
            <div class="flex-1 p-6 flex items-center justify-between md:justify-start gap-12 border-b md:border-b-0 md:border-r border-foreground">
                <button class="font-mono text-[10px] uppercase tracking-[0.3em] text-muted hover:text-foreground transition-colors flex items-center group" onclick="window.history.length > 1 ? history.back() : window.Router.navigate('/landing')">
                    <span class="material-symbols-outlined text-[14px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span> BACK
                </button>
            </div>
            <div class="flex-1 flex items-stretch">
                <button class="flex-1 bg-background text-foreground font-mono text-xs uppercase tracking-widest p-6 transition-all hover:bg-foreground/5 flex items-center justify-center gap-3" onclick="window.Router.navigate('/gender')">
                    <span class="material-symbols-outlined">auto_awesome</span> Create Your Own
                </button>
            </div>
        </footer>
        `;

        container.innerHTML = splitLayoutHtml;

        // Initialize Carousels
        resCatStates = {};
        document.querySelectorAll('.res-category-section').forEach(sec => {
            resCatStates[sec.id] = {
                currentPage: 0,
                totalPages: parseInt(sec.dataset.totalPages || '1'),
                pages: sec.querySelectorAll('.res-page-container'),
                dots: sec.querySelectorAll('.res-carousel-dots div')
            };
        });

        if (activeCats.length > 0) {
            activateCategory('res-cat-' + activeCats[0] + '-0', document.querySelector('.res-cat-link'));
        }

        // Bind global carousel arrow events via event delegation
        container.addEventListener('click', (e) => {
            const prevBtn = e.target.closest('.res-prev-btn-carousel');
            const nxtBtn = e.target.closest('.res-next-btn-carousel');
            
            if (prevBtn || nxtBtn) {
                if (!activeResCatId) return;
                const state = resCatStates[activeResCatId];
                if (!state) return;

                if (prevBtn && state.currentPage > 0) {
                    state.currentPage--;
                    updateCarouselUI();
                } else if (nxtBtn && state.currentPage < state.totalPages - 1) {
                    state.currentPage++;
                    updateCarouselUI();
                }
            }
        });
    }

    return { render, init, activateCategory };
})();

window.ViewLookPage = ViewLookPage;
