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
        Router.register('/color-budget', ColorBudgetPage);
        Router.register('/results', ResultsPage);
        Router.register('/saved', SavedPage);
        Router.register('/wishlist', WishlistPage);

        // Initialize router
        Router.init('app');
    }

    // Boot when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { showToast };
})();
