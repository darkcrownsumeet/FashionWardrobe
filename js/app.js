/* ============================================
   FashionWardrobe — App Initialization
   ============================================ */

const App = (() => {
    let toastTimeout = null;

    function showToast(message) {
        let toast = document.getElementById('app-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'app-toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.className = 'toast';
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    function init() {
        // Register all routes
        Router.register('/landing', LandingPage);
        Router.register('/auth', AuthPage);
        Router.register('/gender', GenderPage);
        Router.register('/occasion', OccasionPage);
        Router.register('/style', StylePage);
        Router.register('/outfit', OutfitPage);
        Router.register('/color', ColorPage);
        Router.register('/results', ResultsPage);
        Router.register('/saved', ArchivePage);
        Router.register('/archive', ArchivePage);
        Router.register('/view', ViewLookPage);
        Router.register('/wishlist', WishlistPage);

        // Initialize router
        Router.init('app');
    }

    function initCursor() {
        if (window.innerWidth < 768) return; // Disable on mobile
        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        cursor.className = 'fixed top-0 left-0 w-8 h-8 rounded-full border border-brand pointer-events-none z-[99999] transition-transform duration-75 ease-out hidden md:block mix-blend-difference flex items-center justify-center';
        const dot = document.createElement('div');
        dot.className = 'w-1 h-1 bg-brand rounded-full transition-transform duration-300';
        cursor.appendChild(dot);
        document.body.appendChild(cursor);
        document.body.style.cursor = 'none';
        
        let cursorX = 0; let cursorY = 0;
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX; cursorY = e.clientY;
            cursor.style.transform = `translate3d(${cursorX - 16}px, ${cursorY - 16}px, 0)`;
        });
        
        const bindHover = () => {
            document.querySelectorAll('a, button, input').forEach(el => {
                if(el.dataset.cursorBound) return;
                el.dataset.cursorBound = 'true';
                el.addEventListener('mouseenter', () => {
                    cursor.classList.add('bg-brand', 'scale-150');
                    dot.classList.add('scale-0');
                });
                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove('bg-brand', 'scale-150');
                    dot.classList.remove('scale-0');
                });
            });
        };
        window.addEventListener('hashchange', () => setTimeout(bindHover, 100));
        setTimeout(bindHover, 100);
    }

    // Boot when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { init(); initCursor(); });
    } else {
        init();
        initCursor();
    }

    return { showToast };
})();

window.App = App;
