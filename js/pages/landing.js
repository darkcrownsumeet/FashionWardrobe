/* ============================================
   FashionWardrobe — Landing Page
   Ported from: landing_page_fashionwardrobe/code.html
   ============================================ */

const LandingPage = (() => {
    function getNavHTML() {
        const auth = Store.getAuth();
        const isLoggedIn = auth !== null;
        const userName = auth?.name || auth?.email?.split('@')[0] || 'User';
        const userEmail = auth?.email || '';
        const userInitial = userName.charAt(0).toUpperCase();
        // Pick a gradient based on the first letter
        const gradients = {
            'A': 'from-pink-400 to-rose-500', 'B': 'from-blue-400 to-indigo-500',
            'C': 'from-green-400 to-emerald-500', 'D': 'from-purple-400 to-violet-500',
            'E': 'from-amber-400 to-orange-500', 'F': 'from-cyan-400 to-teal-500',
            'G': 'from-red-400 to-pink-500', 'default': 'from-gray-400 to-gray-600'
        };
        const gradient = gradients[userInitial] || gradients['default'];

        const accountButton = isLoggedIn
            ? `<div class="relative" id="account-dropdown-wrapper">
                <button class="w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-[13px] hover:ring-2 hover:ring-primary/30 transition-all cursor-pointer" id="account-toggle-btn" title="${userName}">
                    ${userInitial}
                </button>
                <!-- Dropdown -->
                <div id="account-dropdown" class="absolute right-0 top-full mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 pointer-events-none transform scale-95 origin-top-right transition-all duration-200 z-[100]">
                    <div class="px-5 py-4 border-b border-gray-100">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-[15px] flex-shrink-0">${userInitial}</div>
                            <div class="min-w-0">
                                <p class="font-body-md text-primary text-[14px] font-semibold truncate">${userName}</p>
                                ${userEmail ? `<p class="text-secondary text-[12px] truncate">${userEmail}</p>` : `<p class="text-secondary text-[12px]">Guest Account</p>`}
                            </div>
                        </div>
                    </div>
                    <div class="py-2">
                        <button class="w-full flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low transition-colors text-left" onclick="Router.navigate('/gender')">
                            <span class="material-symbols-outlined text-secondary text-[20px]">auto_awesome</span>
                            <span class="font-body-md text-primary text-[13px]">Style Quiz</span>
                        </button>
                        <button class="w-full flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low transition-colors text-left" onclick="Router.navigate('/saved')">
                            <span class="material-symbols-outlined text-secondary text-[20px]">bookmark</span>
                            <span class="font-body-md text-primary text-[13px]">Saved Outfits</span>
                        </button>
                        <button class="w-full flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low transition-colors text-left" onclick="Router.navigate('/wishlist')">
                            <span class="material-symbols-outlined text-secondary text-[20px]">favorite</span>
                            <span class="font-body-md text-primary text-[13px]">Wishlist</span>
                        </button>
                    </div>
                    <div class="border-t border-gray-100 py-2">
                        <button class="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-colors text-left" id="logout-btn">
                            <span class="material-symbols-outlined text-red-500 text-[20px]">logout</span>
                            <span class="font-body-md text-red-600 text-[13px] font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>`
            : `<button class="nav-icon hover:opacity-70 transition-opacity" onclick="Router.navigate('/auth')" title="Account">
                <span class="material-symbols-outlined text-[22px]">person_outline</span>
            </button>`;

        return `
<nav id="main-nav" class="fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out nav-transparent">
    <!-- Search Overlay -->
    <div id="search-overlay" class="absolute inset-0 z-[60] bg-white flex items-center px-4 sm:px-6 md:px-10 lg:px-16 gap-4 opacity-0 pointer-events-none transition-all duration-300" style="transform: translateY(-100%);">
        <span class="material-symbols-outlined text-primary text-[22px] flex-shrink-0">search</span>
        <input id="nav-search-input" class="flex-1 bg-transparent border-none focus:ring-0 text-[15px] font-body-md text-primary placeholder-secondary outline-none py-5" placeholder="Search styles, collections, looks..." type="text"/>
        <button id="search-close-btn" class="flex-shrink-0 w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-primary text-[20px]">close</span>
        </button>
    </div>
    <!-- Main Nav -->
    <div class="flex justify-between items-center px-4 sm:px-6 md:px-10 lg:px-16 py-4 md:py-5 gap-2 sm:gap-4">
        <!-- Left: Menu + Search -->
        <div class="flex items-center gap-3 sm:gap-5 flex-1 justify-start">
            <button class="nav-icon flex items-center gap-2 hover:opacity-70 transition-opacity lg:hidden">
                <span class="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <button id="search-open-btn" class="nav-icon hidden items-center gap-2 hover:opacity-70 transition-opacity">
                <span class="material-symbols-outlined text-[20px]">search</span>
                <span class="hidden xl:inline font-label-caps text-[11px] tracking-[0.15em]">Search</span>
            </button>
        </div>
        <!-- Center: Brand -->
        <div class="flex justify-center flex-shrink-0">
            <span class="nav-brand font-display-lg tracking-[0.08em] font-bold cursor-pointer text-center" onclick="Router.navigate('/landing')">FASHIONWARDROBE</span>
        </div>
        <!-- Right: Links + Icons -->
        <div class="flex items-center justify-end gap-3 sm:gap-6 flex-1">
            <div class="hidden lg:flex items-center gap-6">
                <a class="nav-icon nav-link-active font-label-caps text-[11px] tracking-[0.15em] hover:opacity-70 transition-opacity" href="#/landing">Discover</a>
                <a class="nav-icon font-label-caps text-[11px] tracking-[0.15em] hover:opacity-70 transition-opacity" href="#/saved">Saved</a>
            </div>
            <button class="nav-icon hover:opacity-70 transition-opacity" onclick="Router.navigate('/wishlist')" title="Wishlist">
                <span class="material-symbols-outlined text-[22px]">favorite_border</span>
            </button>
            ${accountButton}
        </div>
    </div>
</nav>
        `;
    }


    function render() {
        return `
<!-- Hero Carousel Section -->
<header class="relative w-full h-screen min-h-[500px] md:min-h-[700px] flex items-center overflow-hidden">
    <!-- Carousel Images -->
    <div class="absolute inset-0 z-0" id="hero-carousel">
        <div data-title="Autumn / Winter 2024" class="hero-slide absolute inset-0 w-full h-full bg-cover bg-center bg-fixed bg-no-repeat transition-opacity duration-1000 ease-in-out opacity-100" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUQgxhzbiCOQB1mOrPBGKJbM9PFe_qudwQjOESjVL5edN4vCOeVPNw0vBwYPTDAYNclnLZLrRvdg19o2ELUfx12ocAlbWS_CW6EnK-6jddYeDlbwQ49LBWidawzHLQQKt7rBJcn5hzaShmR4ZEzSLFbZZnRepUD20LvnnqROHxpHNtFVhgt4Zi5UZeWJn8JPJrrTPH8PGdnV0_aA2DSxvb27ycb_EBP0J84yGMog7I_3KmEUDXGd6_dC6CdXG5xNMku73Ukb0YwA');"></div>
        <div data-title="Spring / Summer 2025" class="hero-slide absolute inset-0 w-full h-full bg-cover bg-center bg-fixed bg-no-repeat transition-opacity duration-1000 ease-in-out opacity-0" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGIw8Am_lNo3vLdBV97syKoNtpABjvZX6DTH2ffjRL6VcdK1elB_12GSw_wL1tI-ufP-byINka9buPO18UZWKVrWMhAGba65-3297s6QE1H2M2EkdCfNAxmiCsO3mivgQ3NOFlUOtFI4ZvdeGiRP6uKg0yK4D3p3NTA83dOadFsbJ60oiOPLUYdm2AneLW6OYmE13DqRRUDt_PLoIEzTVuMEzJS9FA8s0BCNqOnFvUmRBhxDSneEACBdoZAnh7GgDishneLnLJHQ');"></div>
        <div data-title="Minimalist Collection" class="hero-slide absolute inset-0 w-full h-full bg-cover bg-center bg-fixed bg-no-repeat transition-opacity duration-1000 ease-in-out opacity-0" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCe7DCdp64GOj9VZYuOvCGfHZ_a9FerTj8x0mGKKhHAXHTl-RFIIvZswmSQgirbBLxqxZwEpJfjVH6tv-c8gpGH_SvNRqeOnIUgPqXgn1U27RmSUiSimFnT3ieZCXTpV_pezE_eHCScE9Gi3pNNgELYHKoP6bbNYNF8p6sRrAP5feDg3x2hLLPzMmHVbe_NZNPKhaU7JvRW42QC0T94JBImeJJ53j49DcupOHMLviEt4Vk72IrA_MXuOqvBUEQA29CKbkH9oNVj2g');"></div>
        <div data-title="Evening Exclusives" class="hero-slide absolute inset-0 w-full h-full bg-cover bg-center bg-fixed bg-no-repeat transition-opacity duration-1000 ease-in-out opacity-0" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCv2xs80oUZHYnc_YQbSVXm9R-l9N4D0SA1rgKnJRoTZAPposyghRLs5tfh7rPw_fCIO4VQjdURSCBRq6xvvHcoeug1LZFQGjR393BsHpZ4hyVChsvcwHHTvxhO0bndNnwP8sbGX1-DoK3jUukEUYB9RngXVOjXWzyQeXoNgjyYBGUuFX5BdFwvQMJDI3RQtQYDEpdClamJQCcDCGN7CqG1BM3LHBjt4p06Qe16ucfwn4W7WBt9uB0Gxh-UrW9pv0nJbSo1Gwx6Tg');"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-[1]"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-[1]"></div>
    </div>

    <!-- Hero Content -->
    <div class="relative z-10 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto w-full">
        <div class="max-w-2xl">
            <p id="hero-season-text" class="font-label-caps text-label-caps text-white/80 mb-4 sm:mb-6 tracking-[0.4em] uppercase transition-opacity duration-300">Autumn / Winter 2024</p>
            <h1 class="font-display-lg text-[28px] sm:text-display-lg-mobile md:text-display-lg text-white mb-6 sm:mb-8 leading-tight">Find Your Perfect Outfit Match</h1>
            <p class="font-body-lg text-white/90 mb-8 sm:mb-10 max-w-lg">Experience the future of personal styling. Our AI-driven wardrobe curator analyzes your aesthetic to craft bespoke luxury looks tailored exclusively for you.</p>
            <div class="flex flex-wrap items-center gap-4 sm:gap-6">
                <button id="hero-cta" class="group relative px-6 sm:px-10 py-4 sm:py-5 bg-white/10 backdrop-blur-md border border-white/30 text-white font-button text-button uppercase hover:bg-white hover:text-black transition-all duration-500 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    <span class="relative z-10 transition-colors duration-500 group-hover:text-black">Get Started</span>
                    <div class="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-white transition-transform duration-500 ease-out z-0"></div>
                </button>
                <button class="px-6 sm:px-10 py-4 sm:py-5 border border-white/50 text-white font-button text-button uppercase hover:bg-white/10 hover:border-white transition-all duration-500" onclick="document.getElementById('trending-section').scrollIntoView({behavior:'smooth'})">
                    View Lookbook
                </button>
            </div>
        </div>
    </div>

    <!-- Carousel Indicators -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 py-6" id="carousel-indicators">
        <!-- Left Arrow -->
        <span class="material-symbols-outlined text-[24px] cursor-pointer text-white/50 transition hover:text-white" id="carousel-prev">chevron_left</span>

        <!-- Dots -->
        <div class="flex items-center gap-3">
            <button class="carousel-dot relative cursor-pointer w-2.5 h-2.5 rounded-full bg-white/40 transition-all duration-300" data-slide="0">
                <div class="carousel-progress absolute top-0 left-0 h-full bg-white rounded-full w-0" style="opacity: 0;"></div>
                <span class="ripple-anim absolute inset-0 rounded-full bg-white/30 hidden"></span>
            </button>
            <button class="carousel-dot relative cursor-pointer w-2.5 h-2.5 rounded-full bg-white/40 transition-all duration-300" data-slide="1">
                <div class="carousel-progress absolute top-0 left-0 h-full bg-white rounded-full w-0" style="opacity: 0;"></div>
                <span class="ripple-anim absolute inset-0 rounded-full bg-white/30 hidden"></span>
            </button>
            <button class="carousel-dot relative cursor-pointer w-2.5 h-2.5 rounded-full bg-white/40 transition-all duration-300" data-slide="2">
                <div class="carousel-progress absolute top-0 left-0 h-full bg-white rounded-full w-0" style="opacity: 0;"></div>
                <span class="ripple-anim absolute inset-0 rounded-full bg-white/30 hidden"></span>
            </button>
            <button class="carousel-dot relative cursor-pointer w-2.5 h-2.5 rounded-full bg-white/40 transition-all duration-300" data-slide="3">
                <div class="carousel-progress absolute top-0 left-0 h-full bg-white rounded-full w-0" style="opacity: 0;"></div>
                <span class="ripple-anim absolute inset-0 rounded-full bg-white/30 hidden"></span>
            </button>
        </div>

        <!-- Right Arrow -->
        <span class="material-symbols-outlined text-[24px] cursor-pointer text-white/50 transition hover:text-white" id="carousel-next">chevron_right</span>
    </div>
</header>

<!-- Trending Styles Section -->
<section id="trending-section" class="py-16 md:py-20 lg:py-section-gap px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto overflow-hidden">
    <div class="flex justify-between items-end mb-12">
        <div>
            <h2 class="font-headline-lg text-headline-lg text-primary mb-2">Trending Styles</h2>
            <div class="w-16 h-1 bg-primary"></div>
        </div>
        <div class="flex gap-4">
            <button class="w-12 h-12 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-white transition-all" onclick="document.getElementById('trending-scroll').scrollBy({left:-300,behavior:'smooth'})">
                <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <button class="w-12 h-12 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-white transition-all" onclick="document.getElementById('trending-scroll').scrollBy({left:300,behavior:'smooth'})">
                <span class="material-symbols-outlined">chevron_right</span>
            </button>
        </div>
    </div>
    <div class="flex gap-gutter overflow-x-auto hide-scrollbar snap-x snap-mandatory" id="trending-scroll">
        <div class="flex-none w-[300px] md:w-[350px] snap-start group cursor-pointer" onclick="Store.clearSession(); Store.set('stylePersonality', ['Minimalist']); Router.navigate('/gender')">
            <div class="relative overflow-hidden rounded-xl aspect-[3/4] mb-4">
                <img alt="Cyber Tailoring" class="w-full h-full object-cover transition-transform duration-1000 ease-out [transform:translateZ(0)] backface-hidden" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGIw8Am_lNo3vLdBV97syKoNtpABjvZX6DTH2ffjRL6VcdK1elB_12GSw_wL1tI-ufP-byINka9buPO18UZWKVrWMhAGba65-3297s6QE1H2M2EkdCfNAxmiCsO3mivgQ3NOFlUOtFI4ZvdeGiRP6uKg0yK4D3p3NTA83dOadFsbJ60oiOPLUYdm2AneLW6OYmE13DqRRUDt_PLoIEzTVuMEzJS9FA8s0BCNqOnFvUmRBhxDSneEACBdoZAnh7GgDishneLnLJHQ"/>
                <div class="absolute top-4 left-4 z-10"><span class="px-3 py-1 glass-effect rounded-full font-label-caps text-[10px] text-primary">NEW ARRIVAL</span></div>
            </div>
            <h3 class="font-headline-md text-headline-md text-primary group-hover:text-secondary transition-colors">Cyber Tailoring</h3>
            <p class="font-label-caps text-label-caps text-secondary">AESTHETIC: MINIMALIST</p>
        </div>
        <div class="flex-none w-[300px] md:w-[350px] snap-start group cursor-pointer" onclick="Store.clearSession(); Store.set('stylePersonality', ['Casual']); Router.navigate('/gender')">
            <div class="relative overflow-hidden rounded-xl aspect-[3/4] mb-4">
                <img alt="Monochrome Soul" class="w-full h-full object-cover transition-transform duration-1000 ease-out [transform:translateZ(0)] backface-hidden" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe7DCdp64GOj9VZYuOvCGfHZ_a9FerTj8x0mGKKhHAXHTl-RFIIvZswmSQgirbBLxqxZwEpJfjVH6tv-c8gpGH_SvNRqeOnIUgPqXgn1U27RmSUiSimFnT3ieZCXTpV_pezE_eHCScE9Gi3pNNgELYHKoP6bbNYNF8p6sRrAP5feDg3x2hLLPzMmHVbe_NZNPKhaU7JvRW42QC0T94JBImeJJ53j49DcupOHMLviEt4Vk72IrA_MXuOqvBUEQA29CKbkH9oNVj2g"/>
                <div class="absolute top-4 left-4 z-10"><span class="px-3 py-1 glass-effect rounded-full font-label-caps text-[10px] text-primary">AI-RECOMMENDED</span></div>
            </div>
            <h3 class="font-headline-md text-headline-md text-primary group-hover:text-secondary transition-colors">Monochrome Soul</h3>
            <p class="font-label-caps text-label-caps text-secondary">AESTHETIC: NEUTRAL</p>
        </div>
        <div class="flex-none w-[300px] md:w-[350px] snap-start group cursor-pointer" onclick="Store.clearSession(); Store.set('stylePersonality', ['Streetwear']); Router.navigate('/gender')">
            <div class="relative overflow-hidden rounded-xl aspect-[3/4] mb-4">
                <img alt="Urban Ghost" class="w-full h-full object-cover transition-transform duration-1000 ease-out [transform:translateZ(0)] backface-hidden" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiaSQkOiVAyPoRJD3uN48RizcjZCfMkUKBtdtrZKezxqI1RsstgCwJc5suVR1-wvoUUwN_Uu7T3nDKto8Cz0Eb-Y46zM8Xvkpuj8PwlAe2KGv2gBa4ELbTOM8AEjRsd7DqklR0ksbI-Tlk_WK-9Wlh-L_gtwe3mXVuCaMyqpJ47Nh-Icw1my622QHWfJ1x8cjUdhROB9vH2TzGiwJoqPwlSH8sqMPeSCTokZG_uPF50ytHCiCv8t0OQZADf2nZh8zmiUNAa3MNsw"/>
            </div>
            <h3 class="font-headline-md text-headline-md text-primary group-hover:text-secondary transition-colors">Urban Ghost</h3>
            <p class="font-label-caps text-label-caps text-secondary">AESTHETIC: STREETWEAR</p>
        </div>
        <div class="flex-none w-[300px] md:w-[350px] snap-start group cursor-pointer" onclick="Store.clearSession(); Store.set('stylePersonality', ['Evening']); Router.navigate('/gender')">
            <div class="relative overflow-hidden rounded-xl aspect-[3/4] mb-4">
                <img alt="Velvet Midnight" class="w-full h-full object-cover transition-transform duration-1000 ease-out [transform:translateZ(0)] backface-hidden" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv2xs80oUZHYnc_YQbSVXm9R-l9N4D0SA1rgKnJRoTZAPposyghRLs5tfh7rPw_fCIO4VQjdURSCBRq6xvvHcoeug1LZFQGjR393BsHpZ4hyVChsvcwHHTvxhO0bndNnwP8sbGX1-DoK3jUukEUYB9RngXVOjXWzyQeXoNgjyYBGUuFX5BdFwvQMJDI3RQtQYDEpdClamJQCcDCGN7CqG1BM3LHBjt4p06Qe16ucfwn4W7WBt9uB0Gxh-UrW9pv0nJbSo1Gwx6Tg"/>
                <div class="absolute top-4 left-4 z-10"><span class="px-3 py-1 glass-effect rounded-full font-label-caps text-[10px] text-primary">EDITOR'S CHOICE</span></div>
            </div>
            <h3 class="font-headline-md text-headline-md text-primary group-hover:text-secondary transition-colors">Velvet Midnight</h3>
            <p class="font-label-caps text-label-caps text-secondary">AESTHETIC: EVENING</p>
        </div>
    </div>
</section>

<!-- AI Fashion Lab Section -->
<section class="bg-primary text-on-primary py-20 md:py-section-gap">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div class="relative">
                <div class="aspect-square bg-surface-container-high rounded-xl overflow-hidden">
                    <img alt="AI Lab" class="w-full h-full object-cover mix-blend-multiply opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRdaYKn_PLiKLZ5A1CQS0MVA55qj9bGbIbFavErzb1ln5ljze261kuBrbs12i_MdxOx7DI-81czGRWig8DC6z03NJL5LHpjVncsNpHPya9zIUgv9qKVTohzO7IkQmSbuFq5eutXcre8RfunuiAmXeKl6I1k5FnC59ACCW0SJG51ze_TAr0UUVOe-exAvS0EbeUpy0M_TMy99oTc9BpXdTDstJS6T_gQDvsPq8r5Fby2Oi2Xx-_9xpAJs82U8ksY71nY2isT4cyMw"/>
                </div>
                <div class="absolute -bottom-10 -right-10 glass-effect p-8 rounded-xl max-w-xs border border-white/20 shadow-2xl animate-float">
                    <p class="text-primary font-headline-md mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">98.4%</p>
                    <p class="text-secondary font-label-caps text-[10px]">STYLE MATCH ACCURACY</p>
                </div>
            </div>
            <div>
                <h2 class="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-10">AI Fashion Lab</h2>
                <p class="font-body-lg text-white/70 mb-12">Our proprietary neural engine decodes thousands of style parameters to find the precise silhouette, color palette, and fabric that resonates with your identity.</p>
                <div class="space-y-10">
                    <div class="flex gap-6 items-start">
                        <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span class="material-symbols-outlined text-white" style="font-variation-settings: 'FILL' 1;">psychology</span>
                        </div>
                        <div>
                            <h4 class="font-headline-md text-headline-md text-white mb-2">Aesthetic Neural Mapping</h4>
                            <p class="text-white/60">Advanced algorithms analyze your visual preferences to build a unique style DNA.</p>
                        </div>
                    </div>
                    <div class="flex gap-6 items-start">
                        <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span class="material-symbols-outlined text-white" style="font-variation-settings: 'FILL' 1;">checkroom</span>
                        </div>
                        <div>
                            <h4 class="font-headline-md text-headline-md text-white mb-2">Virtual Atelier</h4>
                            <p class="text-white/60">Preview curated outfits on a high-fidelity 3D representation of your silhouette.</p>
                        </div>
                    </div>
                    <div class="flex gap-6 items-start">
                        <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span class="material-symbols-outlined text-white" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
                        </div>
                        <div>
                            <h4 class="font-headline-md text-headline-md text-white mb-2">Seamless Curation</h4>
                            <p class="text-white/60">One-click styling that evolves as seasonal trends and your tastes transform.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Newsletter CTA -->
<section class="relative py-24 md:py-32 overflow-hidden bg-primary">
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%221%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
    <div class="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div class="max-w-3xl mx-auto text-center">
            <div class="w-12 h-[2px] bg-white/30 mx-auto mb-8"></div>
            <p class="font-label-caps text-label-caps text-white/50 mb-6 tracking-[0.4em]">EXCLUSIVE ACCESS</p>
            <h2 class="font-headline-lg text-headline-lg md:text-display-lg-mobile text-white mb-6">Join the Digital Silk List</h2>
            <p class="font-body-lg text-white/60 mb-12 max-w-lg mx-auto">Be the first to receive AI-curated collections, private maison invitations, and early access to seasonal drops.</p>
            <form class="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto" onsubmit="event.preventDefault(); App.showToast('Subscribed successfully!');">
                <input class="flex-grow px-6 py-5 bg-white/10 border border-white/20 focus:border-white/50 focus:ring-0 text-white placeholder-white/40 font-body-md transition-all backdrop-blur-sm" placeholder="Enter your email address" type="email"/>
                <button class="px-10 py-5 bg-white text-primary font-button text-button uppercase tracking-[0.2em] hover:bg-white/90 transition-all duration-300 whitespace-nowrap" type="submit">Subscribe</button>
            </form>
            <p class="font-label-caps text-[10px] text-white/30 mt-6 tracking-widest">NO SPAM. UNSUBSCRIBE ANYTIME.</p>
        </div>
    </div>
</section>

<!-- Footer -->
<footer class="bg-surface-container-lowest">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <!-- Main Footer -->
        <div class="py-12 md:py-16 lg:py-24 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 md:gap-gutter">
            <!-- Brand -->
            <div class="col-span-2 md:col-span-4 lg:col-span-4">
                <h2 class="font-headline-lg text-headline-md text-primary mb-4 cursor-pointer" onclick="Router.navigate('/landing')">FashionWardrobe</h2>
                <p class="font-body-md text-secondary max-w-xs mb-8 leading-relaxed">Redefining high-end fashion through the lens of artificial intelligence and impeccable editorial curation.</p>
                <div class="flex gap-4">
                    <a href="#" class="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-all duration-300">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                    </a>
                    <a href="#" class="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-all duration-300">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <a href="#" class="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-all duration-300">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                </div>
            </div>
            <!-- Explore -->
            <div class="col-span-1 lg:col-span-2 lg:col-start-6">
                <h4 class="font-label-caps text-label-caps text-primary mb-6">EXPLORE</h4>
                <ul class="space-y-4">
                    <li><a class="text-secondary hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#/landing">Journal</a></li>
                    <li><a class="text-secondary hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#/landing">Lookbook</a></li>
                    <li><a class="text-secondary hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#/gender">Style Quiz</a></li>
                    <li><a class="text-secondary hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#/saved">Saved Looks</a></li>
                </ul>
            </div>
            <!-- Company -->
            <div class="col-span-1 lg:col-span-2">
                <h4 class="font-label-caps text-label-caps text-primary mb-6">COMPANY</h4>
                <ul class="space-y-4">
                    <li><a class="text-secondary hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#">About</a></li>
                    <li><a class="text-secondary hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#">Careers</a></li>
                    <li><a class="text-secondary hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#">Press</a></li>
                    <li><a class="text-secondary hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#">Contact</a></li>
                </ul>
            </div>
            <!-- Legal -->
            <div class="col-span-1 lg:col-span-2">
                <h4 class="font-label-caps text-label-caps text-primary mb-6">LEGAL</h4>
                <ul class="space-y-4">
                    <li><a class="text-secondary hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#">Privacy Policy</a></li>
                    <li><a class="text-secondary hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#">Terms of Service</a></li>
                    <li><a class="text-secondary hover:text-primary transition-all duration-300 font-body-md text-[14px]" href="#">Cookie Policy</a></li>
                </ul>
            </div>
        </div>
        <!-- Bottom Bar -->
        <div class="py-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="font-label-caps text-[10px] text-secondary tracking-widest">© ${new Date().getFullYear()} FASHIONWARDROBE. ALL RIGHTS RESERVED.</p>
            <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span class="font-label-caps text-[10px] text-secondary tracking-widest">STOCKHOLM</span>
                <span class="text-outline-variant mx-2">·</span>
                <span class="font-label-caps text-[10px] text-secondary tracking-widest">PARIS</span>
                <span class="text-outline-variant mx-2">·</span>
                <span class="font-label-caps text-[10px] text-secondary tracking-widest">NEW YORK</span>
            </div>
        </div>
    </div>
</footer>
        `;
    }

    function init() {
        // ---- Render Nav into persistent container ----
        const navContainer = document.getElementById('persistent-nav');
        if (navContainer) {
            navContainer.innerHTML = getNavHTML();
        }

        // ---- Search Overlay Toggle ----
        const searchOpenBtn = document.getElementById('search-open-btn');
        const searchOverlay = document.getElementById('search-overlay');
        const searchCloseBtn = document.getElementById('search-close-btn');
        const searchInput = document.getElementById('nav-search-input');

        function openSearch() {
            if (searchOverlay) {
                searchOverlay.style.transform = 'translateY(0)';
                searchOverlay.classList.remove('opacity-0', 'pointer-events-none');
                searchOverlay.classList.add('opacity-100', 'pointer-events-auto');
                setTimeout(() => searchInput?.focus(), 300);
            }
        }

        function closeSearch() {
            if (searchOverlay) {
                searchOverlay.style.transform = 'translateY(-100%)';
                searchOverlay.classList.add('opacity-0', 'pointer-events-none');
                searchOverlay.classList.remove('opacity-100', 'pointer-events-auto');
                if (searchInput) searchInput.value = '';
            }
        }

        searchOpenBtn?.addEventListener('click', openSearch);
        searchCloseBtn?.addEventListener('click', closeSearch);
        // Close search on Escape key
        searchInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSearch();
        });

        // ---- Account Dropdown ----
        const accountToggle = document.getElementById('account-toggle-btn');
        const accountDropdown = document.getElementById('account-dropdown');
        if (accountToggle && accountDropdown) {
            accountToggle.addEventListener('click', () => {
                const isOpen = !accountDropdown.classList.contains('opacity-0');
                if (isOpen) {
                    accountDropdown.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
                    accountDropdown.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
                } else {
                    accountDropdown.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
                    accountDropdown.classList.add('opacity-100', 'pointer-events-auto', 'scale-100');
                }
            });
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!document.getElementById('account-dropdown-wrapper')?.contains(e.target)) {
                    accountDropdown.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
                    accountDropdown.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
                }
            });
            // Logout button
            document.getElementById('logout-btn')?.addEventListener('click', () => {
                Store.clearAuth();
                App.showToast('Signed out successfully');
                Router.navigate('/landing');
            });
        }

        document.getElementById('hero-cta')?.addEventListener('click', () => {
            if (Store.isAuthenticated()) {
                Router.navigate('/gender');
            } else {
                Router.navigate('/auth');
            }
        });

        // ---- Hero Carousel ----
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const INTERVAL = 5000; // 5 seconds per slide
        let current = 0;
        let timer = null;

        function goToSlide(index) {
            // Bounds check
            if (index < 0) index = 0;
            if (index > slides.length - 1) index = slides.length - 1;

            // Fade out all slides
            slides.forEach(s => { s.style.opacity = '0'; });
            // Fade in target
            slides[index].style.opacity = '1';

            // Reset all dots
            dots.forEach(dot => {
                dot.classList.remove('w-[28px]', 'bg-white/20');
                dot.classList.add('w-2.5', 'bg-white/40');
                const bar = dot.querySelector('.carousel-progress');
                if (bar) {
                    bar.style.transition = 'none';
                    bar.style.width = '0%';
                    bar.style.opacity = '0';
                }

                // Hide ripple
                const ripple = dot.querySelector('.ripple-anim');
                if (ripple) {
                    ripple.classList.remove('animate-ripple');
                    ripple.classList.add('hidden');
                }
            });

            // Animate active dot
            current = index;

            // Update season text
            const seasonText = document.getElementById('hero-season-text');
            if (seasonText) {
                seasonText.style.opacity = '0';
                setTimeout(() => {
                    seasonText.textContent = slides[current].dataset.title || 'Autumn / Winter 2024';
                    seasonText.style.opacity = '1';
                }, 300); // fade out then update and fade in
            }

            const activeDot = dots[current];
            if (activeDot) {
                activeDot.classList.remove('w-2.5', 'bg-white/40');
                activeDot.classList.add('w-[28px]', 'bg-white/20');

                // Trigger ripple
                const activeRipple = activeDot.querySelector('.ripple-anim');
                if (activeRipple) {
                    activeRipple.classList.remove('hidden');
                    // Force reflow
                    void activeRipple.offsetWidth;
                    activeRipple.classList.add('animate-ripple');
                }

                const activeBar = activeDot.querySelector('.carousel-progress');
                if (activeBar) {
                    activeBar.style.opacity = '1';
                    // Force reflow before starting animation
                    void activeBar.offsetWidth;
                    activeBar.style.transition = `width ${INTERVAL}ms linear`;
                    activeBar.style.width = '100%';
                }
            }

            // Update arrow states
            if (prevBtn) {
                if (current === 0) {
                    prevBtn.classList.add('opacity-30', 'pointer-events-none');
                } else {
                    prevBtn.classList.remove('opacity-30', 'pointer-events-none');
                }
            }
            if (nextBtn) {
                if (current === slides.length - 1) {
                    nextBtn.classList.add('opacity-30', 'pointer-events-none');
                } else {
                    nextBtn.classList.remove('opacity-30', 'pointer-events-none');
                }
            }
        }

        function nextSlide() {
            if (current < slides.length - 1) {
                goToSlide(current + 1);
            } else {
                goToSlide(0); // loop back
            }
        }

        function prevSlide() {
            if (current > 0) {
                goToSlide(current - 1);
            }
        }

        function startAutoPlay() {
            stopAutoPlay();
            timer = setInterval(nextSlide, INTERVAL);
        }

        function stopAutoPlay() {
            if (timer) { clearInterval(timer); timer = null; }
        }

        // Click handlers for dots
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const idx = parseInt(dot.dataset.slide);
                goToSlide(idx);
                startAutoPlay(); // restart timer on manual click
            });
        });

        // Click handlers for arrows
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoPlay();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoPlay();
            });
        }

        // Start carousel
        if (slides.length > 0) {
            goToSlide(0);
            startAutoPlay();
        }

        // Cleanup on route change
        window.addEventListener('hashchange', function cleanup() {
            stopAutoPlay();
            window.removeEventListener('hashchange', cleanup);
        }, { once: true });

        // ---- Nav Scroll Transition ----
        const nav = document.getElementById('main-nav');
        function handleScroll() {
            if (window.scrollY > 80) {
                nav.classList.remove('nav-transparent');
                nav.classList.add('nav-solid');
            } else {
                nav.classList.remove('nav-solid');
                nav.classList.add('nav-transparent');
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        // ---- Scroll Reveal ----
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('#app section').forEach(section => {
            section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
            observer.observe(section);
        });
    }

    return { render, init };
})();
