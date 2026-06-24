window.GenderPage = (function() {
    function render() {
        const saved = Store.get('gender');
        
        function getClasses(key) {
            if (!saved) return 'opacity-80 border-transparent hover:opacity-100';
            return saved === key 
                ? 'active opacity-100 border-brand shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10' 
                : 'opacity-80 border-transparent hover:opacity-100';
        }

        return `
<div class="h-screen w-screen flex flex-col overflow-hidden bg-background animate-fade-in relative">
    
    <!-- Top Nav -->
    <nav class="sticky top-0 z-50 flex items-baseline justify-between border-b border-foreground bg-background px-6 py-4">
        <div class="font-mono text-xs font-bold tracking-tighter cursor-pointer" onclick="window.Router.navigate('/landing')">
            FASHIONWARDROBE<sup class="ml-1 text-brand">®</sup>
        </div>
        <div class="flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest">
            <span class="hidden sm:inline-block border border-foreground px-3 py-1">INDEX 01 / 06</span>
            <button class="transition-colors hover:text-brand flex items-center gap-2" onclick="if(window.Walkthrough) window.Walkthrough.startGenderTour()" title="Replay Walkthrough">
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
        <div class="w-full lg:w-[35%] h-[40%] lg:h-full flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-foreground p-6 lg:p-12 relative overflow-hidden">
            <div class="mt-2 lg:mt-8 z-10">
                <div class="flex items-center gap-3 mb-2 lg:mb-6">
                    <span class="font-mono text-[10px] uppercase tracking-[0.3em] text-brand block">Step 01 / 07</span>
                </div>
                <h1 class="text-3xl lg:text-[clamp(2.5rem,4vw,4.5rem)] font-extrabold uppercase leading-[0.85] tracking-tighter font-sans antialiased mb-2 lg:mb-6">
                    Who are we<br>
                    <span class="text-brand">dressing</span><br>
                    today?
                </h1>
                <div class="flex gap-4 items-start mb-12">
                    <div class="w-1 h-full bg-foreground/10 flex-shrink-0 mt-2"></div>
                    <p class="font-mono text-[10px] lg:text-xs leading-relaxed text-muted max-w-sm uppercase tracking-widest hidden sm:block">
                        Choose a style profile to begin your curated journey. Our styling engine adapts to your base selection.
                    </p>
                </div>

                <!-- Prominent Counter -->
                <div class="inline-flex items-center gap-4 px-6 py-4 border-[2px] border-foreground bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] w-fit transition-all duration-300" id="selection-counter-box">
                    <div class="flex items-baseline gap-1">
                        <span class="font-mono text-3xl font-black text-brand" id="selection-counter-num">${saved ? '1' : '0'}</span>
                        <span class="font-mono text-lg font-bold text-foreground">/1</span>
                    </div>
                    <div class="w-px h-8 bg-foreground/20"></div>
                    <span class="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">SELECTED</span>
                </div>
            </div>
        </div>

        <!-- Right Side: Cards -->
        <div class="w-full lg:w-[65%] h-[60%] lg:h-full grid grid-cols-2 p-4 lg:p-12 gap-4 lg:gap-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')]">
            
            <!-- Male Card -->
            <div class="selection-card group relative flex flex-col cursor-pointer transition-all duration-700 ease-[var(--ease-out-expo)] border-[4px] h-full w-full overflow-hidden opacity-0 translate-y-12 animate-enter-1 ${getClasses('male')}" data-gender="male">
                <!-- Background Image -->
                <img alt="Male Profile" src="assets/img/Male.jpg" class="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:grayscale-0 group-[.active]:grayscale-0 ${saved === 'male' ? 'grayscale-0' : ''}">
                
                <!-- Gradients -->
                <div class="absolute top-0 inset-x-0 h-1/4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>
                <div class="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                
                <!-- Top Number -->
                <div class="absolute top-6 left-6 font-mono text-[10px] text-white tracking-[0.3em] font-bold z-10">01</div>
                
                <!-- Hover Hint -->
                <div class="absolute top-6 right-6 pointer-events-none z-20">
                    <div class="text-white font-mono text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0 group-[.active]:hidden font-bold drop-shadow-md">SELECT <span class="material-symbols-outlined text-[14px]">arrow_forward</span></div>
                </div>
                
                <!-- Top Right Icon -->
                <div class="absolute top-6 right-6 z-10 material-symbols-outlined text-brand opacity-0 transform scale-50 transition-all duration-300 group-[.active]:opacity-100 group-[.active]:scale-100 ${saved === 'male' ? 'opacity-100 scale-100' : ''}">check_circle</div>
                
                <!-- Bottom Content -->
                <div class="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex flex-col gap-1 z-10 transform translate-y-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-[.active]:translate-y-0">
                    <span class="text-xl lg:text-4xl font-extrabold uppercase tracking-tighter text-white">Male</span>
                    <span class="font-mono text-[8px] lg:text-[10px] uppercase tracking-widest text-white/70">The Architect</span>
                </div>
            </div>

            <!-- Female Card -->
            <div class="selection-card group relative flex flex-col cursor-pointer transition-all duration-700 ease-[var(--ease-out-expo)] border-[4px] h-full w-full overflow-hidden opacity-0 translate-y-12 animate-enter-2 ${getClasses('female')}" data-gender="female">
                <!-- Background Image -->
                <img alt="Female Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6AeAfPmiYI7qgmuzazGygBMTBoLm-ecAL3xJKeh2xfnzQ_q63_BHtF5n6ZR61neCEPHGyRCyO8gwbz8dKQOLgim20FlvEhiZgz_BdZWOGLbQtZ6JlAnP3enHCODTICvwC1equ2CudB7_SJpgngHCTbAvn938HZEBXiq10NA8rHBLx4b1Loigg-w96iKQUXINRXgmvMk_Wk6mHPOpLJ7rTcP5m6gPEeXsdpCnyBd_wjj7g9pGyGi2pGCxlD8PzCtknjQW-S8ip1A" class="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:grayscale-0 group-[.active]:grayscale-0 ${saved === 'female' ? 'grayscale-0' : ''}">
                
                <!-- Gradients -->
                <div class="absolute top-0 inset-x-0 h-1/4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>
                <div class="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                
                <!-- Top Number -->
                <div class="absolute top-6 left-6 font-mono text-[10px] text-white tracking-[0.3em] font-bold z-10">02</div>
                
                <!-- Hover Hint -->
                <div class="absolute top-6 right-6 pointer-events-none z-20">
                    <div class="text-white font-mono text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0 group-[.active]:hidden font-bold drop-shadow-md">SELECT <span class="material-symbols-outlined text-[14px]">arrow_forward</span></div>
                </div>
                
                <!-- Top Right Icon -->
                <div class="absolute top-6 right-6 z-10 material-symbols-outlined text-brand opacity-0 transform scale-50 transition-all duration-300 group-[.active]:opacity-100 group-[.active]:scale-100 ${saved === 'female' ? 'opacity-100 scale-100' : ''}">check_circle</div>
                
                <!-- Bottom Content -->
                <div class="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex flex-col gap-1 z-10 transform translate-y-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-[.active]:translate-y-0">
                    <span class="text-xl lg:text-4xl font-extrabold uppercase tracking-tighter text-white">Female</span>
                    <span class="font-mono text-[8px] lg:text-[10px] uppercase tracking-widest text-white/70">The Visionary</span>
                </div>
            </div>

        </div>
    </main>

    <!-- Bottom Bar -->
    <footer class="bg-background flex flex-col md:flex-row items-stretch border-t border-foreground">
        <div class="flex-1 p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-foreground">
            <span class="font-mono text-[10px] uppercase tracking-[0.3em] text-brand mb-2">Bespoke Styling</span>
            <p class="font-mono text-xs text-muted uppercase tracking-widest">Curating pieces that define your signature look.</p>
        </div>
        <button id="continue-btn" class="flex-1 bg-brand text-brand-foreground font-mono text-xs uppercase tracking-widest p-6 transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed group flex items-center justify-center gap-4" ${saved ? '' : 'disabled'}>
            Continue to Occasion
            <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
    </footer>
</div>
        `;
    }

    function init() {
        const cards = document.querySelectorAll('.selection-card');
        const btn = document.getElementById('continue-btn');

        // Initial entrance animation
        setTimeout(() => {
            document.querySelector('.animate-enter-1')?.classList.remove('opacity-0', 'translate-y-12');
            setTimeout(() => {
                document.querySelector('.animate-enter-2')?.classList.remove('opacity-0', 'translate-y-12');
            }, 100);
        }, 50);

        let saved = Store.get('gender');

        document.getElementById('continue-btn')?.addEventListener('click', () => {
            const saved = Store.get('gender');
            if (!saved) {
                App.showToast('Please select an option to continue.', 'error');
                return;
            }
            Router.navigate('/occasion');
        });

        // Trigger the second part of the walkthrough if they came from landing tour
        setTimeout(() => {
            if (!localStorage.getItem('fw_has_seen_gender_tour')) {
                localStorage.setItem('fw_has_seen_gender_tour', 'true');
                if (window.Walkthrough) window.Walkthrough.startGenderTour();
            }
        }, 500);

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const key = card.dataset.gender;
                
                // Toggle logic
                if (saved === key) {
                    saved = null;
                } else {
                    const prevGender = Store.get('gender');
                    saved = key;
                    // Reset all downstream state if changing gender
                    if (prevGender && saved !== prevGender) {
                        Store.set('currentOutfit', { topwear: [], outerwear: [], bottomwear: [], footwear: [], accessories: [] });
                        Store.set('occasions', []);
                        Store.set('stylePersonality', []);
                        Store.set('itemColors', {});
                    }
                }
                
                Store.set('gender', saved);
                btn.disabled = !saved;
                const counterNum = document.getElementById('selection-counter-num');
                if (counterNum) counterNum.innerText = saved ? '1' : '0';

                // Re-render visually
                cards.forEach(c => {
                    c.className = 'selection-card group relative flex flex-col cursor-pointer transition-all duration-700 ease-[var(--ease-out-expo)] border-[4px] h-full w-full overflow-hidden opacity-80 border-transparent hover:opacity-100';
                    const icon = c.querySelector('.material-symbols-outlined.text-brand');
                    if(icon) {
                        icon.classList.remove('opacity-100', 'scale-100');
                        icon.classList.add('opacity-0', 'scale-50');
                    }
                });
                
                // If we have a selection, add active class
                if (saved) {
                    const activeCard = Array.from(cards).find(c => c.dataset.gender === saved);
                    if (activeCard) {
                        activeCard.className = 'selection-card group relative flex flex-col cursor-pointer transition-all duration-700 ease-[var(--ease-out-expo)] border-[4px] h-full w-full overflow-hidden active opacity-100 border-brand shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10';
                        const icon = activeCard.querySelector('.material-symbols-outlined.text-brand');
                        if (icon) {
                            icon.classList.remove('opacity-0', 'scale-50');
                            icon.classList.add('opacity-100', 'scale-100');
                        }
                    }
                }
            });
        });

        btn?.addEventListener('click', () => {
            if (!btn.disabled) {
                window.Router.navigate('/occasion');
            }
        });
    }

    return { render, init };
})();
