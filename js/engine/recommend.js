/* ============================================
   FashionWardrobe — AI Recommendation Engine
   ============================================ */

const RecommendationEngine = (() => {
    let activeController = null;

    function abortCurrent() {
        if (activeController) {
            activeController.abort();
            activeController = null;
        }
    }

    async function generate(preferences) {
        abortCurrent(); // Abort any ongoing request before starting a new one
        const { gender, occasions, stylePersonality, currentOutfit } = preferences;
        const allProducts = typeof MockData !== 'undefined' ? MockData.getProducts() : [];
        
        // Build valid product pool for this session
        const occasion = occasions && occasions.length > 0 ? occasions[0] : null;
        const validPool = allProducts.filter(p => {
            if (gender && p.gender !== gender) return false;
            if (occasion && !p.occasions.includes(occasion)) return false;
            if (stylePersonality && stylePersonality.length > 0 && !p.styles.some(s => stylePersonality.includes(s))) return false;
            return true;
        });
        const validIds = new Set(validPool.map(p => p.id));

        // Collect all valid selected items across all categories
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
            fallbackHero = { name: "Default Look", image: "assets/img/default.jpg", isFallback: true };
        }

        // Determine API base URL
        const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:4000'
            : 'https://fashionwardrobe-api.onrender.com';

        activeController = new AbortController();
        const timeoutId = setTimeout(() => { if (activeController) activeController.abort(); }, 90000);

        // Call the backend API
        try {
            const response = await fetch(`${API_BASE}/api/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prefs: preferences, selectedItems, fallbackHero }),
                signal: activeController.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                let errMsg = 'Failed to fetch recommendations from backend';
                try {
                    const errObj = await response.json();
                    if (errObj && errObj.error) errMsg = errObj.error;
                } catch (jsonErr) {}
                throw new Error(errMsg);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let dataObj = null;
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep the incomplete last line in the buffer
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const parsed = JSON.parse(line.substring(6));
                            if (parsed.status) {
                                // Emit progress update
                                document.dispatchEvent(new CustomEvent('recommendation-progress', { detail: parsed.status }));
                            }
                            if (parsed.result) {
                                dataObj = parsed.result;
                            }
                            if (parsed.error) {
                                throw new Error(parsed.error);
                            }
                        } catch(e) {
                            // ignore parse errors for partial chunks
                        }
                    }
                }
            }

            if (!dataObj) throw new Error("Stream ended without result");
            
            // Enrich with user's selected colors from Step 5
            if (dataObj.collections) {
                const itemColors = Store.get('itemColors') || {};
                dataObj.collections.forEach(col => {
                    if (col.yourLook) {
                        col.yourLook.forEach(item => {
                            if (itemColors[item.id]) {
                                item.colorData = { primary: itemColors[item.id], pattern: 'Solid' }; // Defaulting pattern to solid when overriding with user color
                            }
                        });
                    }
                });
            }
            return dataObj;

        } catch (e) {
            console.error("Styling Engine Error:", e);
            // Offline fallback — return a single collection with all selected items
            const allItems = selectedItems.length > 0
                ? selectedItems.map(item => ({
                    name: item.name,
                    image: item.image,
                    category: item.category,
                    objectPosition: item.objectPosition || 'center center',
                    id: item.id
                }))
                : (fallbackHero ? [fallbackHero] : []);

            return {
                collections: [
                    {
                        name: 'Your Look',
                        currentScore: 72,
                        projectedScore: 89,
                        yourLook: allItems,
                        accessories: [],
                        isOffline: true,
                        offlineMsg: `Could not connect to AI engine. (${API_BASE})`
                    }
                ]
            };
        }
    }

    return { generate, abortCurrent };
})();

window.RecommendationEngine = RecommendationEngine;
