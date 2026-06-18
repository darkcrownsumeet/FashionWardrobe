/* ============================================
   FashionWardrobe — Hash-Based Router
   ============================================ */

const Router = (() => {
    const routes = {};
    let appContainer = null;

    function register(path, pageModule) {
        routes[path] = pageModule;
    }

    function init(containerId) {
        appContainer = document.getElementById(containerId);
        window.addEventListener('hashchange', handleRoute);
        handleRoute();
    }

    function navigate(path) {
        window.location.hash = path;
    }

    function handleRoute() {
        let fullHash = window.location.hash.slice(1) || '/landing';
        let basePath = fullHash.split('?')[0];
        let targetPath = basePath;
        
        // --- Route Guards ---
        const gender = Store.get('gender');
        const occasions = Store.get('occasions');
        const styles = Store.get('stylePersonality');
        const outfit = Store.get('currentOutfit');
        const hasOutfit = outfit && Object.values(outfit).some(arr => arr.length > 0);
        const budget = Store.get('budget');

        if (targetPath === '/occasion' && !gender) targetPath = '/gender';
        if (targetPath === '/style' && (!occasions || occasions.length === 0)) targetPath = '/occasion';
        if (targetPath === '/outfit' && (!styles || styles.length === 0)) targetPath = '/style';
        if (targetPath === '/color-budget' && !hasOutfit) targetPath = '/outfit';
        if (targetPath === '/results' && !budget && !fullHash.includes('?data=')) targetPath = '/color-budget';
        
        if (targetPath !== basePath) {
            window.location.hash = targetPath;
            return;
        }
        // --------------------

        const pageModule = routes[basePath] || routes['/landing'];

        if (!pageModule || !appContainer) return;

        // Clear persistent nav (pages re-render it in their init if needed)
        const persistentNav = document.getElementById('persistent-nav');
        if (persistentNav) persistentNav.innerHTML = '';

        // Render page HTML
        appContainer.innerHTML = pageModule.render();
        appContainer.classList.remove('page-enter');
        void appContainer.offsetWidth; // force reflow
        appContainer.classList.add('page-enter');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Initialize page interactions
        if (pageModule.init) {
            // Small delay to ensure DOM is ready
            requestAnimationFrame(() => {
                pageModule.init();
            });
        }
    }

    function getCurrentRoute() {
        return window.location.hash.slice(1) || '/landing';
    }

    return { register, init, navigate, getCurrentRoute };
})();
