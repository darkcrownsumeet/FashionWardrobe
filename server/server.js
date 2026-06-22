const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

app.post('/api/recommend', async (req, res) => {
    try {
        const { prefs, selectedItems, fallbackHero } = req.body;

        const styles = (prefs.stylePersonality || []).join(', ') || 'fashionable';
        const occasion = prefs.occasions?.[0] || 'casual';
        const itemColors = prefs.itemColors || {};

        const hasSelections = selectedItems && selectedItems.length > 0;

        const wearingList = hasSelections
            ? selectedItems.map(i => {
                const colorData = itemColors[i.id];
                const colorDesc = colorData
                    ? `(${colorData.primary}${colorData.secondary ? ' + ' + colorData.secondary : ''}${colorData.pattern && colorData.pattern !== 'Solid' ? ', ' + colorData.pattern : ''})`
                    : '';
                return `ID:${i.id} | ${i.name} ${colorDesc} [${i.category}]`;
            }).join('\n  - ')
            : `a ${styles} outfit for ${occasion}`;

        const itemIdList = hasSelections ? selectedItems.map(i => i.id) : [];

        const stylesBullets = (prefs.stylePersonality || []).map(s => `- ${s}`).join('\n') || '- Fashionable';

        const prompt = `You are an expert fashion stylist.

The user has selected these clothing items (do NOT add or invent items — only use IDs from this list):
  - ${wearingList}

PRIMARY STYLING CONSTRAINTS (HIGH PRIORITY)

Occasion:
- ${occasion}

Style Preferences:
${stylesBullets}

STYLE AUTHORITY RULE

The selected Occasion and Style Preferences are primary styling constraints.

All outfit collections, recommendations, and explanations must strongly reflect the selected occasion and style preferences.

When a conflict exists between a generic fashion recommendation and the selected style/occasion, prioritize the selected style and occasion.



YOUR TASK:
Generate meaningful, distinct outfit collections using ONLY subsets of the user's selected items above.

Do not generate duplicate or near-duplicate collections.

If the available selected items cannot produce multiple genuinely different outfits, return fewer collections.

-Quality is more important than quantity.
- Be completely free of style or color clashes
- Have a short evocative 2-3 word name (e.g. "Clean Casual", "Smart Edge", "Bold Statement")
- Have a currentScore (integer 50-84) representing how good the selected items alone look together
- Have a projectedScore (integer currentScore+8 to currentScore+18, max 99) representing how good they'll look AFTER adding AI suggestions
- Include exactly 4 AI-suggested additions that complete this specific collection. DO NOT name specific colors for these items (e.g. use "Slim-Fit Chinos" instead of "Black Chinos"). Instead, provide a colors object with match/avoid suggestions.
- CRITICAL INSTRUCTION: The colors match/avoid arrays MUST ONLY contain exact, basic color names (e.g., "Navy", "Olive", "Black", "White", "Burgundy"). ABSOLUTELY NO materials, fabrics, textures, or patterns (DO NOT output "leather", "plastic", "denim", "canvas", "striped", or "wash"). Output ONLY pure color names.
- HARMONY RULE:

You are building ONE cohesive outfit.

Within a collection:

- A color must never appear in both a MATCH and AVOID array.
- Colors from the user's selected base items must never appear in any AVOID array.
- Before finalizing the collection, verify that all MATCH and AVOID suggestions are globally consistent across all suggested items.
The number of collections should depend on the diversity of meaningful outfit possibilities, not the number of selected items alone.
Return only as many collections as can be meaningfully differentiated.

FINAL VALIDATION:

Before responding:

1. Verify no color appears in both MATCH and AVOID anywhere in the same collection.
2. Verify no base-item color appears in an AVOID list.
3. Verify collections are meaningfully different.
4. If a conflict exists, remove the conflicting color from the AVOID list rather than creating a contradiction.
5. Never recommend an addition whose suggested MATCH colors are entirely incompatible with the user's base item colors.




Respond ONLY with a valid JSON object — no markdown, no explanation, just the JSON:

{
  "collections": [
    {
      "name": "Clean Casual",
      "currentScore": 74,
      "projectedScore": 91,
      "yourLookItemIds": ["id1", "id2", "id3"],
      "accessories": [
        {
          "name": "Canvas Sneakers",
          "category": "footwear",
          "why": "Clean low-top sneakers complete the relaxed silhouette perfectly.",
          "colors": { "match": ["White", "Cream", "Light Grey"], "avoid": ["Neon", "Dark Brown"] }
        }
      ]
    }
  ]
}

Rules:
- yourLookItemIds must ONLY contain IDs from this list: [${itemIdList.join(', ')}]
- Collections must be meaningfully different in styling direction, recommended additions, or outfit character.
- Do not force different subsets if only one strong base outfit exists.
- currentScore must be between 50 and 84
- projectedScore must be currentScore + 8 to 18 (never exceed 99)
- accessories must be exactly 4 items per collection
- No markdown, no explanation — pure JSON only`;

        const resultFromAPI = await model.generateContent(prompt);
        let jsonText = resultFromAPI.response.text();
        jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        const parsed = JSON.parse(jsonText);

        // Build a lookup map for selected items
        const itemMap = {};
        if (hasSelections) {
            selectedItems.forEach(item => {
                itemMap[item.id] = {
                    name: item.name,
                    image: item.image,
                    category: item.category,
                    objectPosition: item.objectPosition || 'center center',
                    colorData: itemColors[item.id] || null,
                    id: item.id
                };
            });
        }

        // Process each collection
        const collections = (parsed.collections || []).slice(0, 3).map(col => {
            // Resolve yourLook items from IDs
            const yourLook = (col.yourLookItemIds || [])
                .filter(id => itemMap[id])
                .map(id => itemMap[id]);

            // Format accessories
            const accessories = (col.accessories || []).slice(0, 4).map(item => ({
                ...item
            }));

            return {
                name: col.name || 'Curated Look',
                currentScore: Math.min(84, Math.max(50, col.currentScore || 70)),
                projectedScore: Math.min(99, Math.max(60, col.projectedScore || 88)),
                yourLook,
                accessories
            };
        });

        // Fallback: if AI didn't return valid collections, use all selected items
        if (collections.length === 0) {
            const allItems = hasSelections
                ? selectedItems.map(item => ({
                    name: item.name,
                    image: item.image,
                    category: item.category,
                    objectPosition: item.objectPosition || 'center center',
                    colorData: itemColors[item.id] || null,
                    id: item.id
                }))
                : (fallbackHero ? [{ ...fallbackHero }] : []);

            collections.push({
                name: 'Your Look',
                currentScore: 72,
                projectedScore: 89,
                yourLook: allItems,
                accessories: []
            });
        }

        res.json({ collections });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
