/* ============================================
   FashionWardrobe — Color & Budget (Step 5-6)
   ============================================ */
const ColorBudgetPage = (() => {
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

    const budgets = [
        { key: 'Budget', label: 'Budget', icon: 'payments', tier: '$', desc: 'Curated high-street essentials that prioritize value without compromising on the modern silhouette.' },
        { key: 'Mid-range', label: 'Mid-range', icon: 'diamond', tier: '$$', desc: 'Premium contemporary brands focusing on sustainable materials and superior craftsmanship.' },
        { key: 'Premium', label: 'Premium', icon: 'auto_awesome', tier: '$$$', desc: 'Luxury maison collections and bespoke pieces tailored for an uncompromising sartorial statement.' }
    ];

    function _getSelectedItems() {
        const outfit = Store.get('currentOutfit');
        const currentGender = Store.get('gender') || 'unisex';
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
        let savedBudget = Store.get('budget');
        if (!savedBudget) {
            savedBudget = 'Mid-range';
            Store.set('budget', savedBudget);
        }

        let colorsSection = '';
        if (selectedItems.length === 0) {
            colorsSection = `
                <div class="text-center p-8 bg-surface-container rounded-xl border border-outline-variant/30">
                    <span class="material-symbols-outlined text-[48px] text-secondary mb-4">apparel</span>
                    <h3 class="font-headline-md text-[20px] mb-2 text-primary">No items selected</h3>
                    <p class="text-secondary font-body-md text-[14px]">You didn't select any specific clothing items in the previous step. We'll generate a fully unexpected outfit for you!</p>
                </div>
            `;
        } else {
            // Auto-save defaults for any unconfigured items
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
                    if (val.startsWith('#')) return val; // custom hex
                    const swatch = standardColors.find(c => c.key === val);
                    return swatch ? swatch.hex : '#000000';
                };

                const generateSwatches = (type, selectedVal, isCustomActive) => {
                    let swatches = standardColors.map(c => {
                        const isSelected = !isCustomActive && selectedVal === c.key;
                        const bgStyle = `background-color: ${c.hex}; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);`;
                        
                        return `
                        <button class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${isSelected ? 'border-primary ring-4 ring-primary/20 scale-110' : 'border-outline-variant/30 hover:scale-105'} transition-all flex items-center justify-center group relative item-color-swatch" data-item-id="${item.id}" data-val="${c.key}" data-type="${type}" data-custom="false" style="${bgStyle}" title="${c.key}">
                            ${isSelected ? `<span class="material-symbols-outlined text-[20px] ${['White', 'Beige'].includes(c.key) ? 'text-primary' : 'text-white'} drop-shadow-md">check</span>` : ''}
                            <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">${c.key}</span>
                        </button>
                        `;
                    }).join('');

                    // Add Custom Pickr trigger
                    const customBg = isCustomActive ? selectedVal : 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)';
                    const defaultHex = getHexForVal(selectedVal);
                    
                    swatches += `
                        <div class="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${isCustomActive ? 'border-primary ring-4 ring-primary/20 scale-110' : 'border-outline-variant/30 hover:scale-105'} transition-all group overflow-hidden custom-pickr-container" title="More Colors">
                            <div class="absolute inset-0 pointer-events-none custom-pickr-bg" style="background: ${customBg}; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);"></div>
                            <div class="pickr-anchor absolute inset-0 opacity-0 cursor-pointer" data-item-id="${item.id}" data-type="${type}" data-default="${defaultHex}"></div>
                            ${isCustomActive ? `<div class="absolute inset-0 flex items-center justify-center pointer-events-none"><span class="material-symbols-outlined text-[20px] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">check</span></div>` : `<div class="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/20"><span class="material-symbols-outlined text-[18px] text-white drop-shadow-md">palette</span></div>`}
                            <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">Custom</span>
                        </div>
                    `;
                    return swatches;
                };

                const patternHtml = patterns.map(p => `
                    <button class="px-4 py-2 rounded-full border border-outline-variant/30 text-[12px] font-label-caps tracking-widest transition-all hover:bg-surface-container-low pattern-btn ${saved.pattern === p ? 'bg-primary text-on-primary border-primary hover:bg-primary' : 'text-secondary'}" data-item-id="${item.id}" data-pattern="${p}">${p}</button>
                `).join('');

                const showSecondary = saved.secondary !== null;
                const requiresMultipleColors = ['Striped', 'Checked', 'Printed'].includes(saved.pattern);
                
                // If it requires multiple colors, and secondary is null, we should maybe auto-initialize it, but we handle that in init(). 
                // For rendering, if requiresMultipleColors is true, we force show the secondary section.
                const shouldShowSecondary = showSecondary || requiresMultipleColors;

                return `
                <div class="mb-12 last:mb-0 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm configuration-block" data-item-id="${item.id}">
                    <div class="flex items-center gap-4 mb-6 pb-4 border-b border-outline-variant/20">
                        <img src="${item.image}" class="w-12 h-12 object-cover rounded-md" alt="${item.name}">
                        <div>
                            <h3 class="font-headline-md text-[18px] text-primary">${item.name}</h3>
                            <p class="font-label-caps text-[10px] text-secondary uppercase">${item.category}</p>
                        </div>
                    </div>
                    
                    <div class="mb-8">
                        <p class="font-label-caps text-[11px] text-primary tracking-widest mb-3">PRIMARY COLOR *</p>
                        <div class="flex flex-wrap gap-3">
                            ${generateSwatches('primary', saved.primary, saved.isCustomPrimary)}
                        </div>
                    </div>

                    ${['topwear', 'outerwear', 'bottomwear'].includes(item.category) ? (shouldShowSecondary ? `
                    <div class="mb-8 secondary-color-section">
                        <div class="flex justify-between items-center mb-3 max-w-[400px]">
                            <p class="font-label-caps text-[11px] text-secondary tracking-widest">SECONDARY COLOR</p>
                            ${!requiresMultipleColors ? `<button class="text-[10px] text-primary underline remove-secondary-btn" data-item-id="${item.id}">Remove</button>` : `<span class="text-[10px] text-secondary italic">Required for ${saved.pattern}</span>`}
                        </div>
                        <div class="flex flex-wrap gap-3">
                            ${generateSwatches('secondary', saved.secondary || 'White', saved.isCustomSecondary)}
                        </div>
                    </div>
                    ` : `
                    <div class="mb-8">
                        <button class="font-label-caps text-[11px] tracking-widest text-primary hover:bg-primary/5 px-4 py-2 rounded-full border border-primary/30 transition-colors flex items-center gap-2 add-secondary-btn" data-item-id="${item.id}">
                            <span class="material-symbols-outlined text-[14px]">add</span> ADD SECONDARY COLOR
                        </button>
                    </div>
                    `) : ''}

                    ${['topwear', 'bottomwear'].includes(item.category) ? `
                    <div>
                        <p class="font-label-caps text-[11px] text-primary tracking-widest mb-3">PATTERN</p>
                        <div class="flex flex-wrap gap-2">
                            ${patternHtml}
                        </div>
                    </div>
                    ` : ''}
                </div>
                `;
            }).join('');
        }

        const budgetHtml = budgets.map(b => `
            <button class="budget-card group text-left glass-panel p-gutter rounded-xl selection-glow transition-all ${savedBudget === b.key ? 'active-card' : ''}" data-budget="${b.key}">
                <div class="flex justify-between mb-8">
                    <span class="material-symbols-outlined text-[32px] text-secondary group-hover:text-primary transition-colors">${b.icon}</span>
                    <span class="font-label-caps text-label-caps text-outline-variant">${b.tier}</span>
                </div>
                <h3 class="font-headline-md text-headline-md mb-2">${b.label}</h3>
                <p class="font-body-md text-body-md text-secondary">${b.desc}</p>
            </button>
        `).join('');

        return `
<header class="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-surface-container-highest px-4 sm:px-6 md:px-10 lg:px-16 py-4">
    <div class="flex justify-between items-center max-w-[1440px] mx-auto w-full gap-4">
        <span class="font-display-lg text-[18px] sm:text-[20px] uppercase tracking-[0.2em] text-primary cursor-pointer transition-opacity hover:opacity-70" onclick="Router.navigate('/landing')">FASHIONWARDROBE</span>
        <div class="flex items-center gap-4 sm:gap-6">
            <div class="hidden sm:flex items-center gap-2 bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/30">
                <span class="font-label-caps text-primary text-[10px] tracking-[0.15em]">STEP 5-6 OF 7</span>
            </div>
            <button class="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30 text-primary group" onclick="Router.navigate('/landing')">
                <span class="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform duration-300">close</span>
            </button>
        </div>
    </div>
    <div class="absolute bottom-0 left-0 w-full bg-surface-container-highest h-[3px] overflow-hidden">
        <div class="progress-bar-fill bg-gradient-to-r from-primary to-primary/70 h-full shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-1000 ease-out" style="width: 85.7%;"></div>
    </div>
</header>
<main class="flex-grow px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl mx-auto w-full pt-[100px] pb-32 md:pb-40">
    <section class="text-center mb-10 lg:mb-12 w-full">
        <h1 class="font-['Playfair_Display'] font-medium text-primary text-[36px] lg:text-[48px] leading-tight tracking-tight mb-2">Define Your <span class="italic font-light">Canvas</span>.</h1>
        <p class="font-['Inter'] text-[14px] lg:text-[15px] text-secondary max-w-[500px] mx-auto font-light">Select colors and patterns for your selected pieces, and set your investment range.</p>
    </section>
    
    <section class="mb-16 md:mb-24">
        <div class="flex items-center gap-4 mb-8">
            <span class="font-label-caps text-[11px] text-primary tracking-widest">SECTION 01</span>
            <div class="h-[1px] flex-grow bg-outline-variant/30"></div>
            <h2 class="font-headline-md text-[20px]">Item Configurations</h2>
        </div>
        <div class="flex flex-col gap-4">
            ${colorsSection}
        </div>
    </section>

    <section>
        <div class="flex items-center gap-4 mb-8">
            <span class="font-label-caps text-[11px] text-primary tracking-widest">SECTION 02</span>
            <div class="h-[1px] flex-grow bg-outline-variant/30"></div>
            <h2 class="font-headline-md text-[20px]">Investment Level</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">${budgetHtml}</div>
    </section>
</main>
<footer class="fixed bottom-0 left-0 w-full z-40 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-0" id="floating-footer">
    <div class="bg-white/70 backdrop-blur-2xl border-t border-surface-container-highest shadow-[0_-10px_40px_rgba(0,0,0,0.05)] py-4 sm:py-6 px-4 sm:px-6 md:px-10 lg:px-16">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <button class="w-full sm:w-auto font-button text-[12px] tracking-[0.15em] text-secondary hover:text-primary transition-colors flex items-center justify-center group" onclick="Router.navigate('/outfit')">
                <span class="material-symbols-outlined text-[16px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span> BACK
            </button>
            <button class="w-full sm:w-auto bg-primary text-on-primary font-button px-12 py-4 uppercase tracking-[0.15em] transition-all duration-500 hover:bg-tertiary-container whitespace-nowrap group flex items-center justify-center" id="continue-btn">
                Finish & Match
                <span class="material-symbols-outlined text-[16px] inline-block ml-3 group-hover:rotate-12 transition-transform">auto_awesome</span>
            </button>
        </div>
    </div>
</footer>`;
    }

    function _initItemState(itemId) {
        const itemColors = Store.get('itemColors') || {};
        if (!itemColors[itemId] || typeof itemColors[itemId] !== 'object' || Array.isArray(itemColors[itemId])) {
            itemColors[itemId] = { primary: 'Black', secondary: null, pattern: 'Solid', isCustomPrimary: false, isCustomSecondary: false };
        }
        return { itemColors, state: itemColors[itemId] };
    }

    function init() {
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
                
                Store.set('itemColors', itemColors);
                document.getElementById('app').innerHTML = render();
                init();
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
                
                Store.set('itemColors', itemColors);
                document.getElementById('app').innerHTML = render();
                init();
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
                
                Store.set('itemColors', itemColors);
                document.getElementById('app').innerHTML = render();
                init();
            });
        });

        // Remove secondary color
        document.querySelectorAll('.remove-secondary-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.itemId;
                const { itemColors, state } = _initItemState(itemId);
                state.secondary = null;
                state.isCustomSecondary = false;
                
                Store.set('itemColors', itemColors);
                document.getElementById('app').innerHTML = render();
                init();
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
                
                Store.set('itemColors', itemColors);
                document.getElementById('app').innerHTML = render();
                init();
            });
        });

        // Budget selection
        document.querySelectorAll('.budget-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.budget-card').forEach(c => c.classList.remove('active-card'));
                card.classList.add('active-card');
                Store.set('budget', card.dataset.budget);
            });
        });

        document.getElementById('continue-btn')?.addEventListener('click', () => Router.navigate('/results'));
    }

    return { render, init };
})();
