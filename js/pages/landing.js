const LandingPage = (function () {
  function render() {
    return `<div id="intro-overlay" class="fixed inset-0 z-[100000] bg-background dark:bg-foreground flex items-center justify-center transition-all duration-[500ms] ease-in-out"><h1 class="text-4xl font-extrabold tracking-tighter sm:text-6xl text-foreground dark:text-background">FASHIONWARDROBE<span class="text-brand">.</span></h1></div><!--\$--><div class="min-h-screen bg-background dark:bg-foreground text-foreground dark:text-background selection:bg-brand selection:text-brand-foreground"><nav class="sticky top-0 z-50 flex items-baseline justify-between border-b border-foreground dark:border-background bg-background/90 dark:bg-foreground/90 px-6 py-4 backdrop-blur-md"><div class="font-mono text-xs font-bold tracking-tighter">FASHIONWARDROBE<sup class="ml-1 text-brand">®</sup></div><div class="hidden gap-8 font-mono text-[10px] uppercase tracking-widest sm:flex"><button onclick="if(window.Walkthrough) window.Walkthrough.startLandingTour()" class="transition-colors hover:text-brand" title="Replay Walkthrough">[?] HELP</button><a href="#/gender" class="transition-colors hover:text-brand">Discover</a><a href="#/saved" class="transition-colors hover:text-brand">Archive</a><a href="#/wishlist" id="landing-wishlist-link" class="transition-colors hover:text-brand">Wishlist [0]</a><a href="#/auth" id="landing-auth-link" class="transition-colors hover:text-brand">Profile</a></div></nav><main><section class="grid grid-cols-1 border-b border-foreground dark:border-background lg:grid-cols-12 lg:h-[calc(100dvh-49px)] overflow-hidden"><div class="flex h-full flex-col border-foreground dark:border-background px-6 py-6 lg:col-span-7 lg:border-r lg:pt-8 lg:pb-6 overflow-y-auto"><div class="animate-[reveal_0.8s_var(--ease-out-expo)_both]"><p class="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted"><span class="h-px w-8 bg-brand"></span>INTRODUCTION</p><h1 id="tour-main-title" class="text-[clamp(2.5rem,5.5vw,6.5rem)] font-extrabold uppercase leading-[0.85] tracking-tighter font-sans antialiased transform-gpu translate-z-0">Find Your<br>Perfect<br><span class="text-brand">Outfit</span><br>Match<span class="text-brand">.</span></h1></div><div class="mt-12"><p class="mb-6 max-w-md font-mono text-xs leading-relaxed text-muted">ELEVATE YOUR WARDROBE. PERSONALIZED OUTFIT RECOMMENDATIONS STYLED JUST FOR YOU. FIND YOUR PERFECT LOOK IN UNDER A MINUTE.</p><div class="flex flex-wrap gap-4 [animation-delay:150ms] animate-[reveal_0.8s_var(--ease-out-expo)_both]"><button id="start-journey-btn" onclick="window.Router.navigate('/gender')" class="group flex items-center gap-3 bg-brand px-6 py-3 font-mono text-xs uppercase tracking-tighter text-brand-foreground transition-opacity hover:opacity-90">Generate Look<span class="transition-transform group-hover:translate-x-1">→</span></button><button onclick="window.Router.navigate('/saved')" class="border border-foreground dark:border-background px-6 py-3 font-mono text-xs uppercase tracking-tighter transition-all hover:bg-foreground dark:hover:bg-background hover:text-background dark:hover:text-foreground">Archive View</button></div></div></div><div class="group relative aspect-[4/5] overflow-hidden lg:col-span-5 lg:aspect-auto h-full"><div id="hero-parallax-wrapper" class="w-full h-full will-change-transform"><img id="hero-main-img" src="/assets/img/Male_Streetwear.jpg" alt="Editorial cover — neural-curated silhouette" width="768" height="1024" class="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 animate-clip-reveal"><span class="absolute right-6 top-6 bg-brand px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-brand-foreground">New Drop</span><div class="absolute bottom-0 left-0 right-0 flex items-end justify-between bg-gradient-to-t from-background/80 to-transparent p-6 font-mono text-[10px] uppercase tracking-widest text-foreground dark:text-background"><span id="hero-main-text">FIG. 01 — Look 0042</span><span>∞ Curated Look</span></div></div></div></section><div class="grid grid-cols-2 border-b border-foreground dark:border-background md:grid-cols-4"><div class="group px-6 py-6 transition-colors hover:bg-foreground dark:hover:bg-background hover:text-background dark:hover:text-foreground  max-md:[&amp;:nth-child(n+3)]:border-t max-md:border-foreground dark:border-background"><div class="text-3xl font-extrabold tracking-tighter sm:text-4xl">4</div><div class="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted group-hover:text-background dark:hover:text-foreground/60">Curated Styles</div></div><div class="group px-6 py-6 transition-colors hover:bg-foreground dark:hover:bg-background hover:text-background dark:hover:text-foreground border-l border-foreground dark:border-background max-md:[&amp;:nth-child(n+3)]:border-t max-md:border-foreground dark:border-background"><div class="text-3xl font-extrabold tracking-tighter sm:text-4xl">500+</div><div class="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted group-hover:text-background dark:hover:text-foreground/60">Outfit Combos</div></div><div class="group px-6 py-6 transition-colors hover:bg-foreground dark:hover:bg-background hover:text-background dark:hover:text-foreground border-l border-foreground dark:border-background max-md:[&amp;:nth-child(n+3)]:border-t max-md:border-foreground dark:border-background"><div class="text-3xl font-extrabold tracking-tighter sm:text-4xl">1</div><div class="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted group-hover:text-background dark:hover:text-foreground/60">Minute Setup</div></div><div class="group px-6 py-6 transition-colors hover:bg-foreground dark:hover:bg-background hover:text-background dark:hover:text-foreground border-l border-foreground dark:border-background max-md:[&amp;:nth-child(n+3)]:border-t max-md:border-foreground dark:border-background"><div class="text-3xl font-extrabold tracking-tighter sm:text-4xl">100%</div><div class="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted group-hover:text-background dark:hover:text-foreground/60">Free Forever</div></div></div><div class="group overflow-hidden whitespace-nowrap border-b border-foreground dark:border-background bg-brand py-4 text-brand-foreground"><div class="flex w-max animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]"><div aria-hidden="false" class="flex flex-none gap-12 pr-12 font-mono text-[10px] uppercase tracking-[0.3em]"><span class="flex items-center gap-12">Minimalist Core<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Old Money<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Streetwear<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Korean Wave<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Minimalist Core<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Old Money<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Streetwear<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Korean Wave<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Minimalist Core<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Old Money<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Streetwear<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Korean Wave<!-- --> <span>✶</span></span></div><div aria-hidden="true" class="flex flex-none gap-12 pr-12 font-mono text-[10px] uppercase tracking-[0.3em]"><span class="flex items-center gap-12">Minimalist Core<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Old Money<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Streetwear<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Korean Wave<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Minimalist Core<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Old Money<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Streetwear<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Korean Wave<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Minimalist Core<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Old Money<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Streetwear<!-- --> <span>✶</span></span><span class="flex items-center gap-12">Korean Wave<!-- --> <span>✶</span></span></div></div></div><section class="px-6 py-20"><div class="mb-16 flex items-baseline justify-between border-b border-foreground/10 dark:border-background/10 pb-6"><h2 class="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted"><span class="h-px w-8 bg-brand"></span>Trending Styles</h2><span class="font-mono text-[10px]">[ SCROLL TO EXPLORE ]</span></div><div class="grid grid-cols-1 gap-px border border-foreground dark:border-background bg-foreground dark:bg-background md:grid-cols-2 lg:grid-cols-4"><div class="group flex cursor-pointer flex-col bg-background dark:bg-foreground p-6 transition-colors hover:bg-secondary"><div class="mb-6 flex items-center justify-between font-mono text-xs"><span class="font-bold">01</span><span class="text-brand opacity-0 transition-opacity group-hover:opacity-100">VIEW →</span></div><div class="mb-6 aspect-[3/4] w-full overflow-hidden bg-[var(--neutral-100)]"><img src="/assets/img/Female_Formal.jpg" alt="Minimalist Core aesthetic editorial" width="768" height="1024" loading="lazy" class="h-full w-full object-cover grayscale transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:grayscale-0" style="object-position: top;"></div><h3 class="text-lg font-bold uppercase tracking-tighter transition-colors group-hover:text-brand">Minimalist Core</h3><p class="mt-2 font-mono text-xs text-muted">Clean lines and essential pieces for everyday wear.</p></div><div class="group flex cursor-pointer flex-col bg-background dark:bg-foreground p-6 transition-colors hover:bg-secondary"><div class="mb-6 flex items-center justify-between font-mono text-xs"><span class="font-bold">02</span><span class="text-brand opacity-0 transition-opacity group-hover:opacity-100">VIEW →</span></div><div class="mb-6 aspect-[3/4] w-full overflow-hidden bg-[var(--neutral-100)]"><img src="/assets/img/Male_Wedding.jpg" alt="Old Money aesthetic editorial" width="768" height="1024" loading="lazy" class="h-full w-full object-cover grayscale transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:grayscale-0" style="object-position: top;"></div><h3 class="text-lg font-bold uppercase tracking-tighter transition-colors group-hover:text-brand">Old Money</h3><p class="mt-2 font-mono text-xs text-muted">Heritage aesthetics with timeless elegance.</p></div><div class="group flex cursor-pointer flex-col bg-background dark:bg-foreground p-6 transition-colors hover:bg-secondary"><div class="mb-6 flex items-center justify-between font-mono text-xs"><span class="font-bold">03</span><span class="text-brand opacity-0 transition-opacity group-hover:opacity-100">VIEW →</span></div><div class="mb-6 aspect-[3/4] w-full overflow-hidden bg-[var(--neutral-100)]"><img src="/assets/img/Male_Streetwear.jpg" alt="Streetwear aesthetic editorial" width="768" height="1024" loading="lazy" class="h-full w-full object-cover grayscale transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:grayscale-0"></div><h3 class="text-lg font-bold uppercase tracking-tighter transition-colors group-hover:text-brand">Streetwear</h3><p class="mt-2 font-mono text-xs text-muted">Urban casual fits and oversized silhouettes.</p></div><div class="group flex cursor-pointer flex-col bg-background dark:bg-foreground p-6 transition-colors hover:bg-secondary"><div class="mb-6 flex items-center justify-between font-mono text-xs"><span class="font-bold">04</span><span class="text-brand opacity-0 transition-opacity group-hover:opacity-100">VIEW →</span></div><div class="mb-6 aspect-[3/4] w-full overflow-hidden bg-[var(--neutral-100)]"><img src="/assets/img/Female_College.jpg" alt="Korean Wave aesthetic editorial" width="768" height="1024" loading="lazy" class="h-full w-full object-cover grayscale transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:grayscale-0" style="object-position: top;"></div><h3 class="text-lg font-bold uppercase tracking-tighter transition-colors group-hover:text-brand">Korean Wave</h3><p class="mt-2 font-mono text-xs text-muted">Trending styles from Seoul's fashion scene.</p></div></div></section><section class="bg-foreground dark:bg-background px-6 py-32 text-background dark:text-foreground"><div class="mx-auto max-w-7xl"><div class="flex flex-col items-start gap-20 lg:flex-row"><div class="lg:sticky lg:top-32 lg:w-1/2"><h2 class="mb-12 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.4em] opacity-50"><span class="h-px w-8 bg-brand"></span>Personal Styling Engine</h2><div class="mb-8 flex items-start text-7xl font-extrabold leading-none tracking-tighter sm:text-8xl xl:text-9xl">STYLED<span class="text-brand">.</span></div><p class="max-w-md text-xl leading-tight tracking-tight opacity-90">Answer 4 quick questions, get a full outfit styled just for you instantly.</p></div><div class="w-full border-background/20 lg:w-1/2 lg:border-l lg:pl-12"><div class="flex gap-6 py-12 lg:pt-0"><span class="font-mono text-xs text-brand">01</span><div><h4 class="mb-4 font-mono text-xs uppercase">Personalized Style Mapping</h4><p class="font-mono text-sm leading-relaxed opacity-60">Analyzing your preferences to recommend outfits that perfectly match your personal aesthetic.</p></div></div><div class="flex gap-6 py-12 border-t border-background/20"><span class="font-mono text-xs text-brand">02</span><div><h4 class="mb-4 font-mono text-xs uppercase">Curated Wardrobe</h4><p class="font-mono text-sm leading-relaxed opacity-60">Advanced styling logic mixing and matching topwear, bottomwear, and accessories for any occasion.</p></div></div><div class="flex gap-6 py-12 border-t border-background/20"><span class="font-mono text-xs text-brand">03</span><div><h4 class="mb-4 font-mono text-xs uppercase">Effortless Outfitting</h4><p class="font-mono text-sm leading-relaxed opacity-60">Generate complete, shoppable looks instantly so you never have to worry about what to wear.</p></div></div></div></div></div></section><section class="border-b border-foreground dark:border-background px-6 py-16 text-center"><h2 class="mb-12 font-mono text-xs uppercase tracking-[0.5em] text-brand">STYLE NEWSLETTER</h2><div class="mx-auto max-w-2xl"><p class="mb-12 text-3xl font-extrabold uppercase leading-none tracking-tighter sm:text-5xl">Get Weekly Style Inspiration</p><form onsubmit="event.preventDefault(); window.App.showToast('Thanks for subscribing! You will receive our next drop soon.'); this.reset();" class="flex flex-col border border-foreground dark:border-background md:flex-row"><input type="email" placeholder="EMAIL ADDRESS" aria-label="Email address" required class="flex-1 bg-transparent px-6 py-6 font-mono text-xs uppercase outline-none placeholder:text-muted"><button type="submit" class="bg-brand px-12 py-6 font-mono text-xs uppercase text-brand-foreground transition-opacity hover:opacity-90">Subscribe →</button></form><p class="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted">No spam. Only signal. Unsubscribe at any frequency.</p></div></section></main><footer class="px-6 py-12"><div class="grid grid-cols-2 gap-12 lg:grid-cols-4"><div class="col-span-2"><div class="mb-8 text-3xl font-extrabold tracking-tighter sm:text-4xl">FASHIONWARDROBE<span class="text-brand">.</span></div><p class="max-w-xs font-mono text-xs uppercase leading-relaxed text-muted">© FASHIONWARDROBE. DESIGNED FOR YOU.</p></div><div><h5 class="mb-6 font-mono text-[10px] uppercase text-muted">System</h5><ul class="space-y-3 font-mono text-xs"><li><a href="#" onclick="event.preventDefault(); alert('System status is optimal. All neural engines online.');" class="transition-colors hover:text-brand">Status</a></li><li><a href="#" onclick="event.preventDefault(); alert('Documentation coming soon.');" class="transition-colors hover:text-brand">Architecture</a></li><li><a href="#" onclick="event.preventDefault(); alert('Your data is encrypted and never sold.');" class="transition-colors hover:text-brand">Privacy Protocol</a></li></ul></div><div><h5 class="mb-6 font-mono text-[10px] uppercase text-muted">Social</h5><ul class="space-y-3 font-mono text-xs"><li><a href="#" onclick="event.preventDefault(); alert('Follow us @FashionWardrobe on Instagram');" class="transition-colors hover:text-brand">Instagram</a></li><li><a href="#" onclick="event.preventDefault(); alert('Check out our moodboards on Are.na');" class="transition-colors hover:text-brand">Are.na</a></li><li><a href="#" onclick="event.preventDefault(); alert('Follow us @FashionWardrobe on X');" class="transition-colors hover:text-brand">X / Twitter</a></li></ul></div></div><div class="mt-20 flex flex-col justify-between gap-4 border-t border-foreground/10 dark:border-background/10 pt-8 font-mono text-[10px] uppercase tracking-widest text-muted md:flex-row"><span>Index / Edition AW</span><span>Crafted with neural precision</span></div></footer></div><!--/\$-->`;
  }

  function init() {
    const heroImages = [
      { src: '/assets/img/Male_Streetwear.jpg', text: 'FIG. 01 — Look 0042', pos: 'center' },
      { src: '/assets/img/Female_College.jpg', text: 'FIG. 02 — Look 0184', pos: 'top' },
      { src: '/assets/img/Male_Streetwear.jpg', text: 'FIG. 03 — Look 0291', pos: 'center' },
      { src: '/assets/img/Female_Formal.jpg', text: 'FIG. 04 — Look 0405', pos: 'top' }
    ];
    let currentImageIdx = 0;
    const imgEl = document.getElementById('hero-main-img');
    const textEl = document.getElementById('hero-main-text');

    const savedLists = Store.get('savedLists') || [];
    const wlLink = document.getElementById('landing-wishlist-link');
    if (wlLink) wlLink.innerText = `Wishlist [${savedLists.length}]`;

    const user = Store.getAuth();
    const authLink = document.getElementById('landing-auth-link');
    if (authLink) authLink.innerText = user ? 'Profile / Sign Out' : 'Profile / Sign In';
    
    // Clear any existing interval to prevent overlapping if init is called multiple times
    if (window.heroRotationInterval) clearInterval(window.heroRotationInterval);
    
    if(imgEl && textEl) {
        window.heroRotationInterval = setInterval(() => {
            currentImageIdx = (currentImageIdx + 1) % heroImages.length;
            imgEl.classList.remove('opacity-100');
            imgEl.classList.add('opacity-0');
            setTimeout(() => {
                imgEl.src = heroImages[currentImageIdx].src;
                textEl.innerText = heroImages[currentImageIdx].text;
                imgEl.style.objectPosition = heroImages[currentImageIdx].pos;
                imgEl.classList.remove('opacity-0');
                imgEl.classList.add('opacity-100');
            }, 700); // Wait for fade out
        }, 4000);
    }

    // 1. Intro Overlay Fade Out
    setTimeout(() => {
      const overlay = document.getElementById("intro-overlay");
      if (overlay) {
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
        setTimeout(() => {
            overlay.remove();
            
            // Start the walkthrough if not seen
            if (!localStorage.getItem('fw_has_seen_landing_tour')) {
                localStorage.setItem('fw_has_seen_landing_tour', 'true');
                if (window.Walkthrough) window.Walkthrough.startLandingTour();
            }
        }, 500);
      } else {
            // Start the walkthrough if not seen (no overlay)
            if (!localStorage.getItem('fw_has_seen_landing_tour')) {
                localStorage.setItem('fw_has_seen_landing_tour', 'true');
                if (window.Walkthrough) window.Walkthrough.startLandingTour();
            }
      }
    }, 100);

    // 2. Text Scramble Animation on Subtitle
    const subtitle = document.querySelector("p.max-w-md.font-mono");
    if (subtitle) {
      const originalText = subtitle.innerText;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      let iteration = 0;

      setTimeout(() => {
        const interval = setInterval(() => {
          subtitle.innerText = originalText
            .split("")
            .map((letter, index) => {
              if (index < iteration) return originalText[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

          if (iteration >= originalText.length) clearInterval(interval);
          iteration += 1;
        }, 20);
      }, 200);
    }

    // 3. Scroll-triggered Reveal Animations
    if (window._landingObserver) window._landingObserver.disconnect();
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";

          // 4. Stats Counter Animation (if this is the stats section)
          if (entry.target.classList.contains("stats-section")) {
            animateStats();
            entry.target.classList.remove("stats-section"); // Only run once
          }
        }
      });
    }, observerOptions);

    document
      .querySelectorAll("section, .grid-cols-2.md\\:grid-cols-4")
      .forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(40px)";
        el.style.transition = "all 1s cubic-bezier(0.16, 1, 0.3, 1)";

        // Mark stats container
        if (el.classList.contains("grid-cols-2"))
          el.classList.add("stats-section");

        observer.observe(el);
      });
    window._landingObserver = observer;

    // 5. Stats Counter Logic
    function animateStats() {
      const stats = document.querySelectorAll(".text-3xl.font-extrabold");
      stats.forEach((stat) => {
        const text = stat.innerText;
        // Only animate numeric ones
        if (text.includes("K") || text.includes("%") || text.includes(",")) {
          let endVal = parseFloat(text.replace(/[^0-9.]/g, ""));
          if (text.includes(",")) endVal = 2180; // Hardcode for 2,180

          let startVal = 0;
          const duration = 2000;
          const startTime = performance.now();

          const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quart
            const easeOut = 1 - Math.pow(1 - progress, 4);
            const current = startVal + (endVal - startVal) * easeOut;

            if (text.includes("K")) stat.innerText = current.toFixed(1) + "K";
            else if (text.includes("%"))
              stat.innerText = current.toFixed(1) + "%";
            else if (text.includes(","))
              stat.innerText = Math.floor(current).toLocaleString();

            if (progress < 1) requestAnimationFrame(update);
            else stat.innerText = text; // Ensure exact final text
          };
          requestAnimationFrame(update);
        }
      });
    }

    // 6. Magnetic Buttons
    document.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0px, 0px)";
      });
    });

    // 7. Hover Underline on Nav Links
    document.querySelectorAll("nav a").forEach((a) => {
      a.classList.add("relative", "group");
      a.classList.remove("transition-colors", "hover:text-brand");
      const span = document.createElement("span");
      span.className =
        "absolute -bottom-1 left-0 w-0 h-px bg-brand transition-all duration-300 group-hover:w-full";
      a.appendChild(span);
    });

    // 8. Subtle Hero Parallax
    const parallaxWrapper = document.getElementById('hero-parallax-wrapper');
    if (parallaxWrapper) {
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                if (scrollY < window.innerHeight + 200) {
                    // Parallax effect: moves slower than scroll
                    parallaxWrapper.style.transform = `translateY(${scrollY * 0.15}px)`;
                }
            });
        }, { passive: true });
    }
    
    // Ensure Magnetic buttons are smooth
    document.querySelectorAll("button").forEach((btn) => {
        btn.style.transition = 'transform 0.2s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.3s';
    });



  }

  return { render, init };
})();
