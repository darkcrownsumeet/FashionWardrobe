/* ============================================
   FashionWardrobe — AI Recommendation Engine V3
   ============================================ */

const RecommendationEngine = (() => {

    async function generate(preferences) {
        const { gender, occasions, stylePersonality, currentOutfit, budget } = preferences;
        const allProducts = typeof MockData !== 'undefined' ? MockData.getProducts() : [];
        
        // Build valid product pool for this exact session (gender + occasion + style)
        const occasion = occasions && occasions.length > 0 ? occasions[0] : null;
        const validPool = allProducts.filter(p => {
            if (gender && p.gender !== gender && p.gender !== 'unisex') return false;
            if (occasion && !p.occasions.includes(occasion)) return false;
            if (stylePersonality && stylePersonality.length > 0 && !p.styles.some(s => stylePersonality.includes(s))) return false;
            return true;
        });
        const validIds = new Set(validPool.map(p => p.id));

        // Collect ALL valid selected items across all categories (not just one anchor)
        let selectedItems = [];
        if (currentOutfit) {
            const cats = ['topwear', 'outerwear', 'bottomwear', 'footwear', 'accessories'];
            for (const cat of cats) {
                const ids = (currentOutfit[cat] || []).filter(id => validIds.has(id));
                ids.forEach(id => {
                    const product = validPool.find(p => p.id === id);
                    if (product) selectedItems.push(product);
                });
            }
        }

        let fallbackHero = null;
        if (selectedItems.length === 0) {
            // Safe fallback if UI validation is bypassed
            fallbackHero = { name: "Default Look", image: "assets/img/default.jpg", isFallback: true };
        }

        // Determine API base URL
        const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:4000' 
            : 'https://fashionwardrobe-api.onrender.com'; // Change this to real prod URL later

        // Call the backend API with ALL selected items
        try {
            const response = await fetch(`${API_BASE}/api/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prefs: preferences, selectedItems, fallbackHero })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recommendations from backend');
            }

            const data = await response.json();
            return data;
            
        } catch (e) {
            console.error("AI Engine Error:", e);
            const heroItem = selectedItems.length > 0 ? selectedItems[0] : fallbackHero;
            return {
                yourLook: selectedItems.length > 0 ? selectedItems : (fallbackHero ? [fallbackHero] : []),
                accessories: [],
                explanation: `We couldn't connect to the AI engine. Please ensure the backend server is running. (${API_BASE})`,
                attributes: ["OFFLINE MODE"],
                isOffline: true
            };
        }
    }

    return { generate };
})();
