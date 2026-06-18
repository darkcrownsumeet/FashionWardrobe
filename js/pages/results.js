/* ============================================
   FashionWardrobe — AI Match Results (V5 — Editorial & Share)
   ============================================ */
const ResultsPage = (() => {

    function render() {
        return `
<header class="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-surface-container-highest px-4 sm:px-6 md:px-10 lg:px-16 py-4">
    <div class="flex justify-between items-center max-w-[1440px] mx-auto w-full gap-4">
        <span class="font-display-lg text-[18px] sm:text-[20px] uppercase tracking-[0.2em] text-primary cursor-pointer transition-opacity hover:opacity-70" onclick="Router.navigate('/landing')">FASHIONWARDROBE</span>
        <div class="flex items-center gap-4 sm:gap-6">
            <div class="hidden sm:flex items-center gap-2 bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/30">
                <span class="font-label-caps text-primary text-[10px] tracking-[0.15em]">STEP 7 OF 7</span>
            </div>
            <button class="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30 text-primary group" onclick="Router.navigate('/landing')">
                <span class="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform duration-300">close</span>
            </button>
        </div>
    </div>
    <div class="absolute bottom-0 left-0 w-full bg-surface-container-highest h-[3px] overflow-hidden">
        <div class="progress-bar-fill bg-gradient-to-r from-primary to-primary/70 h-full shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-1000 ease-out" style="width: 100%;"></div>
    </div>
</header>

<main class="w-full min-h-screen bg-surface pt-[100px]" id="results-container">
    <!-- Immersive Loading State (Light Theme) -->
    <div class="min-h-[80vh] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div class="relative z-10 flex flex-col items-center">
            <!-- Animated Frame -->
            <div class="w-64 h-80 glass-panel border border-outline-variant/30 relative overflow-hidden mb-8 shadow-xl rounded-2xl flex items-center justify-center">
                <!-- Scanning line -->
                <div class="absolute top-0 left-0 w-full h-1 bg-primary/20 shadow-[0_0_15px_rgba(0,0,0,0.1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                <!-- Inner icon -->
                <span class="material-symbols-outlined text-[48px] text-primary/30 animate-pulse">auto_awesome</span>
            </div>
            
            <div class="h-[60px] flex items-center justify-center">
                <h2 class="font-headline-lg text-[28px] tracking-wide text-primary" id="loading-text">Analyzing style DNA...</h2>
            </div>
            
            <div class="flex gap-3 mt-6">
                <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay:0s"></div>
                <div class="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style="animation-delay:0.2s"></div>
                <div class="w-2 h-2 bg-primary/30 rounded-full animate-bounce" style="animation-delay:0.4s"></div>
            </div>
        </div>
    </div>
</main>

<style>
@keyframes scan {
    0% { transform: translateY(-10px); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(320px); opacity: 0; }
}
@keyframes scaleBounce {
    0% { transform: scale(1); }
    40% { transform: scale(0.85); }
    80% { transform: scale(1.1); }
    100% { transform: scale(1); }
}
</style>`;
    }

    function _buildAccessoryCard(item) {
        return `
        <div class="group cursor-pointer flex flex-col h-full glass-panel rounded-2xl overflow-hidden transition-all hover:shadow-lg">
            <div class="relative overflow-hidden aspect-[3/4] bg-surface-container">
                <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='https://image.pollinations.ai/prompt/${encodeURIComponent(item.name + ' fashion item')}?width=400&height=500&nologo=true'"/>
                <button class="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white wishlist-btn" data-item='${JSON.stringify({id: item.name.replace(/\\s+/g,'-').toLowerCase() + '-' + Date.now(), name: item.name, image: item.image, price: item.price, category: item.category}).replace(/'/g, "&#39;")}'>
                    <span class="material-symbols-outlined text-red-500 text-[20px]">favorite_border</span>
                </button>
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <div class="flex justify-between items-start gap-2 mb-3">
                    <div>
                        <p class="font-label-caps text-[9px] text-secondary tracking-widest mb-1">${(item.category || 'ACCESSORY').toUpperCase()}</p>
                        <h4 class="font-headline-md text-[16px] text-primary leading-tight mb-1">${item.name}</h4>
                        ${item.description ? `<p class="font-body-md text-[12px] text-secondary leading-snug">${item.description}</p>` : ''}
                    </div>
                    <span class="font-body-md text-primary font-semibold text-[15px] flex-shrink-0">$${item.price}</span>
                </div>
                ${item.why ? `<div class="mt-auto pt-4 border-t border-outline-variant/30">
                    <p class="text-[12px] font-body-md text-secondary leading-relaxed"><span class="font-semibold text-primary">Why it works:</span> ${item.why}</p>
                </div>` : ''}
                ${item.colors ? `
                <div class="mt-4 pt-3 border-t border-outline-variant/30 flex flex-col gap-2">
                    <div class="flex items-start gap-2">
                        <span class="material-symbols-outlined text-[#34A853] text-[14px] mt-0.5" style="font-variation-settings:'FILL' 1;">check_circle</span>
                        <p class="text-[11px] font-body-md text-secondary"><span class="font-semibold text-primary">Pairs with:</span> ${(item.colors.match || []).join(', ')}</p>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="material-symbols-outlined text-red-400 text-[14px] mt-0.5" style="font-variation-settings:'FILL' 1;">cancel</span>
                        <p class="text-[11px] font-body-md text-secondary"><span class="font-semibold text-primary">Avoid:</span> ${(item.colors.avoid || []).join(', ')}</p>
                    </div>
                </div>` : ''}
            </div>
            <a href="${item.affiliateUrl || '#'}" target="_blank" class="block w-full py-4 bg-surface-container hover:bg-primary hover:text-on-primary transition-colors text-primary font-button text-[11px] uppercase text-center border-t border-outline-variant/30">Shop This Piece</a>
        </div>`;
    }

    function _buildClashSection(clashes) {
        if (!clashes || clashes.length === 0) return '';
        const clashCards = clashes.map(clash => {
            const isColor = clash.type === 'color_clash';
            const icon = isColor ? 'palette' : 'warning';
            const label = isColor ? 'COLOR CLASH' : 'STYLE CONFLICT';
            const bgClass = isColor ? 'border-amber-300 bg-amber-50' : 'border-red-200 bg-red-50';
            const iconColor = isColor ? 'text-amber-600' : 'text-red-500';
            const conflicting = (clash.conflicting || []).join(' + ');
            return `
            <div class="${bgClass} border ${isColor ? 'border-amber-200' : 'border-red-200'} rounded-2xl p-5 lg:p-6 shadow-sm">
                <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span class="material-symbols-outlined ${iconColor} text-[20px]">${icon}</span>
                    </div>
                    <div class="flex-grow">
                        <span class="font-label-caps text-[10px] ${iconColor} tracking-widest mb-2 block">${label}</span>
                        <p class="font-headline-md text-[16px] text-primary mb-1"><strong>${conflicting}</strong></p>
                        <p class="font-body-md text-[14px] text-secondary leading-relaxed mb-4">${clash.reason}</p>
                        <div class="flex items-start gap-3 bg-white/50 rounded-xl p-4 border border-black/5">
                            <span class="material-symbols-outlined text-primary text-[18px] mt-0.5" style="font-variation-settings:'FILL' 1;">tips_and_updates</span>
                            <p class="font-body-md text-[13.5px] text-primary">${clash.tip}</p>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');

        return `
        <div class="mb-10 w-full reveal-section">
            <div class="flex items-center gap-3 mb-4">
                <span class="material-symbols-outlined text-red-500 text-[20px]">error</span>
                <h2 class="font-label-caps text-label-caps text-primary">STYLE ADVISOR</h2>
            </div>
            <div class="flex flex-col gap-4">${clashCards}</div>
        </div>`;
    }

    function _buildDualScenario(scenarioA, scenarioB) {
        return `
        <div class="reveal-section">
            <div class="flex items-center justify-between mb-6">
                <h3 class="font-headline-lg text-[22px] text-primary">Two Paths Forward</h3>
                <span class="font-label-caps text-[10px] text-secondary bg-surface-container px-3 py-1 border border-outline-variant/30">AI CURATED ALTERNATIVES</span>
            </div>

            <!-- Tab Switcher -->
            <div class="flex gap-2 w-full mb-8 bg-surface-container p-1 rounded-full border border-outline-variant/30">
                <button id="tab-a" onclick="ResultsPage.switchTab('A')" class="flex-1 px-4 py-2.5 rounded-full font-label-caps text-[11px] tracking-widest transition-all bg-primary text-on-primary shadow-sm">
                    OPTION A: ${scenarioA.keep ? 'KEEP ' + scenarioA.keep.split(' ')[0].toUpperCase() : 'FIRST PATH'}
                </button>
                <button id="tab-b" onclick="ResultsPage.switchTab('B')" class="flex-1 px-4 py-2.5 rounded-full font-label-caps text-[11px] tracking-widest transition-all text-secondary hover:bg-black/5">
                    OPTION B: ${scenarioB.keep ? 'KEEP ' + scenarioB.keep.split(' ')[0].toUpperCase() : 'SECOND PATH'}
                </button>
            </div>

            <!-- Scenario A -->
            <div id="scenario-a">
                <div class="flex flex-wrap items-center gap-3 mb-6">
                    <span class="inline-flex items-center gap-2 px-3 py-1 bg-black text-white font-label-caps text-[10px]">
                        <span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1;">check_circle</span> KEEP ${(scenarioA.keep || '').toUpperCase()}
                    </span>
                    <span class="inline-flex items-center gap-2 px-3 py-1 border border-black text-black font-label-caps text-[10px]">
                        <span class="material-symbols-outlined text-[14px]">remove_circle</span> DROP ${(scenarioA.drop || '').toUpperCase()}
                    </span>
                    <span class="font-label-caps text-[11px] text-secondary ml-auto hidden sm:block">${scenarioA.label || ''}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${(scenarioA.accessories || []).map(_buildAccessoryCard).join('')}
                </div>
            </div>

            <!-- Scenario B -->
            <div id="scenario-b" class="hidden">
                <div class="flex flex-wrap items-center gap-3 mb-6">
                    <span class="inline-flex items-center gap-2 px-3 py-1 bg-black text-white font-label-caps text-[10px]">
                        <span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1;">check_circle</span> KEEP ${(scenarioB.keep || '').toUpperCase()}
                    </span>
                    <span class="inline-flex items-center gap-2 px-3 py-1 border border-black text-black font-label-caps text-[10px]">
                        <span class="material-symbols-outlined text-[14px]">remove_circle</span> DROP ${(scenarioB.drop || '').toUpperCase()}
                    </span>
                    <span class="font-label-caps text-[11px] text-secondary ml-auto hidden sm:block">${scenarioB.label || ''}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${(scenarioB.accessories || []).map(_buildAccessoryCard).join('')}
                </div>
            </div>
        </div>`;
    }

    function switchTab(tab) {
        const a = document.getElementById('scenario-a');
        const b = document.getElementById('scenario-b');
        const tabA = document.getElementById('tab-a');
        const tabB = document.getElementById('tab-b');
        if (tab === 'A') {
            a?.classList.remove('hidden'); b?.classList.add('hidden');
            tabA?.classList.replace('text-secondary', 'bg-primary');
            tabA?.classList.add('text-on-primary', 'shadow-sm');
            tabA?.classList.remove('hover:bg-black/5');
            tabB?.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
            tabB?.classList.add('text-secondary', 'hover:bg-black/5');
        } else {
            b?.classList.remove('hidden'); a?.classList.add('hidden');
            tabB?.classList.replace('text-secondary', 'bg-primary');
            tabB?.classList.add('text-on-primary', 'shadow-sm');
            tabB?.classList.remove('hover:bg-black/5');
            tabA?.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
            tabA?.classList.add('text-secondary', 'hover:bg-black/5');
        }
    }

    async function init() {
        const prefs = Store.getAll();
        
        // Decode URL hash state if present (Share Look feature)
        const queryStr = window.location.hash.split('?')[1] || '';
        const urlParams = new URLSearchParams(queryStr);
        const shareData = urlParams.get('data');
        if (shareData) {
            try {
                const binStr = atob(shareData);
                const bytes = new Uint8Array(binStr.length);
                for (let i = 0; i < binStr.length; i++) { bytes[i] = binStr.charCodeAt(i); }
                const decodedText = new TextDecoder().decode(bytes);
                const decoded = JSON.parse(decodedText);
                Object.keys(decoded).forEach(k => Store.set(k, decoded[k]));
                // Re-fetch prefs after decode
                Object.assign(prefs, decoded);
                // Clean URL
                window.history.replaceState(null, '', window.location.pathname + '#/results');
            } catch (e) { console.error("Failed to decode shared look", e); }
        }

        const container = document.getElementById('results-container');
        
        // Cycle loading messages
        const messages = ["Analyzing style DNA...", "Checking color harmony...", "Generating complementary pieces...", "Building your look..."];
        let msgIndex = 0;
        const msgInterval = setInterval(() => {
            const el = document.getElementById('loading-text');
            if (el) {
                msgIndex = (msgIndex + 1) % messages.length;
                el.style.opacity = 0;
                setTimeout(() => {
                    el.textContent = messages[msgIndex];
                    el.style.opacity = 1;
                }, 300);
            }
        }, 2000);

        try {
            const result = await RecommendationEngine.generate(prefs);
            clearInterval(msgInterval);
            
            const { yourLook, clashes, mode, accessories, scenarioA, scenarioB, explanation, attributes, matchScore, isOffline } = result;
            const hasClashes = clashes && clashes.length > 0;
            
            let finalScore = matchScore || 92; // Fallback just in case
            finalScore = Math.max(45, Math.min(99, finalScore)); // Clamp between 45 and 99
            const displayScore = isOffline ? 'N/A' : finalScore;
            
            // Generate share URL
            const jsonPrefs = JSON.stringify(prefs);
            // Safe btoa for potential non-latin characters
            const encodedPrefs = btoa(String.fromCharCode.apply(null, new TextEncoder().encode(jsonPrefs)));
            const shareUrl = window.location.origin + window.location.pathname + '#/results?data=' + encodedPrefs;

            // ── TOP EDITORIAL BANNER ──
            const styleName = prefs.stylePersonality?.[0] || 'Curated';
            const occasionName = prefs.occasions?.[0] || 'Fashion';
            
            const attributesHtml = attributes.map(a => `<span class="px-3 py-1 bg-surface-container-high text-primary font-label-caps text-[10px] uppercase tracking-wider rounded-sm">${a}</span>`).join('');
            
            const matchScoreHtml = isOffline ? '' : `
            <div class="mt-8 flex flex-col items-center">
                <div class="relative w-24 h-24 sm:w-32 sm:h-32 mb-3 group cursor-help">
                    <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle class="text-surface-container stroke-current" stroke-width="4" cx="50" cy="50" r="46" fill="transparent"></circle>
                        <circle class="text-primary stroke-current transition-all duration-1500 ease-out" stroke-width="4" stroke-linecap="square" cx="50" cy="50" r="46" fill="transparent" stroke-dasharray="${Math.PI * 2 * 46}" stroke-dashoffset="${Math.PI * 2 * 46 * (1 - finalScore / 100)}" id="score-circle"></circle>
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <span class="font-display-lg text-[28px] sm:text-[36px] text-primary leading-none">${displayScore}<span class="text-[14px] sm:text-[18px]">%</span></span>
                    </div>
                    <!-- Tooltip -->
                    <div class="absolute top-1/2 left-[105%] -translate-y-1/2 ml-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50">
                        <div class="glass-panel p-4 rounded-xl border border-white/40 shadow-xl text-left bg-white/90 backdrop-blur-md">
                            <p class="font-body-md text-[11px] text-primary leading-relaxed">Score is calculated by the AI engine based on <span class="font-bold">color harmony</span>, <span class="font-bold">formality alignment</span>, and <span class="font-bold">style consistency</span>.</p>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-1">
                    <p class="font-label-caps text-[10px] text-secondary tracking-[0.15em] uppercase">Cohesion Score</p>
                    <span class="material-symbols-outlined text-[14px] text-secondary/50 cursor-help" title="Hover score for details">info</span>
                </div>
            </div>`;

            const bannerHtml = `
            <div class="w-full text-center mb-10 mt-10 md:mt-16 reveal-section">
                <p class="font-label-caps text-[10px] text-primary tracking-[0.2em] uppercase mb-4">AI CURATED EDITION</p>
                <h1 class="font-['Playfair_Display'] font-medium text-primary text-[42px] md:text-[56px] leading-tight tracking-tight mb-4">${occasionName.charAt(0).toUpperCase() + occasionName.slice(1)} <span class="italic font-light text-secondary">&middot; ${styleName}</span></h1>
                
                <div class="flex flex-wrap justify-center gap-2 mb-8">
                    ${attributesHtml}
                </div>
                ${matchScoreHtml}
            </div>`;

            // ── MAIN SPLIT LAYOUT ──
            
            // LEFT COLUMN: Your Selections
            const yourLookHtml = yourLook.length > 0 ? `
            <div class="flex flex-col gap-4">
                ${yourLook.map((item, idx) => {
                    const colors = item.colorData || (prefs.itemColors && item.id ? prefs.itemColors[item.id] : null);
                    let colorHtml = '';
                    if (colors) {
                        const getHex = (val) => {
                            if (!val) return null;
                            if (val.startsWith('#')) return val;
                            const map = {
                                'Black': '#1A1A1A', 'Navy': '#1C2841', 'Charcoal': '#36454F', 'Beige': '#E6DCC8',
                                'Olive': '#4B5320', 'Brown': '#5C4033', 'White': '#F9F9F9', 'Burgundy': '#630015'
                            };
                            return map[val] || val;
                        };
                        const primaryHex = getHex(colors.primary);
                        const secondaryHex = colors.secondary ? getHex(colors.secondary) : null;
                        
                        colorHtml = `
                        <div class="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/20">
                            ${primaryHex ? `<div class="w-4 h-4 rounded-full border border-white/50 shadow-sm" style="background-color: ${primaryHex};" title="${colors.primary}"></div>` : ''}
                            ${secondaryHex ? `<div class="w-4 h-4 rounded-full border border-white/50 shadow-sm" style="background-color: ${secondaryHex};" title="${colors.secondary}"></div>` : ''}
                            ${colors.pattern && colors.pattern !== 'Solid' ? `<span class="font-label-caps text-[9px] text-white uppercase px-2 py-0.5 border border-white/40 rounded-full">${colors.pattern}</span>` : ''}
                        </div>`;
                    }

                    return `
                    <div class="relative group aspect-[4/5] w-full overflow-hidden rounded-2xl glass-panel shadow-sm">
                        <img class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]" src="${item.image}" alt="${item.name.replace(/'/g, "&#39;")}" style="object-position: ${item.objectPosition || 'center top'};" onerror="this.onerror=null; this.src='https://image.pollinations.ai/prompt/${encodeURIComponent(item.name + ' fashion item')}?width=400&height=500&nologo=true';"/>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
                        <div class="absolute bottom-0 left-0 w-full p-4 md:p-5">
                            <span class="inline-block bg-white text-black px-2 py-1 mb-2 font-label-caps text-[9px] font-bold rounded">YOUR SELECTION</span>
                            <h4 class="font-headline-md text-white text-[16px] leading-tight mb-1">${item.name}</h4>
                            <p class="font-label-caps text-[9px] text-white/80">${(item.category || 'LOOK').toUpperCase()}</p>
                            ${colorHtml}
                        </div>
                    </div>`;
                }).join('')}
            </div>` : `<div class="aspect-[4/5] w-full bg-surface-container rounded-2xl flex items-center justify-center border border-dashed border-outline-variant"><p class="text-secondary font-label-caps text-[10px]">NO SELECTIONS</p></div>`;

            // RIGHT COLUMN: Recommendations
            const clashHtml = isOffline ? '' : _buildClashSection(clashes);
            
            let recommendHtml = '';
            if (mode === 'dual' && scenarioA && scenarioB) {
                recommendHtml = _buildDualScenario(scenarioA, scenarioB);
            } else {
                recommendHtml = `
                <div class="reveal-section">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-headline-lg text-[22px] text-primary">AI Additions</h3>
                        <span class="font-label-caps text-[10px] text-secondary bg-surface-container px-3 py-1 border border-outline-variant/30">4 PIECES</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        ${(accessories || []).map(_buildAccessoryCard).join('')}
                    </div>
                </div>`;
            }

            const splitLayoutHtml = `
            <div class="max-w-[1440px] mx-auto px-6 md:px-16 py-12">
                
                <!-- Action Bar -->
                <div class="flex justify-between items-center mb-10 pb-4 border-b border-outline-variant/30 reveal-section">
                    <p class="font-body-md text-secondary hidden md:block">${isOffline ? 'Offline Mode - Limited Functionality' : 'Generated dynamically based on your wardrobe.'}</p>
                    ${isOffline ? '' : `
                    <div class="flex gap-3 w-full md:w-auto">
                        <button class="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-outline-variant/50 hover:bg-surface-container transition-colors font-button text-[11px] uppercase tracking-wider bg-white" onclick="navigator.clipboard.writeText('${shareUrl}').then(() => App.showToast('Link copied to clipboard!'))">
                            <span class="material-symbols-outlined text-[16px]">share</span> Share
                        </button>
                        <button id="save-look-btn" class="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-primary text-on-primary hover:bg-tertiary-container transition-all font-button text-[11px] uppercase tracking-wider shadow-md">
                            <span class="material-symbols-outlined text-[16px]">bookmark</span> Save Full Look
                        </button>
                    </div>`}
                </div>

                <div class="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    
                    <!-- LEFT: Base Context -->
                    <div class="w-full lg:w-1/3 flex flex-col gap-8 reveal-section">
                        <div>
                            <div class="flex items-center gap-2 mb-4">
                                <span class="material-symbols-outlined text-primary text-[20px]" style="font-variation-settings:'FILL' 1;">checkroom</span>
                                <h2 class="font-label-caps text-label-caps text-primary tracking-widest">YOUR BASE LOOK</h2>
                            </div>
                            ${yourLookHtml}
                        </div>
                        
                        <div class="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 relative overflow-hidden">
                            <span class="material-symbols-outlined absolute -top-2 -right-2 text-primary/5 text-[80px]">format_quote</span>
                            <span class="font-label-caps text-[9px] text-secondary tracking-widest mb-3 block">WHY THIS WORKS</span>
                            <p class="font-body-md text-[14px] text-primary leading-relaxed relative z-10">${explanation}</p>
                        </div>
                    </div>

                    <!-- RIGHT: AI Suggestions -->
                    <div class="w-full lg:w-2/3 flex flex-col">
                        ${clashHtml}
                        ${recommendHtml}
                    </div>

                </div>
            </div>`;

            // ── RECALIBRATE CTA ──
            const ctaHtml = `
            <div class="w-full bg-surface-container-lowest border-t border-outline-variant/20 py-24 mt-12 reveal-section">
                <div class="max-w-[800px] mx-auto text-center px-6">
                    <span class="material-symbols-outlined text-primary text-[32px] mb-6">tune</span>
                    <h2 class="font-['Playfair_Display'] text-[28px] md:text-[40px] mb-4 text-primary leading-tight">Want to pivot your style?</h2>
                    <p class="font-body-md text-secondary mb-10 max-w-md mx-auto">Tweak your selections to instantly generate a completely new fashion perspective.</p>
                    <div class="flex flex-wrap justify-center gap-4">
                        <button class="px-8 py-4 rounded-full bg-primary text-on-primary font-button uppercase hover:shadow-xl hover:bg-tertiary-container transition-all tracking-wider text-[11px]" onclick="Store.clearSession(); Router.navigate('/gender')">Start Fresh</button>
                        <button class="px-8 py-4 rounded-full border border-outline-variant/50 bg-white text-primary font-button uppercase hover:bg-surface-container transition-all tracking-wider text-[11px]" onclick="Router.navigate('/outfit')">Change Outfit</button>
                    </div>
                </div>
            </div>`;

            container.innerHTML = bannerHtml + splitLayoutHtml + ctaHtml;

            // Animate Score
            setTimeout(() => {
                const scoreEl = document.querySelector('.match-score');
                if (scoreEl) {
                    const target = parseInt(scoreEl.getAttribute('data-target'));
                    let current = 0;
                    const increment = target / 30; // 30 frames
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        scoreEl.textContent = Math.round(current);
                    }, 30);
                }
            }, 500);

            bindEvents(result, prefs, yourLook, finalScore);

            // Scroll reveal
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-active');
                    }
                });
            }, { threshold: 0.05 });
            document.querySelectorAll('.reveal-section').forEach(s => {
                s.style.opacity = '0';
                s.style.transform = 'translateY(30px)';
                s.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                observer.observe(s);
            });

        } catch (error) {
            clearInterval(msgInterval);
            console.error('Results page error:', error);
            container.innerHTML = `
                <div class="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-6 text-center">
                    <span class="material-symbols-outlined text-[48px] text-red-500">error</span>
                    <h2 class="font-headline-lg text-[24px] text-primary">Connection Interrupted</h2>
                    <p class="font-body-md text-secondary max-w-md">The AI styling engine is temporarily unreachable. Please ensure the backend server is running.</p>
                    <div class="flex gap-4 mt-6">
                        <button class="px-6 py-3 bg-primary text-white font-button uppercase tracking-widest text-[11px]" onclick="ResultsPage._retryInit()">Try Again</button>
                        <button class="px-6 py-3 border border-primary text-primary font-button uppercase tracking-widest text-[11px]" onclick="Router.navigate('/landing')">Return Home</button>
                    </div>
                </div>`;
        }
    }

    function _retryInit() {
        document.getElementById('results-container').innerHTML = `
            <div class="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
                <div class="w-12 h-12 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
                <p class="font-label-caps text-secondary text-[10px] tracking-widest">RECONNECTING...</p>
            </div>`;
        requestAnimationFrame(() => init());
    }

    function bindEvents(result, prefs, yourLook, finalScore) {
        // Save Full Look
        document.getElementById('save-look-btn')?.addEventListener('click', () => {
            const lookName = yourLook.map(i => i.name).join(' + ') || 'Curated Look';
            if (Store.isOutfitSaved(lookName)) { App.showToast('Outfit already saved'); return; }
            
            // Only save the active mode's accessories
            let accessoriesToSave = result.accessories || [];
            if (result.mode === 'dual') {
                const isTabBActive = document.getElementById('tab-b')?.classList.contains('bg-primary');
                accessoriesToSave = isTabBActive ? (result.scenarioB?.accessories || []) : (result.scenarioA?.accessories || []);
            }
            
            Store.saveOutfit({
                name: lookName,
                image: yourLook[0]?.image || '',
                score: finalScore,
                items: [
                    ...yourLook.map(i => ({ name: i.name, price: 0, image: i.image })),
                    ...accessoriesToSave.map(a => ({ name: a.name, price: a.price, image: a.image }))
                ],
                preferences: prefs
            });
            App.showToast('Look added to collection');
            const btn = document.getElementById('save-look-btn');
            if (btn) {
                btn.innerHTML = '<span class="material-symbols-outlined text-[16px]" style="font-variation-settings:\'FILL\' 1;">bookmark</span> Saved';
                btn.classList.add('bg-black');
                btn.style.animation = 'none';
                btn.offsetHeight; /* trigger reflow */
                btn.style.animation = 'scaleBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            }
        });

        // Individual Item Wishlist
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const itemData = JSON.parse(btn.dataset.item);
                
                if (Store.isInWishlist(itemData.name)) {
                    App.showToast('Item already in wishlist');
                    return;
                }
                
                Store.addToWishlist(itemData);
                App.showToast(`${itemData.name} added to wishlist`);
                btn.innerHTML = '<span class="material-symbols-outlined text-red-500 text-[20px]" style="font-variation-settings:\'FILL\' 1;">favorite</span>';
                btn.style.animation = 'none';
                btn.offsetHeight; /* trigger reflow */
                btn.style.animation = 'scaleBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            });
        });
    }

    return { render, init, switchTab, _retryInit };
})();
