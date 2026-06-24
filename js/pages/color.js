/* ============================================
   FashionWardrobe — Color (Step 5)
   ============================================ */
const ColorPage = (() => {
    const standardColors = [
        { key: 'Black', hex: '#1A1A1A' },
        { key: 'Navy', hex: '#1C2841' },
        { key: 'Charcoal', hex: '#36454F' },
        { key: 'Beige', hex: '#E6DCC8' },
        { key: 'Olive', hex: '#4B5320' },
        { key: 'Brown', hex: '#5C4033' },
        { key: 'White', hex: '#F9F9F9' },
        { key: 'Burgundy', hex: '#630015' },
        { key: 'Red', hex: '#C62828' },
        { key: 'Pink', hex: '#F48FB1' },
        { key: 'Yellow', hex: '#FBC02D' },
        { key: 'Teal', hex: '#00838F' },
        { key: 'Purple', hex: '#6A1B9A' },
        { key: 'Grey', hex: '#9E9E9E' },
        { key: 'Green', hex: '#2E7D32' },
        { key: 'Blue', hex: '#1565C0' }
    ];

    const patterns = ['Solid', 'Striped', 'Checked', 'Printed', 'Textured'];

    function _getSelectedItems() {
        const outfit = Store.get('currentOutfit');
        const currentGender = Store.get('gender') || 'female';
        const occasions = Store.get('occasions') || [];
        const occasion = occasions.length > 0 ? occasions[0] : null;
        const styles = Store.get('stylePersonality') || [];

        if (!outfit) return [];
        const ids = [...(outfit.topwear || []), ...(outfit.outerwear || []), ...(outfit.bottomwear || []), ...(outfit.footwear || []), ...(outfit.accessories || [])];
        const allProducts = MockData.getProducts();

        return allProducts.filter(p => {
            if (!ids.includes(p.id)) return false;
            if (p.gender !== currentGender && p.gender !== 'unisex') return false;
            if (occasion && !p.occasions.includes(occasion)) return false;
            if (styles.length > 0 && !p.styles.some(s => styles.includes(s))) return false;
            return true;
        });
    }

    function render() {
        const selectedItems = _getSelectedItems();
        const savedItemColors = Store.get('itemColors') || {};

        let colorsSection = '';
        if (selectedItems.length === 0) {
            colorsSection = `
                <div class="text-center p-12 border border-foreground bg-background">
                    <span class="material-symbols-outlined text-[48px] text-muted mb-4">apparel</span>
                    <h3 class="font-sans font-extrabold uppercase tracking-tighter text-3xl mb-2 text-foreground">No items selected</h3>
                    <p class="font-mono text-xs text-muted uppercase tracking-widest">You didn't select any specific clothing items in the previous step. We'll generate a fully unexpected outfit for you!</p>
                </div>
            `;
        } else {
            let needsSave = false;
            selectedItems.forEach(item => {
                if (!savedItemColors[item.id] || typeof savedItemColors[item.id] !== 'object' || Array.isArray(savedItemColors[item.id])) {
                    savedItemColors[item.id] = { primary: 'Black', secondary: null, pattern: 'Solid', isCustomPrimary: false, isCustomSecondary: false };
                    needsSave = true;
                }
            });
            if (needsSave) Store.set('itemColors', savedItemColors);

            colorsSection = selectedItems.map(item => {
                let saved = savedItemColors[item.id];

                const getHexForVal = (val) => {
                    if (!val) return '#000000';
                    if (val.startsWith('#')) return val;
                    const swatch = standardColors.find(c => c.key === val);
                    return swatch ? swatch.hex : '#000000';
                };

                const generateSwatches = (type, selectedVal, isCustomActive) => {
                    let swatches = standardColors.map(c => {
                        const isSelected = !isCustomActive && selectedVal === c.key;
                        const bgStyle = `background-color: ${c.hex};`;
                        
                        return `
                        <button class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[2px] ${isSelected ? 'border-brand shadow-[0_20px_50px_rgba(0,0,0,0.3)]' : 'border-outline-variant/30 hover:border-foreground'} transition-all flex items-center justify-center group relative item-color-swatch" data-item-id="${item.id}" data-val="${c.key}" data-type="${type}" data-custom="false" style="${bgStyle}" title="${c.key}">
                            ${isSelected ? `<span class="material-symbols-outlined text-[20px] ${['White', 'Beige'].includes(c.key) ? 'text-foreground' : 'text-background'} drop-shadow-md">check</span>` : ''}
                            <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-mono tracking-widest uppercase">${c.key}</span>
                        </button>
                        `;
                    }).join('');

                    const customBg = isCustomActive ? selectedVal : 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)';
                    const defaultHex = getHexForVal(selectedVal);
                    
                    swatches += `
                        <div class="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[2px] ${isCustomActive ? 'border-brand shadow-[0_20px_50px_rgba(0,0,0,0.3)]' : 'border-outline-variant/30 hover:border-foreground'} transition-all group overflow-hidden custom-pickr-container" title="More Colors">
                            <div class="absolute inset-0 pointer-events-none custom-pickr-bg" style="background: ${customBg};"></div>
                            <div class="pickr-anchor absolute inset-0 opacity-0 cursor-pointer" data-item-id="${item.id}" data-type="${type}" data-default="${defaultHex}"></div>
                            ${isCustomActive ? `<div class="absolute inset-0 flex items-center justify-center pointer-events-none"><span class="material-symbols-outlined text-[20px] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">check</span></div>` : `<div class="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/20"><span class="material-symbols-outlined text-[18px] text-white drop-shadow-md">palette</span></div>`}
                            <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 font-mono tracking-widest uppercase">Custom</span>
                        </div>
                    `;
                    return swatches;
                };

                const patternHtml = patterns.map(p => `
                    <button class="px-6 py-3 border-[2px] text-xs font-mono tracking-widest transition-all uppercase pattern-btn ${saved.pattern === p ? 'bg-brand text-brand-foreground border-brand shadow-[0_20px_50px_rgba(0,0,0,0.3)]' : 'border-foreground hover:bg-foreground/5 text-foreground'}" data-item-id="${item.id}" data-pattern="${p}">${p}</button>
                `).join('');

                const showSecondary = saved.secondary !== null;
                const requiresMultipleColors = ['Striped', 'Checked', 'Printed'].includes(saved.pattern);
                const shouldShowSecondary = showSecondary || requiresMultipleColors;

                return `
                <div class="mb-12 border-[2px] border-foreground p-6 sm:p-10 configuration-block bg-background" data-item-id="${item.id}">
                    <div class="flex items-center gap-6 mb-8 pb-6 border-b border-foreground">
                        <img src="${item.image}" class="w-16 h-16 object-cover border-[2px] border-foreground" alt="${item.name}">
                        <div>
                            <h3 class="font-sans font-extrabold uppercase tracking-tighter text-2xl lg:text-3xl text-foreground">${item.name}</h3>
                            <p class="font-mono text-[10px] text-brand uppercase tracking-widest">${item.category}</p>
                        </div>
                    </div>
                    
                    <div class="mb-10">
                        <p class="font-mono text-xs text-muted tracking-[0.3em] uppercase mb-4">PRIMARY COLOR *</p>
                        <div class="flex flex-wrap gap-4">
                            ${generateSwatches('primary', saved.primary, saved.isCustomPrimary)}
                        </div>
                    </div>

                    ${['topwear', 'outerwear', 'bottomwear'].includes(item.category) ? (shouldShowSecondary ? `
                    <div class="mb-10 secondary-color-section">
                        <div class="flex justify-between items-center mb-4 max-w-[400px]">
                            <p class="font-mono text-xs text-muted tracking-[0.3em] uppercase">SECONDARY COLOR</p>
                            ${!requiresMultipleColors ? `<button class="text-[10px] text-brand font-mono tracking-widest uppercase hover:text-foreground remove-secondary-btn" data-item-id="${item.id}">Remove</button>` : `<span class="text-[10px] text-muted font-mono tracking-widest uppercase">Required for ${saved.pattern}</span>`}
                        </div>
                        <div class="flex flex-wrap gap-4">
                            ${generateSwatches('secondary', saved.secondary || 'White', saved.isCustomSecondary)}
                        </div>
                    </div>
                    ` : `
                    <div class="mb-10">
                        <button class="font-mono text-xs tracking-[0.3em] uppercase text-foreground hover:bg-foreground hover:text-background px-6 py-3 border-[2px] border-foreground transition-colors flex items-center gap-3 add-secondary-btn" data-item-id="${item.id}">
                            <span class="material-symbols-outlined text-[16px]">add</span> ADD SECONDARY COLOR
                        </button>
                    </div>
                    `) : ''}

                    ${['topwear', 'bottomwear'].includes(item.category) ? `
                    <div>
                        <p class="font-mono text-xs text-muted tracking-[0.3em] uppercase mb-4">PATTERN</p>
                        <div class="flex flex-wrap gap-3">
                            ${patternHtml}
                        </div>
                    </div>
                    ` : ''}
                </div>
                `;
            }).join('');
        }

        return `
<div class="h-screen w-screen bg-background text-foreground flex flex-col selection:bg-brand selection:text-brand-foreground overflow-hidden">
    <!-- Top Nav -->
    <nav class="sticky top-0 z-50 flex items-baseline justify-between border-b border-foreground bg-background px-6 py-4">
        <div class="font-mono text-xs font-bold tracking-tighter cursor-pointer" onclick="window.Router.navigate('/landing')">
            FASHIONWARDROBE<sup class="ml-1 text-brand">®</sup>
        </div>
        <div class="flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest">
            <span class="hidden sm:inline-block border border-foreground px-3 py-1">INDEX 05 / 06</span>
            <button class="transition-colors hover:text-brand flex items-center gap-2" onclick="if(window.Walkthrough) window.Walkthrough.startColorTour()" title="Replay Walkthrough">
                <span class="material-symbols-outlined text-[14px]">help</span>
            </button>
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
                <span class="font-mono text-[10px] uppercase tracking-[0.3em] text-brand mb-2 lg:mb-4 block">Step 05 / 06</span>
                <h1 class="text-3xl lg:text-[clamp(2.5rem,4vw,4.5rem)] font-extrabold uppercase leading-[0.85] tracking-tighter font-sans antialiased mb-2 lg:mb-6">
                    Define<br>
                    <span class="text-brand">Canvas</span>
                </h1>
                <div class="flex gap-4 items-start mb-12">
                    <div class="w-1 h-full bg-foreground/10 flex-shrink-0 mt-2"></div>
                    <p class="font-mono text-[10px] lg:text-xs leading-relaxed text-muted max-w-sm uppercase tracking-widest hidden sm:block">
                        Select colors and patterns for your selected pieces.
                    </p>
                </div>
            </div>
        </div>
            
        <!-- Right Side: Configs -->
        <div id="color-scroll-area" class="w-full lg:w-[65%] h-[70%] lg:h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] overflow-y-auto p-4 lg:p-12">
                
                <section class="mb-16">
                    <div class="flex flex-col">
                        ${colorsSection}
                    </div>
                </section>

            </div>
    </main>

    <!-- Bottom Bar -->
    <footer class="bg-background flex flex-col md:flex-row items-stretch border-t border-foreground shrink-0 z-50">
        <div class="flex-1 p-6 flex items-center justify-between md:justify-start gap-12 border-b md:border-b-0 md:border-r border-foreground">
            <button class="font-mono text-[10px] uppercase tracking-[0.3em] text-muted hover:text-foreground transition-colors flex items-center group" onclick="window.Router.navigate('/outfit')">
                <span class="material-symbols-outlined text-[14px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span> BACK
            </button>
        </div>
        <button id="continue-btn" class="flex-1 bg-brand text-brand-foreground font-mono text-xs uppercase tracking-widest p-6 transition-all hover:opacity-90 group flex items-center justify-center gap-4">
            Finish & Curate
            <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">auto_awesome</span>
        </button>
    </footer>
</div>`;
    }

    function _initItemState(itemId) {
        const itemColors = Store.get('itemColors') || {};
        if (!itemColors[itemId] || typeof itemColors[itemId] !== 'object' || Array.isArray(itemColors[itemId])) {
            itemColors[itemId] = { primary: 'Black', secondary: null, pattern: 'Solid', isCustomPrimary: false, isCustomSecondary: false };
        }
        return { itemColors, state: itemColors[itemId] };
    }

    function _updateStateAndRender(itemColors) {
        Store.set('itemColors', itemColors);
        const scrollContainer = document.getElementById('color-scroll-area');
        const scrollPos = scrollContainer ? scrollContainer.scrollTop : 0;
        
        document.getElementById('app').innerHTML = render();
        init();
        
        const newScrollContainer = document.getElementById('color-scroll-area');
        if (newScrollContainer) {
            newScrollContainer.scrollTop = scrollPos;
        }
    }

    function init() {
        setTimeout(() => {
            if (!localStorage.getItem('fw_has_seen_color_tour')) {
                localStorage.setItem('fw_has_seen_color_tour', 'true');
                if (window.Walkthrough) window.Walkthrough.startColorTour();
            }
        }, 500);

        // Destroy old pickers to prevent memory leaks
        if (window.activePickers) {
            window.activePickers.forEach(p => p.destroyAndRemove());
        }
        window.activePickers = [];

        // Standard swatch click
        document.querySelectorAll('.item-color-swatch').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.itemId;
                const val = btn.dataset.val;
                const type = btn.dataset.type; // primary or secondary
                
                const { itemColors, state } = _initItemState(itemId);
                state[type] = val;
                if(type === 'primary') state.isCustomPrimary = false;
                if(type === 'secondary') state.isCustomSecondary = false;
                
                _updateStateAndRender(itemColors);
            });
        });

        // Pickr Custom Color instantiation
        document.querySelectorAll('.pickr-anchor').forEach(anchor => {
            const itemId = anchor.dataset.itemId;
            const type = anchor.dataset.type;
            const defaultHex = anchor.dataset.default;

            const pickr = Pickr.create({
                el: anchor,
                useAsButton: true,
                theme: 'nano',
                default: defaultHex,
                components: {
                    preview: true,
                    opacity: false,
                    hue: true,
                    interaction: {
                        hex: true,
                        input: true,
                        clear: false,
                        save: true
                    }
                }
            });

            pickr.on('change', (color) => {
                const hex = color.toHEXA().toString();
                const parentDiv = anchor.closest('.custom-pickr-container').querySelector('.custom-pickr-bg');
                if (parentDiv) {
                    parentDiv.style.background = hex;
                }
            });

            pickr.on('save', (color) => {
                const hex = color.toHEXA().toString();
                pickr.hide();
                
                const { itemColors, state } = _initItemState(itemId);
                state[type] = hex;
                if(type === 'primary') state.isCustomPrimary = true;
                if(type === 'secondary') state.isCustomSecondary = true;
                
                _updateStateAndRender(itemColors);
            });

            window.activePickers.push(pickr);
        });

        // Add secondary color
        document.querySelectorAll('.add-secondary-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.itemId;
                const { itemColors, state } = _initItemState(itemId);
                state.secondary = 'White'; // Default
                state.isCustomSecondary = false;
                
                _updateStateAndRender(itemColors);
            });
        });

        // Remove secondary color
        document.querySelectorAll('.remove-secondary-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.itemId;
                const { itemColors, state } = _initItemState(itemId);
                state.secondary = null;
                state.isCustomSecondary = false;
                
                _updateStateAndRender(itemColors);
            });
        });

        // Pattern selection
        document.querySelectorAll('.pattern-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.itemId;
                const pattern = btn.dataset.pattern;
                const { itemColors, state } = _initItemState(itemId);
                
                state.pattern = pattern;
                
                // Smart logic: Auto-add secondary color if multi-color pattern is chosen
                const requiresMultiple = ['Striped', 'Checked', 'Printed'].includes(pattern);
                if (requiresMultiple && !state.secondary) {
                    state.secondary = 'White';
                    state.isCustomSecondary = false;
                }
                
                _updateStateAndRender(itemColors);
            });
        });



        document.getElementById('continue-btn')?.addEventListener('click', () => Router.navigate('/results'));
    }

    return { render, init };
})();
window.ColorPage = ColorPage;
