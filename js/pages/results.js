/* ============================================
   FashionWardrobe — Style Curation Results (Multi-Collection)
   ============================================ */
const ResultsPage = (() => {

    function render() {
        return `
<div class="h-screen w-screen bg-background dark:bg-foreground text-foreground dark:text-background flex flex-col selection:bg-brand selection:text-brand-foreground overflow-hidden" id="results-wrapper">
    <!-- Top Nav -->
    <nav class="sticky top-0 z-50 flex items-baseline justify-between border-b border-foreground dark:border-background bg-background dark:bg-foreground px-6 py-4 shrink-0">
        <div class="font-mono text-xs font-bold tracking-tighter cursor-pointer" onclick="window.Router.navigate('/landing')">
            FASHIONWARDROBE<sup class="ml-1 text-brand">®</sup>
        </div>
        <div class="flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest">
            <span class="hidden sm:inline-block border border-foreground dark:border-background px-3 py-1 bg-foreground/10 dark:bg-background/10 text-muted-foreground font-bold animate-pulse">ANALYZING...</span>
            <button class="transition-colors hover:text-brand flex items-center gap-2" onclick="window.Router.navigate('/landing')">
                <span class="material-symbols-outlined text-[14px]">close</span>
            </button>
        </div>
    </nav>

    <main class="flex-grow flex items-center justify-center border-b border-foreground dark:border-background h-full overflow-hidden relative bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')]" id="results-container">
        <div class="flex flex-col items-center bg-background dark:bg-foreground p-12 border-[2px] border-foreground dark:border-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <span class="material-symbols-outlined text-5xl text-brand mb-6 animate-pulse">auto_awesome</span>
            <div class="font-sans font-extrabold text-4xl uppercase tracking-tighter mb-4">Analyzing</div>
            <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground" id="loading-text">Extracting style DNA...</span>
        </div>
    </main>

    <!-- Bottom Bar (Disabled while loading) -->
    <footer class="bg-background dark:bg-foreground flex flex-col md:flex-row items-stretch shrink-0 z-50 relative pointer-events-none opacity-50">
        <div class="flex-1 p-6 flex items-center justify-between md:justify-start gap-12 border-b md:border-b-0 md:border-r border-foreground dark:border-background">
            <button class="font-mono text-[10px] uppercase tracking-[0.3em] text-muted flex items-center gap-2">
                <span class="material-symbols-outlined text-[14px]">arrow_back</span> BACK
            </button>
        </div>
        <div class="flex-1 p-6"></div>
    </footer>
</div>`;
    }

    function _buildLink(id, text) {
        return `<button class="res-cat-link px-6 py-4 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-foreground/50 dark:text-background/50 hover:text-foreground dark:hover:text-background transition-colors whitespace-nowrap border-b-[3px] border-transparent [&.active]:border-brand [&.active]:text-foreground dark:[&.active]:text-background focus:outline-none" onclick="ResultsPage.activateCategory('res-cat-${id}', this)">${text}</button>`;
    }

    function _renderResultCategory(category, items, collectionIdx) {
        if (items.length === 0) return '';
        let pagesHtml = items.map((item, idx) => `
            <div class="res-page-container absolute inset-0 p-6 pb-10 transition-all duration-700 ease-[var(--ease-out-expo)]" data-page="${idx}" style="opacity: ${idx === 0 ? '1' : '0'}; transform: translateX(${idx === 0 ? '0' : '1.5rem'}); pointer-events: ${idx === 0 ? 'auto' : 'none'};">
                <div class="relative flex flex-col border-[4px] border-brand shadow-[0_20px_50px_rgba(0,0,0,0.3)] h-full w-full overflow-hidden rounded-sm">
                    <!-- Background Image -->
                    <img src="${item.image}" alt="${escapeHtml(item.name)}" class="absolute inset-0 w-full h-full object-cover" style="object-position: ${item.objectPosition || 'center top'};" onerror="this.onerror=null; this.src='https://image.pollinations.ai/prompt/${encodeURIComponent(item.name + ' fashion')}?width=400&height=500&nologo=true';">
                    <!-- Gradients -->
                    <div class="absolute top-0 inset-x-0 h-1/4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>
                    <div class="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                    <!-- Top Left Number -->
                    <div class="absolute top-6 left-6 font-mono text-[10px] text-white tracking-[0.3em] font-bold z-10">0${idx + 1}</div>
                    <!-- Top Right Icon -->
                    <div class="absolute top-6 right-6 z-10 material-symbols-outlined text-brand">check_circle</div>
                    <!-- Bottom Content -->
                    <div class="absolute bottom-0 left-0 w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-2 z-10">
                        ${item.colorData && (item.colorData.primary || (item.colorData.pattern && item.colorData.pattern !== 'Solid')) ? `
                        <div class="flex gap-2">
                            ${item.colorData.primary ? `<span class="text-[10px] uppercase font-mono tracking-widest px-2 py-1 font-bold shadow-sm rounded-sm border" style="${_getColorStyle(item.colorData.primary) || 'background-color: rgba(255,255,255,0.2); backdrop-filter: blur(4px); border-color: rgba(255,255,255,0.5); color: white;'}">${escapeHtml(item.colorData.primary)}</span>` : ''}
                            ${item.colorData.pattern && item.colorData.pattern !== 'Solid' ? `<span class="bg-white/20 backdrop-blur text-white text-[10px] uppercase font-mono tracking-widest px-2 py-1 font-bold shadow-sm rounded-sm border border-white/50">${escapeHtml(item.colorData.pattern)}</span>` : ''}
                        </div>` : ''}
                        <span class="text-xl lg:text-3xl font-extrabold uppercase tracking-tighter text-white leading-none">${escapeHtml(item.name)}</span>
                    </div>
                </div>
            </div>
        `).join('');

        let dotsHtml = '';
        if (items.length > 1) {
            dotsHtml = Array.from({length: items.length}).map((_, i) => 
                `<div class="w-2 h-2 rounded-full border border-foreground dark:border-background transition-colors ${i === 0 ? 'bg-foreground dark:bg-background' : 'bg-transparent'}"></div>`
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

    function _getColorStyle(colorName) {
        if (!colorName || typeof colorName !== 'string') return '';
        const name = colorName.toLowerCase().replace(/[^a-z]/g, '');
        
        // Check our massive external API map first!
        let hex = externalColorMap[name];
        
        // Fallback to our manual dictionary if the CDN didn't have it or failed
        if (!hex) {
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
            acidwash: '#9DB1CC', chambray: '#A5C1E7',
            monochrome: '#808080',
            mustardyellow: '#FFDB58', pale: '#FDFD96',
            brick: '#B22222', brickred: '#B22222',
            steel: '#4682B4', steelblue: '#4682B4',
            copper: '#B87333', bronze: '#CD7F32',
            silvergrey: '#C0C0C0', mutedtones: '#A9A9A9'
        };
        
        hex = map[name];
        }
        
        if (!hex) return '';

        let r = parseInt(hex.substr(1, 2), 16);
        let g = parseInt(hex.substr(3, 2), 16);
        let b = parseInt(hex.substr(5, 2), 16);
        let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        let textColor = (yiq >= 128) ? '#000000' : '#ffffff';

        return `background-color: ${hex}; color: ${textColor}; border-color: ${hex};`;
    }

    let activeResCatId = null;
    let resCatStates = {};

    function activateCategory(targetId, btnEl) {
        const sections = document.querySelectorAll('.res-category-section');
        sections.forEach(s => {
            s.classList.remove('active-section');
            s.classList.add('hidden');
        });
        const target = document.getElementById(targetId);
        if(target) {
            target.classList.remove('hidden');
            target.classList.add('active-section');
            activeResCatId = targetId;
            updateCarouselUI();
        }
        if (btnEl) {
            const container = btnEl.closest('.z-40');
            if (container) {
                container.querySelectorAll('.res-cat-link').forEach(l => l.classList.remove('active'));
            }
            btnEl.classList.add('active');
        } else {
            const firstLink = document.querySelector(`.res-cat-link[onclick*="${targetId}"]`);
            if (firstLink) firstLink.classList.add('active');
        }
    }

    function updateCarouselUI() {
        if (!activeResCatId) return;
        const state = resCatStates[activeResCatId];
        if (!state) return;

        // Find the active collection container to scope buttons
        const activeContainer = document.querySelector('.collection-view.active-collection');
        if (!activeContainer) return;

        const prevBtnCar = activeContainer.querySelector('.res-prev-btn-carousel');
        const nxtBtnCar = activeContainer.querySelector('.res-next-btn-carousel');

        if (state.totalPages > 1) {
            state.dots.forEach((d, i) => {
                d.className = `w-2 h-2 rounded-full border border-foreground dark:border-background transition-colors ${i === state.currentPage ? 'bg-foreground dark:bg-background' : 'bg-transparent'}`;
            });
            if(prevBtnCar) prevBtnCar.style.display = 'flex';
            if(nxtBtnCar) nxtBtnCar.style.display = 'flex';
            if(prevBtnCar) prevBtnCar.disabled = state.currentPage === 0;
            if(nxtBtnCar) nxtBtnCar.disabled = state.currentPage === state.totalPages - 1;
        } else {
            if(prevBtnCar) prevBtnCar.style.display = 'none';
            if(nxtBtnCar) nxtBtnCar.style.display = 'none';
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

    const dbName = 'fashion_wardrobe_db';
    let db;
    let selectedItemIds = [];
    let currentCollections = [];
    
    // External Color Database
    let externalColorMap = {};

    // ============================================================
    // STYLIST REPORT — Component Render Functions
    //
    // Each function is self-contained: receives `col`, returns HTML.
    // Empty-state policy: return "" when there is no content to show.
    // No placeholders, no empty cards, no dead vertical space.
    //
    // To add a future backend field:
    //   1. Add a key to SECTION_LABELS.
    //   2. Create one new render function below.
    //   3. Insert one call into the right-panel template.
    //   No other changes required.
    // ============================================================

    const SECTION_LABELS = {
        complete:    'Complete the Look',
        stylist:     'Styling Insight',
        accessories: 'Finishing Touches',
        upgrades:    'Outfit Upgrade',
        footwear:    'Footwear',
        colors:      'Color Palette',
        grooming:    'Grooming',
        fragrance:   'Fragrance'
    };

    const CARD_STYLES = {
        base:     'border border-foreground/20 dark:border-background/20 p-4 flex flex-col gap-2 hover:border-foreground/50 transition-colors',
        heavy:    'border-[2px] border-foreground dark:border-background bg-background dark:bg-foreground p-8 flex flex-col relative hover:shadow-none hover:translate-x-3 hover:translate-y-3 transition-all duration-200',
        heavySecondary: 'border-[2px] border-foreground dark:border-background bg-background dark:bg-foreground p-6 flex flex-col relative hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-200',
        light:    'border border-foreground/30 dark:border-background/30 p-6 flex gap-5 items-start',
        shadow: {
            hero:      'shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]',
            secondary: 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]',
            subtle:    'shadow-[3px_3px_0px_0px_rgba(0,0,0,0.07)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.07)]'
        }
    };

    // Shared utility — editorial section label + hairline rule.
    // Returns "" when label is falsy so callers can skip cleanly.
    function renderSectionDivider(label) {
        if (!label) return '';
        return `
        <div class="flex items-center gap-4 mb-8 mt-10">
            <span class="font-mono text-[9px] uppercase tracking-[0.35em] font-bold text-muted-foreground shrink-0">${label}</span>
            <div class="h-px bg-foreground/15 dark:bg-background/15 flex-grow"></div>
        </div>`;
    }

    // ---------------------------------------------------------------
    // COMPLETE THE LOOK
    // Data source : col.completionPotential (Future: col.requiredGarment)
    // Priority    : HIGHEST (Conditionally)
    // ---------------------------------------------------------------
    function renderCompletionSection(col) {
        if (!col.requiredGarment) return '';

        const requiredGarment = col.requiredGarment;

        const matchColorsHtml = (requiredGarment.matchColors || []).map(c => {
            const style = _getColorStyle(c);
            return `<span class="font-mono text-[10px] uppercase border px-2 py-1 shadow-sm font-bold rounded-sm inline-block" style="${style || 'background-color: transparent; border-color: rgba(0,0,0,0.2);'}">${c}</span>`;
        }).join('');

        const avoidColorsHtml = (requiredGarment.avoidColors || []).map(c => {
            const style = _getColorStyle(c);
            return `<span class="font-mono text-[10px] uppercase border px-2 py-1 shadow-sm font-bold rounded-sm inline-block" style="${style || 'background-color: transparent; border-color: rgba(239,68,68,0.2); color: rgb(220,38,38);'}">${c}</span>`;
        }).join('');

        // Visual Priority spacing: mt-12 instead of mt-10
        // Visual Priority divider: bg-foreground/30 instead of bg-foreground/15
        const sectionHeader = `
        <div class="flex items-center gap-4 mb-8 mt-12">
            <span class="font-mono text-[9px] uppercase tracking-[0.35em] font-bold text-muted-foreground shrink-0">${SECTION_LABELS.complete}</span>
            <div class="h-px bg-foreground/30 dark:bg-background/30 flex-grow"></div>
        </div>`;

        return sectionHeader + `
        <div class="${CARD_STYLES.light} ${CARD_STYLES.shadow.subtle}">
            <div class="flex flex-col gap-2 w-full">
                <span class="font-mono text-[9px] uppercase tracking-[0.35em] font-bold text-brand">Recommended ${requiredGarment.category}</span>
                <h4 class="font-sans font-bold text-base uppercase tracking-tighter leading-tight">${requiredGarment.name}</h4>
                
                <div class="pt-3 border-t border-foreground/10 dark:border-background/10 flex flex-col gap-3 mt-2">
                    ${matchColorsHtml ? `
                    <div class="flex items-center gap-3 flex-wrap">
                        <span class="font-mono text-[9px] uppercase tracking-widest font-bold text-foreground/50 dark:text-background/50 w-16 leading-tight">WORKS WITH</span>
                        <div class="flex flex-wrap gap-2">${matchColorsHtml}</div>
                    </div>` : ''}
                    ${avoidColorsHtml ? `
                    <div class="flex items-center gap-3 flex-wrap">
                        <span class="font-mono text-[9px] uppercase tracking-widest font-bold text-red-500/50 w-16 leading-tight">AVOID</span>
                        <div class="flex flex-wrap gap-2">${avoidColorsHtml}</div>
                    </div>` : ''}
                </div>

                <div class="mt-4 flex flex-col gap-1">
                    <span class="font-mono text-[9px] uppercase tracking-[0.35em] font-bold text-muted-foreground">WHY THIS RECOMMENDATION</span>
                    <p class="font-mono text-sm italic leading-relaxed text-foreground/85 dark:text-background/85">${requiredGarment.reason}</p>
                </div>
            </div>
        </div>`;
    }

    // ---------------------------------------------------------------
    // STYLING INSIGHT
    // Data source : col.stylingAdvice
    // Priority    : HIGH
    // ---------------------------------------------------------------
    function renderStylistNotes(col) {
        const advice = (col.stylingAdvice || '').trim();
        if (!advice) return '';

        return renderSectionDivider(SECTION_LABELS.stylist) + `
        <div class="${CARD_STYLES.light} ${CARD_STYLES.shadow.subtle}">
            <span class="font-sans font-black text-4xl text-brand leading-none mt-[-4px] select-none shrink-0" aria-hidden="true">&ldquo;</span>
            <div class="flex flex-col gap-2">
                <p class="font-mono text-sm italic leading-relaxed text-foreground/85 dark:text-background/85 mt-1">${escapeHtml(advice)}</p>
            </div>
        </div>`;
    }

    // ---------------------------------------------------------------
    // ACCESSORY RECOMMENDATIONS
    // Data source : col.accessories
    // Priority    : SECONDARY
    // ---------------------------------------------------------------
    function renderAccessoryRecommendations(col) {
        if (col.isOffline) return '';
        const accessories = col.accessories || [];
        if (accessories.length === 0) return '';

        const cards = accessories.map((acc, i) => {
            const matchColors = (acc.colors?.match || []).map(c => {
                const style = _getColorStyle(c);
                return `<span class="font-mono text-[10px] uppercase border px-2 py-1 shadow-sm font-bold rounded-sm inline-block" style="${style || 'background-color: transparent; border-color: rgba(0,0,0,0.2);'}">${c}</span>`;
            }).join('');

            const avoidColors = (acc.colors?.avoid || []).map(c => {
                const style = _getColorStyle(c);
                return `<span class="font-mono text-[10px] uppercase border px-2 py-1 shadow-sm font-bold rounded-sm inline-block" style="${style || 'background-color: transparent; border-color: rgba(239,68,68,0.2); color: rgb(220,38,38);'}">${c}</span>`;
            }).join('');

            const colorBlock = (matchColors || avoidColors) ? `
                <div class="pt-3 border-t border-foreground/10 dark:border-background/10 flex flex-col gap-3 mt-1">
                    ${matchColors ? `
                    <div class="flex items-center gap-3 flex-wrap">
                        <span class="font-mono text-[9px] uppercase tracking-widest font-bold text-foreground/50 dark:text-background/50 w-16 leading-tight">WORKS WITH</span>
                        <div class="flex flex-wrap gap-2">${matchColors}</div>
                    </div>` : ''}
                    ${avoidColors ? `
                    <div class="flex items-center gap-3 flex-wrap">
                        <span class="font-mono text-[9px] uppercase tracking-widest font-bold text-red-500/50 w-16 leading-tight">AVOID</span>
                        <div class="flex flex-wrap gap-2">${avoidColors}</div>
                    </div>` : ''}
                </div>` : '';

            return `
            <div class="${CARD_STYLES.base}">
                <div class="flex items-start justify-between gap-2">
                    <div>
                        <span class="font-mono text-[9px] text-brand uppercase tracking-widest block mb-1">${escapeHtml(acc.category) || 'Accessory'}</span>
                        <h4 class="font-sans font-bold text-base uppercase tracking-tighter leading-tight">${escapeHtml(acc.name)}</h4>
                    </div>
                    <span class="font-mono text-[10px] text-muted-foreground shrink-0 mt-0.5">0${i + 1}</span>
                </div>
                <p class="font-mono text-[11px] text-foreground/70 dark:text-background/70 leading-snug">${escapeHtml(acc.why) || escapeHtml(acc.description) || ''}</p>
                ${colorBlock}
            </div>`;
        }).join('');

        return renderSectionDivider(SECTION_LABELS.accessories) + `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">${cards}</div>`;
    }

    // ---------------------------------------------------------------
    // OUTFIT UPGRADE RECOMMENDATIONS
    // Data source : col.outfitUpgrade (FUTURE backend field)
    // Priority    : TERTIARY
    // ---------------------------------------------------------------
    function renderUpgradeRecommendations(col) {
        const upgrades = col.outfitUpgrade;
        if (!upgrades || upgrades.length === 0) return '';

        const primary = upgrades[0];
        const secondary = upgrades[1] || null;

        const primaryCard = `
        <div class="${CARD_STYLES.heavy} ${CARD_STYLES.shadow.hero}">
            <div class="absolute top-6 right-6 font-mono text-[10px] text-muted-foreground tracking-[0.3em] font-bold">01</div>
            <span class="font-mono text-[10px] text-brand tracking-widest uppercase mb-3 block">${escapeHtml(primary.category) || 'Clothing'}</span>
            <h3 class="font-sans font-extrabold text-4xl lg:text-5xl uppercase tracking-tighter leading-none mb-5">${escapeHtml(primary.name)}</h3>
            <p class="font-mono text-xs text-foreground/80 dark:text-background/80 leading-relaxed max-w-prose">${escapeHtml(primary.why) || escapeHtml(primary.description) || ''}</p>
        </div>`;

        const secondaryCard = secondary ? `
        <div class="${CARD_STYLES.heavySecondary} ${CARD_STYLES.shadow.secondary}">
            <div class="absolute top-5 right-5 font-mono text-[10px] text-muted-foreground tracking-[0.3em] font-bold">02</div>
            <span class="font-mono text-[10px] text-brand tracking-widest uppercase mb-2 block">${escapeHtml(secondary.category) || 'Clothing'}</span>
            <h3 class="font-sans font-extrabold text-2xl uppercase tracking-tighter leading-none mb-3">${escapeHtml(secondary.name)}</h3>
            <p class="font-mono text-xs text-foreground/80 dark:text-background/80 leading-relaxed max-w-prose">${escapeHtml(secondary.why) || escapeHtml(secondary.description) || ''}</p>
        </div>` : '';

        return renderSectionDivider(SECTION_LABELS.upgrades) + `<div class="flex flex-col gap-5">${primaryCard}${secondaryCard}</div>`;
    }

    function animateScoreEl(el, targetScore) {
        if (!el) return;
        let current = parseInt(el.textContent || '0');
        if (isNaN(current)) current = 0;
        if (current === targetScore) return;

        const duration = 1000;
        const startTime = performance.now();
        const startScore = current;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // easeOutQuart
            const ease = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.round(startScore + (targetScore - startScore) * ease);
            
            el.textContent = currentVal;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = targetScore;
            }
        }
        requestAnimationFrame(update);
    }

    async function init() {
        // Pre-fetch the massive 30,000+ color API database in the background immediately
        const cachedColorDB = sessionStorage.getItem('fw_color_db');
        if (cachedColorDB) {
            try {
                externalColorMap = JSON.parse(cachedColorDB);
            } catch (e) {
                // Ignore parse errors and fetch again
            }
        }
        
        if (Object.keys(externalColorMap).length === 0) {
            fetch('https://api.color.pizza/v1/')
                .then(res => res.json())
                .then(data => {
                    data.colors.forEach(c => {
                        externalColorMap[c.name.toLowerCase().replace(/[^a-z]/g, '')] = c.hex;
                    });
                    sessionStorage.setItem('fw_color_db', JSON.stringify(externalColorMap));
                }).catch(e => console.log('Color API failed to load, using fallbacks.'));
        }

        const prefs = Store.getAll();
        const container = document.getElementById('results-wrapper');
        
        // Track start time for elapsed time display
        const loadStartTime = Date.now();
        let lastStage = 'initializing';
        let stageStartTime = loadStartTime;

        let sseReceived = false;
        let heartbeatReceived = false;

        // Update elapsed time every second
        let elapsedInterval = setInterval(() => {
            const el = document.getElementById('loading-text');
            if (el) {
                const elapsed = Math.round((Date.now() - loadStartTime) / 1000);
                const currentText = el.dataset.baseText || 'Analyzing your selections...';
                el.textContent = `${currentText} (${elapsed}s)`;
            }
        }, 1000);

        // Show warm-up message after 20s if no SSE event arrived yet
        const warmupTimeout = setTimeout(() => {
            if (!sseReceived) {
                const el = document.getElementById('loading-text');
                if (el) {
                    el.dataset.baseText = 'The styling engine is warming up. Your first request may take a little longer...';
                }
            }
        }, 20000);

        // Show timeout warning after 180s
        const timeoutWarningTimeout = setTimeout(() => {
            const el = document.getElementById('loading-text');
            if (el) {
                el.dataset.baseText = 'This is taking longer than expected. The engine may be under heavy load.';
                el.style.color = 'var(--brand)';
            }
        }, 180000);

        const progressHandler = (e) => {
            const detail = typeof e.detail === 'string' ? e.detail : JSON.stringify(e.detail);

            // Ignore heartbeat messages - don't override stage info
            if (detail.includes('heartbeat') || detail === 'Still analyzing your outfit...') {
                heartbeatReceived = true;
                return;
            }

            sseReceived = true;
            clearTimeout(warmupTimeout);

            // Track stage changes
            if (detail.includes('wardrobe') || detail.includes('Exploring')) {
                lastStage = 'stage1';
                stageStartTime = Date.now();
            } else if (detail.includes('Judging') || detail.includes('candidates')) {
                lastStage = 'stage2';
                stageStartTime = Date.now();
            } else if (detail.includes('diversity') || detail.includes('filter')) {
                lastStage = 'stage3';
                stageStartTime = Date.now();
            } else if (detail.includes('Styling') || detail.includes('selections')) {
                lastStage = 'stage4';
                stageStartTime = Date.now();
            }

            const el = document.getElementById('loading-text');
            if (el) {
                el.dataset.baseText = detail;
            }
        };
        document.addEventListener('recommendation-progress', progressHandler);

        try {
            const result = await RecommendationEngine.generate(prefs);
            clearInterval(elapsedInterval);
            clearTimeout(warmupTimeout);
            clearTimeout(timeoutWarningTimeout);
            document.removeEventListener('recommendation-progress', progressHandler);
            
            const collections = result.collections || [];
            if (result.isOffline && collections.length === 0) {
                collections.push({
                    isOffline: true,
                    offlineMsg: result.offlineMsg,
                    name: 'Offline Mode',
                    yourLook: [],
                    currentScore: 0,
                    projectedScore: 0
                });
            }
            currentCollections = collections;

            const cats = ['topwear', 'outerwear', 'bottomwear', 'footwear', 'accessories'];
            const catNames = { topwear: 'Topwear', outerwear: 'Outerwear', bottomwear: 'Bottomwear', footwear: 'Footwear', accessories: 'Accessories' };

            let tabsHtml = '';
            let viewsHtml = '';

            collections.forEach((col, idx) => {
                // Build Tabs
                tabsHtml += `
                    <button class="collection-tab flex-1 py-4 px-6 border-b-[3px] ${idx === 0 ? 'border-brand text-brand' : 'border-foreground/20 dark:border-background/20 text-muted-foreground'} font-mono text-xs uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-3" onclick="ResultsPage.switchCollection(${idx})">
                        <span>Collection 0${idx + 1}</span>
                        <div class="status-dot w-2 h-2 rounded-full border border-brand ${idx === 0 ? 'bg-brand' : 'bg-transparent'}"></div>
                    </button>
                `;

                // Partition items
                const catItems = {};
                cats.forEach(c => {
                    catItems[c] = (col.yourLook || []).filter(item => item.category === c);
                });
                
                let activeCats = cats.filter(c => catItems[c].length > 0);
                if (activeCats.length === 0 && col.yourLook && col.yourLook.length > 0) {
                    catItems['topwear'] = col.yourLook;
                    activeCats = ['topwear'];
                }

                viewsHtml += `
                <!-- Left Side: Base Look -->
                <div class="collection-view ${idx === 0 ? 'flex' : 'hidden'} w-full lg:w-[35%] h-[40%] lg:h-full flex-col border-b lg:border-b-0 lg:border-r border-foreground dark:border-background relative overflow-hidden bg-background dark:bg-foreground" data-collection-idx="${idx}">
                    <!-- Sticky Category Tabs -->
                    <div class="z-40 border-b border-foreground/20 dark:border-background/20 flex overflow-x-auto no-scrollbar shrink-0 px-2 pt-2">
                        ${activeCats.map(c => _buildLink(c + '-' + idx, catNames[c])).join('')}
                    </div>
                    
                    <!-- Carousels Container -->
                    <div class="flex-grow relative overflow-hidden">
                        <!-- Carousel Arrows -->
                        <button class="res-prev-btn-carousel absolute left-2 top-1/2 -translate-y-1/2 z-50 w-8 h-8 bg-background/80 dark:bg-foreground/80 backdrop-blur border border-foreground dark:border-background flex items-center justify-center rounded-full text-foreground dark:text-background hover:bg-foreground dark:hover:bg-background hover:text-background dark:hover:text-foreground transition-colors disabled:opacity-0 disabled:cursor-not-allowed hidden" aria-label="Previous Page">
                            <span class="material-symbols-outlined text-lg">chevron_left</span>
                        </button>
                        <button class="res-next-btn-carousel absolute right-2 top-1/2 -translate-y-1/2 z-50 w-8 h-8 bg-background/80 dark:bg-foreground/80 backdrop-blur border border-foreground dark:border-background flex items-center justify-center rounded-full text-foreground dark:text-background hover:bg-foreground dark:hover:bg-background hover:text-background dark:hover:text-foreground transition-colors disabled:opacity-0 disabled:cursor-not-allowed hidden" aria-label="Next Page">
                            <span class="material-symbols-outlined text-lg">chevron_right</span>
                        </button>

                        ${activeCats.map(c => _renderResultCategory(c, catItems[c], idx)).join('')}
                    </div>
                </div>

                <!-- Right Side: Fashion Stylist Report -->
                <div class="collection-view ${idx === 0 ? 'flex' : 'hidden'} w-full lg:w-[65%] h-[60%] lg:h-full flex-col bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] overflow-y-auto p-6 lg:p-12 relative" data-collection-idx="${idx}">

                    <!-- Header: Outfit Title + Scoreboard (UNCHANGED) -->
                    <div class="flex flex-col xl:flex-row xl:items-end justify-between border-b-[2px] border-foreground dark:border-background pb-6 mb-10 gap-6">
                        <h2 class="font-sans font-extrabold text-4xl lg:text-5xl uppercase tracking-tighter leading-none text-brand">${col.name || 'Curated Look'}</h2>
                        
                        <!-- Dual Scoreboard -->
                        <div class="flex items-stretch gap-4 shrink-0">
                            <!-- Current Score -->
                            <div class="flex flex-col items-center justify-center px-4 py-3 border-[2px] border-foreground dark:border-background bg-background dark:bg-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                <span class="font-mono text-[9px] uppercase tracking-widest font-bold text-muted-foreground mb-1">YOUR BASE</span>
                                <span class="font-mono text-3xl font-black text-foreground dark:text-background current-score-val">${idx === 0 ? (col.currentScore || 70) : 0}</span>
                            </div>
                            <!-- Arrow -->
                            <div class="flex items-center justify-center text-brand">
                                <span class="material-symbols-outlined">arrow_forward</span>
                            </div>
                            <!-- Projected Score -->
                            <div class="flex flex-col items-center justify-center px-4 py-3 border-[2px] border-brand bg-brand shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] text-brand-foreground">
                                <span class="font-mono text-[9px] uppercase tracking-widest font-bold mb-1 opacity-80">PROJECTED</span>
                                <span class="font-mono text-3xl font-black projected-score-val">${idx === 0 ? (col.projectedScore || 90) : 0}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Offline banner (preserved) -->
                    ${col.isOffline ? `
                    <div class="border border-red-500/50 bg-red-500/5 p-6 flex flex-col relative shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] mb-8">
                        <span class="font-mono text-[10px] text-red-500 tracking-widest uppercase mb-2 block">OFFLINE MODE</span>
                        <h3 class="font-sans font-extrabold text-2xl uppercase tracking-tighter mb-4 leading-tight text-red-500">Styling Engine Unavailable</h3>
                        <p class="font-mono text-xs text-foreground/80 dark:text-background/80 leading-relaxed max-w-2xl">${col.offlineMsg || 'Could not connect to the styling engine. Showing base items only.'}</p>
                    </div>` : ''}

                    <!-- STYLIST REPORT SECTIONS -->
                    <!-- Each function renders its own section divider, content, and spacing. -->
                    ${renderCompletionSection(col)}
                    ${renderStylistNotes(col)}
                    ${renderAccessoryRecommendations(col)}
                    ${renderUpgradeRecommendations(col)}

                </div>
                `;
            });

            const splitLayoutHtml = `
            <!-- Top Nav -->
            <nav class="sticky top-0 z-50 flex items-baseline justify-between border-b border-foreground dark:border-background bg-background dark:bg-foreground px-6 py-4 shrink-0">
                <div class="font-mono text-xs font-bold tracking-tighter cursor-pointer" onclick="window.Router.navigate('/landing')">
                    FASHIONWARDROBE<sup class="ml-1 text-brand">®</sup>
                </div>
                <div class="flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest">
                    <span class="hidden sm:inline-block border border-foreground dark:border-background px-3 py-1 bg-brand text-brand-foreground font-bold">ANALYSIS COMPLETE</span>
                    <button class="transition-colors hover:text-brand flex items-center gap-2" aria-label="Replay Walkthrough" onclick="if(window.Walkthrough) window.Walkthrough.startResultsTour()" title="Replay Walkthrough">
                        <span class="material-symbols-outlined text-[14px]">help</span>
                    </button>
                    <button class="transition-colors hover:text-brand flex items-center gap-2" aria-label="Close" onclick="window.Router.navigate('/landing')">
                        <span class="material-symbols-outlined text-[14px]">close</span>
                    </button>
                </div>
            </nav>

            <!-- Collection Switcher -->
            <div class="flex w-full border-b border-foreground dark:border-background bg-background dark:bg-foreground shrink-0 overflow-x-auto no-scrollbar">
                ${tabsHtml}
            </div>

            <!-- Main Content -->
            <main class="flex-grow flex flex-col lg:flex-row border-b border-foreground dark:border-background h-full overflow-hidden">
                ${viewsHtml}
            </main>

            <!-- Bottom Bar -->
            <footer class="bg-background dark:bg-foreground flex flex-col md:flex-row items-stretch shrink-0 z-50 relative">
                <div class="flex-1 p-6 flex items-center justify-between md:justify-start gap-12 border-b md:border-b-0 md:border-r border-foreground dark:border-background">
                    <button class="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50 dark:text-background/50 hover:text-foreground dark:hover:text-background transition-colors flex items-center group" onclick="window.Router.navigate('/color')">
                        <span class="material-symbols-outlined text-[14px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span> BACK
                    </button>
                </div>
                <div class="flex-1 flex items-stretch">
                    <button class="flex-1 bg-background dark:bg-foreground text-foreground dark:text-background font-mono text-xs uppercase tracking-widest p-6 transition-all hover:bg-foreground/5 dark:hover:bg-background/5 border-r border-foreground dark:border-background flex items-center justify-center gap-3" onclick="Store.clearSession(); window.Router.navigate('/gender')">
                        <span class="material-symbols-outlined">restart_alt</span> Create New Look
                    </button>
                    <button id="save-look-btn" class="flex-1 bg-brand text-brand-foreground font-mono text-xs uppercase tracking-widest p-6 transition-all hover:opacity-90 flex items-center justify-center gap-3 group">
                        <span class="material-symbols-outlined group-hover:-translate-y-1 transition-transform">bookmark</span> Save Look
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

            // Initialize UI for first collection
            if (collections.length > 0) {
                if(window.ResultsPage && window.ResultsPage.switchCollection) {
                    window.ResultsPage.switchCollection(0);
                } else {
                    switchCollectionInternal(0);
                }
            }

            setTimeout(() => {
                if (!localStorage.getItem('fw_has_seen_results_tour')) {
                    localStorage.setItem('fw_has_seen_results_tour', 'true');
                    if (window.Walkthrough) window.Walkthrough.startResultsTour();
                }
            }, 1000);

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

            // Bind events
            document.getElementById('save-look-btn')?.addEventListener('click', () => {
                // Find active collection index
                let activeIdx = 0;
                document.querySelectorAll('.collection-tab').forEach((t, i) => {
                    if (t.classList.contains('border-brand')) activeIdx = i;
                });
                const col = collections[activeIdx];
                if (!col) return;

                const lookName = col.name || 'Curated Look';
                if (Store.isOutfitSaved(lookName)) { App.showToast('Outfit already saved'); return; }
                
                Store.saveOutfit({
                    name: lookName,
                    image: col.yourLook[0]?.image || '',
                    score: col.projectedScore,
                    currentScore: col.currentScore,
                    items: [
                        ...(col.yourLook || []).map(i => ({ ...i })),
                        ...(col.accessories || []).map(a => ({ ...a, category: a.category || 'accessories', isAccessory: true }))
                    ],
                    preferences: prefs
                });
                App.showToast('Look added to collection');
                const btn = document.getElementById('save-look-btn');
                if (btn) {
                    btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">bookmark_added</span> Saved';
                    btn.classList.remove('bg-brand', 'bg-foreground', 'dark:bg-background', 'text-brand-foreground', 'text-background', 'dark:text-foreground');
                    btn.classList.add('bg-foreground', 'dark:bg-background', 'text-background', 'dark:text-foreground');
                }
            });

        } catch (error) {
            clearInterval(elapsedInterval);
            clearTimeout(warmupTimeout);
            clearTimeout(timeoutWarningTimeout);
            document.removeEventListener('recommendation-progress', progressHandler);
            console.error('Results page error:', error);
            container.innerHTML = `
            <div class="flex-grow flex items-center justify-center border-b border-foreground dark:border-background h-full">
                <div class="flex flex-col items-center max-w-md text-center p-6">
                    <span class="material-symbols-outlined text-5xl text-red-500 mb-6">error</span>
                    <h2 class="font-sans font-extrabold text-2xl uppercase tracking-tighter mb-4">Analysis Failed</h2>
                    <p class="font-mono text-xs text-muted-foreground mb-8">The styling engine is temporarily unreachable.</p>
                    <button class="px-6 py-3 border-[2px] border-foreground dark:border-background font-mono text-xs uppercase tracking-widest hover:bg-foreground dark:hover:bg-background hover:text-background dark:hover:text-foreground transition-colors" onclick="ResultsPage._retryInit()">Try Again</button>
                </div>
            </div>`;
        }
    }

    function _retryInit() {
        const container = document.getElementById('results-wrapper');
        if(container) {
            container.innerHTML = render();
            init();
        }
    }

    function switchCollectionInternal(idx) {
        document.querySelectorAll('.collection-tab').forEach((t, i) => {
            if (i === idx) {
                t.classList.add('border-brand', 'text-brand');
                t.classList.remove('border-foreground/20', 'dark:border-background/20', 'text-muted-foreground');
                t.querySelector('.status-dot')?.classList.replace('bg-transparent', 'bg-brand');
            } else {
                t.classList.remove('border-brand', 'text-brand');
                t.classList.add('border-foreground/20', 'dark:border-background/20', 'text-muted-foreground');
                t.querySelector('.status-dot')?.classList.replace('bg-brand', 'bg-transparent');
            }
        });

        document.querySelectorAll('.collection-view').forEach((v) => {
            const viewIdx = parseInt(v.getAttribute('data-collection-idx'));
            if (viewIdx === idx) {
                v.classList.remove('hidden');
                v.classList.add('flex', 'active-collection');
                
                const firstCatTab = v.querySelector('.res-cat-link');
                if (firstCatTab) firstCatTab.click();
            } else {
                v.classList.add('hidden');
                v.classList.remove('flex', 'active-collection');
            }
        });

        const col = currentCollections[idx];
        if (col) {
            // Animate scores
            document.querySelectorAll(`.collection-view[data-collection-idx="${idx}"] .current-score-val`).forEach(el => animateScoreEl(el, col.currentScore || 70));
            document.querySelectorAll(`.collection-view[data-collection-idx="${idx}"] .projected-score-val`).forEach(el => animateScoreEl(el, col.projectedScore || 90));
        }

        const btn = document.getElementById('save-look-btn');
        if (col && btn) {
            const lookName = col.name || 'Curated Look';
            if (Store.isOutfitSaved(lookName)) {
                btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">bookmark_added</span> Saved';
                btn.classList.remove('bg-brand', 'bg-foreground', 'dark:bg-background', 'text-brand-foreground', 'text-background', 'dark:text-foreground');
                btn.classList.add('bg-foreground', 'dark:bg-background', 'text-background', 'dark:text-foreground');
            } else {
                btn.innerHTML = '<span class="material-symbols-outlined group-hover:-translate-y-1 transition-transform">bookmark</span> Save Look';
                btn.classList.remove('bg-brand', 'bg-foreground', 'dark:bg-background', 'text-brand-foreground', 'text-background', 'dark:text-foreground');
                btn.classList.add('bg-brand', 'text-brand-foreground');
            }
        }
    }

    return { 
        render, 
        init, 
        _retryInit, 
        activateCategory, 
        switchCollection: switchCollectionInternal
    };
})();

window.ResultsPage = ResultsPage;
