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
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post('/api/recommend', async (req, res) => {
    try {
        const { prefs, selectedItems, fallbackHero } = req.body;

        const styles = (prefs.stylePersonality || []).join(', ') || 'fashionable';
        const occasion = prefs.occasions?.[0] || 'casual';
        const budget = prefs.budget || 'Mid-range';
        const itemColors = prefs.itemColors || {};

        const hasSelections = selectedItems && selectedItems.length > 0;
        const wearingList = hasSelections
            ? selectedItems.map(i => {
                const colorData = itemColors[i.id];
                const colorDesc = colorData ? `(${colorData.primary}${colorData.secondary ? ' + ' + colorData.secondary : ''}${colorData.pattern && colorData.pattern !== 'Solid' ? ', ' + colorData.pattern : ''})` : '';
                return `${i.name} ${colorDesc} [${i.category}]`;
            }).join(', ')
            : `a ${styles} outfit for ${occasion}`;

        const coveredCategories = hasSelections ? [...new Set(selectedItems.map(i => i.category))] : [];
        const missingCategories = ['topwear', 'bottomwear', 'outerwear', 'footwear', 'accessories']
            .filter(c => !coveredCategories.includes(c));

        const prompt = `You are an expert fashion stylist and style advisor.

The user is currently wearing: ${wearingList}
Style: ${styles} | Occasion: ${occasion} | Budget: ${budget}

STEP 1 - CLASH ANALYSIS:
Carefully analyze the outfit for:
a) ITEM CLASHES: Do any items clash stylistically? (e.g., two outerwear layers, mixed formality levels, styles that conflict)
b) COLOR CLASHES: Do the colors of these items clash? (e.g., competing tones, clashing warm/cool mixes, patterns fighting)

STEP 2 - RECOMMENDATIONS:
Based on your analysis, respond with a valid JSON object (no markdown, no explanation - just the JSON object):

If NO significant clashes exist, use this structure:
{
  "clashes": [],
  "mode": "single",
  "matchScore": 96, // An integer from 85 to 99 representing the overall cohesion of the outfit
  "accessories": [
    { 
      "name": "Item Name", 
      "description": "brief visual", 
      "price": 50, 
      "category": "footwear", 
      "why": "one sentence why it pairs with the outfit",
      "colors": { "match": ["Navy", "Olive"], "avoid": ["Neon Green"] }
    }
  ] // exactly 4 items that fill missing categories: ${missingCategories.join(', ')}
}

If CLASHES exist, use this structure:
{
  "clashes": [
    {
      "type": "item_clash" | "color_clash",
      "conflicting": ["Item1 or Color1", "Item2 or Color2"],
      "reason": "1-2 sentence honest explanation of why this clashes",
      "tip": "short actionable tip"
    }
  ],
  "mode": "dual",
  "matchScore": 65, // An integer from 45 to 80 representing how poorly the outfit works before intervention
  "scenarioA": {
    "keep": "Name of item to keep in this scenario",
    "drop": "Name of item to drop",
    "label": "Short scenario label e.g. 'The Relaxed Streetwear Look'",
    "accessories": [
      { 
        "name": "Item Name", 
        "description": "brief visual", 
        "price": 50, 
        "category": "footwear", 
        "why": "why it works with kept item",
        "colors": { "match": ["Navy", "Olive"], "avoid": ["Neon Green"] }
      }
    ] // exactly 4 items
  },
  "scenarioB": {
    "keep": "Name of other item to keep",
    "drop": "Name of item to drop",
    "label": "Short scenario label e.g. 'The Structured Casual Look'",
    "accessories": [
      { 
        "name": "Item Name", 
        "description": "brief visual", 
        "price": 50, 
        "category": "footwear", 
        "why": "why it works with kept item",
        "colors": { "match": ["Navy", "Olive"], "avoid": ["Neon Green"] }
      }
    ] // exactly 4 items
  }
}

Be honest, direct and fashion-forward. Only flag genuine clashes — not minor style differences.`;

        const resultFromAPI = await model.generateContent(prompt);
        let jsonText = resultFromAPI.response.text();
        jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        const parsed = JSON.parse(jsonText);

        // Helper to generate image
        const makeImage = (item) => {
            const imagePrompt = encodeURIComponent(
                `High fashion editorial product photography, ${item.name}, ${item.description}, isolated on clean white background, professional studio lighting, hyperrealistic`
            );
            return `https://image.pollinations.ai/prompt/${imagePrompt}?width=400&height=500&nologo=true&seed=${Math.floor(Math.random() * 99999)}`;
        };

        // Build yourLook
        let yourLookItems = [];
        if (hasSelections) {
            yourLookItems = selectedItems.map(item => ({
                name: item.name,
                image: item.image,
                category: item.category,
                objectPosition: item.objectPosition || 'center center',
                colorData: itemColors[item.id] || null
            }));
        } else if (fallbackHero) {
            yourLookItems = [{ ...fallbackHero, isFallback: true }];
        }

        const itemNames = yourLookItems.map(i => {
            if (i.colorData && i.colorData.primary) {
                return `(${i.colorData.primary}) ${i.name}`;
            }
            return i.name;
        }).join(' + ');
        const explanation = hasSelections
            ? `Your selection of <strong>${itemNames}</strong> defines a <strong>${styles}</strong> aesthetic for ${occasion}. ${parsed.clashes.length === 0 ? 'These pieces work well together — the AI has curated 4 complementary items to complete your look.' : 'The AI detected some styling conflicts. See the advisor below for two optimized paths.'}`
            : `AI curated a <strong>${styles}</strong> look for <strong>${occasion}</strong>. These 4 pieces form a complete, coordinated outfit.`;

        const attributes = [
            budget.toUpperCase() + ' Tier',
            styles.toUpperCase().split(',')[0].trim() + ' Style',
            occasion.toUpperCase() + ' Ready'
        ];

        // Attach images to all suggestions
        if (parsed.mode === 'single' && parsed.accessories) {
            parsed.accessories = parsed.accessories.map(item => ({ ...item, image: makeImage(item), affiliateUrl: '#' }));
        }
        if (parsed.mode === 'dual') {
            if (parsed.scenarioA?.accessories) {
                parsed.scenarioA.accessories = parsed.scenarioA.accessories.map(item => ({ ...item, image: makeImage(item), affiliateUrl: '#' }));
            }
            if (parsed.scenarioB?.accessories) {
                parsed.scenarioB.accessories = parsed.scenarioB.accessories.map(item => ({ ...item, image: makeImage(item), affiliateUrl: '#' }));
            }
        }

        res.json({
            yourLook: yourLookItems,
            clashes: parsed.clashes || [],
            mode: parsed.mode || 'single',
            matchScore: parsed.matchScore || (parsed.clashes && parsed.clashes.length > 0 ? 65 : 92),
            accessories: parsed.accessories || [],
            scenarioA: parsed.scenarioA || null,
            scenarioB: parsed.scenarioB || null,
            explanation,
            attributes
        });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
