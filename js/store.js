/* ============================================
   FashionWardrobe — State Management
   ============================================ */

const Store = (() => {
    const SESSION_KEY = 'fw_session';
    const SAVED_KEY = 'fw_saved_outfits';
    const AUTH_KEY = 'fw_auth';

    // Default session state
    const defaultState = {
        gender: null,
        occasions: [],
        stylePersonality: [],
        currentOutfit: {
            topwear: [],
            outerwear: [],
            bottomwear: [],
            footwear: [],
            accessories: []
        },
        itemColors: {}
    };

    // --- Session State (quiz flow) ---
    function _getSession() {
        try {
            const raw = sessionStorage.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) : { ...defaultState };
        } catch {
            return { ...defaultState };
        }
    }

    function _setSession(state) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
    }

    function get(key) {
        const state = _getSession();
        return state[key];
    }

    function set(key, value) {
        const state = _getSession();
        state[key] = value;
        _setSession(state);
    }

    function getAll() {
        return _getSession();
    }

    function clearSession() {
        sessionStorage.removeItem(SESSION_KEY);
    }

    // --- Auth (localStorage for persistence) ---
    function getAuth() {
        try {
            const raw = localStorage.getItem(AUTH_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function setAuth(authData) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    }

    function clearAuth() {
        localStorage.removeItem(AUTH_KEY);
    }

    function isAuthenticated() {
        return getAuth() !== null;
    }

    // --- Saved Outfits (localStorage for persistence) ---
    function getSaved() {
        try {
            const raw = localStorage.getItem(SAVED_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    function saveOutfit(outfit) {
        const saved = getSaved();
        const entry = {
            id: 'outfit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            ...outfit,
            savedAt: new Date().toISOString()
        };
        saved.unshift(entry);
        localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
        return entry;
    }

    function removeOutfit(id) {
        const saved = getSaved().filter(o => o.id !== id);
        localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
    }

    function isOutfitSaved(name) {
        return getSaved().some(o => o.name === name);
    }

    // --- Wishlist (localStorage for persistence) ---
    const WISHLIST_KEY = 'fw_wishlist';

    function getWishlist() {
        try {
            const raw = localStorage.getItem(WISHLIST_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    function addToWishlist(item) {
        const list = getWishlist();
        const entry = {
            id: 'wish_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            ...item,
            addedAt: new Date().toISOString()
        };
        list.unshift(entry);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
        return entry;
    }

    function removeFromWishlist(id) {
        const list = getWishlist().filter(i => i.id !== id);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    }

    function isInWishlist(name) {
        return getWishlist().some(i => i.name === name);
    }

    return {
        get, set, getAll, clearSession,
        getAuth, setAuth, clearAuth, isAuthenticated,
        getSaved, saveOutfit, removeOutfit, isOutfitSaved,
        getWishlist, addToWishlist, removeFromWishlist, isInWishlist
    };
})();

window.Store = Store;
