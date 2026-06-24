const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.set('trust proxy', 1);
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: "Too many requests, please try again later." }
});
app.use('/api/recommend', apiLimiter);
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

app.post('/api/recommend', async (req, res) => {
    // Enable Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
        const { prefs, selectedItems, fallbackHero } = req.body;
        
        if (selectedItems && selectedItems.length > 20) {
            sendEvent({ error: "Too many items selected. Maximum is 20." });
            res.end();
            return;
        }
        if (prefs) {
            if (prefs.stylePersonality && prefs.stylePersonality.join('').length > 150) {
                sendEvent({ error: "Invalid style personality length." });
                res.end();
                return;
            }
            if (prefs.occasions && prefs.occasions.join('').length > 100) {
                sendEvent({ error: "Invalid occasions length." });
                res.end();
                return;
            }
        }

        sendEvent({ status: "Exploring wardrobe..." });

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

        // STAGE 1: EXPLORER
        const promptStage1 = `You are an Outfit Explorer.
The user has selected these clothing items:
- ${wearingList}

Constraints: Occasion is ${occasion}. Styles are ${styles}.

Your Task:
Discover up to 10 distinct, potentially strong outfit combinations (cores) hidden within these selected items.
- Do not force 10 candidates.
- Return fewer candidates when limited outfit opportunities exist.
- Prioritize recall over precision (it is better to suggest a weird but potentially good outfit than to miss an opportunity).
- Explore completely different styling directions, silhouettes, and color palettes.

COLOR EXPLORATION RULE
Do not restrict exploration to exact color matches.
When generating candidates, explore:
- Monochromatic combinations
- Analogous color combinations
- Complementary color combinations
- Neutral-balanced combinations

Some candidates may prioritize color harmony.
Some candidates may prioritize style coherence.
Avoid generating candidates that all rely on the same dominant color strategy.
- An outfit core should normally contain enough clothing items to form a plausible outfit foundation.
- Single-item outfit cores should only be returned when no stronger multi-item core exists.

CRITICAL RESTRICTIONS:
- Do NOT score the outfits.
- Do NOT generate accessories or names.
- Do NOT judge them strictly.

STYLE DISTRIBUTION PROTOCOL

The selected styles are:
\${styles}

The purpose of Stage 1 is not merely to generate many outfit combinations.
The purpose is to discover the strongest and most diverse outfit opportunities hidden within the selected wardrobe.

STYLE COVERAGE REQUIREMENT
Actively explore every selected style that can be reasonably represented using the available wardrobe.

When a style is strongly supported by the wardrobe:
* Generate multiple distinct outfit candidates for that style.

When a style is only weakly supported:
* Generate only the strongest viable candidate.
* Do not force weak outfit combinations simply to satisfy style coverage.

When multiple styles are selected:
* Explore pure style representations.
* Explore blended style representations when they naturally exist.
* Explore generic wearable outfit directions only after style-specific opportunities have been explored.

WARDROBE REALITY RULE
The wardrobe is the ultimate constraint.
If the selected wardrobe does not realistically support a requested style:
* Do NOT invent outfit opportunities.
* Do NOT force bad combinations.
* Do NOT sacrifice outfit quality to satisfy style coverage.
High-quality wearable outfits are always preferred over artificial style quotas.

OCCASION PRIORITY RULE
Occasion (\${occasion}) is the highest contextual constraint.
A candidate that strongly matches a requested style but is inappropriate for the occasion should not be prioritized.
Occasion Fit overrides Style Preference.

STYLE COVERAGE CHECK
Before finalizing the candidate list, perform an internal coverage review:
* Have all realistically supported selected styles been explored?
* Are the candidates clustered around a single style direction?
* Are there unexplored style opportunities supported by the wardrobe?
* Are multiple candidates merely minor variations of the same outfit concept?
If most candidates represent the same style direction while other selected styles remain reasonably explorable, improve style coverage before producing the final output.

DIVERSITY RULE
Prefer fundamentally different outfit concepts over small variations.
Avoid generating candidates that differ only by:
* One added layer
* One removed layer
* One swapped item while preserving the same overall outfit concept

Prefer diversity across:
* Style direction
* Silhouette
* Color strategy
* Formality level
* Outfit foundation

The final candidate set should maximize discovery of distinct outfit concepts, not maximize outfit count.

Respond ONLY in valid JSON matching this exact schema (an array of arrays inside a candidates key):
{
  "candidates": [
    ["id1", "id2"],
    ["id1", "id3"],
    ["id2"]
  ]
}

Rules:
- candidates must ONLY contain IDs from: [${itemIdList.join(', ')}]
- Pure JSON only — no markdown, no explanation`;

        let jsonText = null;
        try {
            console.log("\n--- EXACT STAGE 1 PROMPT ---");
            console.log(promptStage1);
            console.log("----------------------------\n");
            console.log("Stage 1: Calling Groq (Qwen 32b)...");
            if (!process.env.GROQ_API_KEY) {
                throw new Error("Missing GROQ_API_KEY");
            }
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);
            const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'qwen-2.5-32b',
                    messages: [{ role: 'user', content: promptStage1 }],
                    temperature: 0.7,
                    max_tokens: 2000
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!groqRes.ok) {
                const errTxt = await groqRes.text();
                throw new Error(`Groq Error ${groqRes.status}: ${errTxt}`);
            }
            const groqData = await groqRes.json();
            jsonText = groqData.choices[0].message.content;
        } catch (apiError) {
            console.error('Groq API Error (Stage 1):', apiError.message);
            sendEvent({ status: "Groq failed, using Gemini fallback..." });
            try {
                const resultFromAPI = await model.generateContent(promptStage1);
                jsonText = resultFromAPI.response.text();
            } catch (geminiError) {
                console.error('Gemini Fallback Error (Stage 1):', geminiError.message);
            }
        }

        let parsed = { candidates: [] };
        if (jsonText) {
            jsonText = jsonText.replace(/<think>[\s\S]*?<\/think>/gi, '');
            jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            const firstBrace = jsonText.indexOf('{');
            const lastBrace = jsonText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
                jsonText = jsonText.substring(firstBrace, lastBrace + 1);
            }
            try {
                parsed = JSON.parse(jsonText);
            } catch (parseError) {
                console.error('Failed to parse Stage 1 JSON:', parseError);
                console.error('Raw text was:', jsonText);
            }
        }

        const explorerCandidates = parsed.candidates || [];
        console.log("Stage 1 found candidates:", explorerCandidates.length);
        console.log("--- EXACT STAGE 1 DECODED RESPONSE ---");
        console.log(JSON.stringify(explorerCandidates, null, 2));
        console.log("--------------------------------------");

        if (explorerCandidates.length === 0) {
            console.log("Stage 1 completely failed to extract valid candidates. Aborting pipeline.");
            sendEvent({ 
                result: { 
                    collections: [], 
                    isOffline: true, 
                    offlineMsg: "Our fashion models are currently overwhelmed! Please try again in a few seconds." 
                } 
            });
            res.end();
            return;
        }

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

        // ==========================================
        // STAGE 2: OUTFIT JUDGE (Claude Sonnet)
        // ==========================================
        sendEvent({ status: "Judging outfit candidates..." });
        
        let stage2CandidatesText = "";
        explorerCandidates.forEach((ids, index) => {
            const descriptions = ids.map(id => {
                const item = itemMap[id];
                if (!item) return `ID:${id} (Unknown)`;
                const colorDesc = item.colorData 
                    ? `(${item.colorData.primary}${item.colorData.secondary && item.colorData.secondary !== item.colorData.primary ? ' + ' + item.colorData.secondary : ''})` 
                    : '';
                return `${item.name} ${colorDesc} [${item.category}]`;
            }).join(', ');
            stage2CandidatesText += `Candidate ${index}: ${descriptions}\n`;
        });

        const promptStage2 = `You are a brutally honest, high-end fashion judge.
The user is looking for a ${occasion} outfit with the following styles: ${styles}.

The "Explorer" AI has suggested the following outfit candidates:
${stage2CandidatesText}

Your Task:
Evaluate each candidate outfit core on its own merits. Be ruthless. The goal is to eliminate weak outfits.

CRITICAL RESTRICTIONS:
- Do NOT generate accessories or names.
- Do NOT attempt to fix or improve the outfit.
- Evaluate ONLY the items present in the outfit core.
- Do not imagine missing items.
- Do not assume future accessories.
- Do not consider potential improvements.
- Judge only the outfit core exactly as provided.

JUDGING CRITERIA:
- Color Harmony: Are there major, unwearable color conflicts?
- Formality Consistency: Are there severe formality conflicts (e.g. sweatpants with a blazer)?
- Occasion Fit: Is this entirely inappropriate for a ${occasion}?
- Style Coherence: Do the pieces belong to severely conflicting style families?

JUDGING PRINCIPLE:
Minor weaknesses should reduce the score rather than trigger rejection.

Reject only when the outfit core contains:
- Major color conflicts
- Major style conflicts
- Major formality conflicts
- Severe occasion mismatch

Weak but wearable outfits should receive low scores instead of being rejected.

MONOCHROMATIC OUTFIT RULE:
Monochromatic and tonal outfits (e.g. all black, all white, all grey, tonal beige, tonal navy) are legitimate styling approaches and should not be penalized solely for using a single dominant color.
Evaluate monochromatic outfits based on:
- Occasion fit
- Style coherence
- Formality consistency
- Silhouette
- Overall outfit quality
Do not treat lack of color variety as a major color conflict.

MULTI-STYLE SCORING LOGIC:
When the user selects multiple styles (e.g., "Y2K Nostalgia, Dark Academia"), treat these as an "OR" list of acceptable aesthetic directions, NOT an "AND" checklist.

You must strictly differentiate between these four states:

1. STYLE DOMINANCE
* The outfit strongly represents ONE of the selected styles.
* This is a success.
* Reward with a strong style evaluation.

2. STYLE BLENDING
* The outfit successfully combines multiple selected styles.
* This is a success.
* Reward with a strong style evaluation.

3. STYLE ABSENCE
* The outfit represents one selected style but does not contain elements of another selected style.
* This is neutral.
* Absence is NOT conflict.
* Do NOT penalize.

4. STYLE CONFLICT
* The outfit actively contradicts the selected styles.
* The outfit creates visual incoherence.
* The outfit clashes with the requested aesthetic directions.
* This should be penalized.

IMPORTANT:
* Style Conflict requires ACTIVE contradiction, not mere absence of another style.
* A strong Y2K outfit that contains little or no Dark Academia influence is Style Absence, not Style Conflict.
* A strong Dark Academia outfit that contains little or no Y2K influence is Style Absence, not Style Conflict.
* If an outfit successfully achieves Style Dominance in at least one selected style, it has succeeded stylistically.
* However, style success does not override poor occasion fit, severe formality conflicts, major color clashes, or overall outfit quality issues.
* Occasion Fit remains the most important contextual constraint.
* Formality Consistency remains important.
* Color Harmony remains important.
* Style Dominance improves style evaluation but does NOT automatically guarantee a high overall score.
* Overall outfit quality must still influence final scoring.

DOMINANT STYLE ASSIGNMENT:
* Output the selected style name when one style is clearly the primary aesthetic direction.
* Output "Blended" when two or more selected styles are strongly and coherently represented.
* Output "Generic" when the outfit is wearable but does not strongly express any selected style.
* Do not output "Blended" unless multiple selected styles are genuinely visible in the outfit.

SCORING & REJECTION:
- Assign a currentScore (0-100) to each candidate.
- A candidate may receive a low score without being rejected. Rejection should be reserved for outfits that are fundamentally flawed.
- If an outfit violates any judging criteria, set rejected to true and provide a brutal, 1-sentence rejectionReason.
- If an outfit is strong (or weak but wearable), set rejected to false and leave rejectionReason empty.

Respond ONLY in valid JSON matching this schema:
{ "judgments": [ { "candidateIndex": 0, "dominantStyle": "Y2K Nostalgia", "currentScore": 82, "rejected": false, "rejectionReason": "" } ] }

Allowed dominantStyle values:
* Any selected style name
* "Blended"
* "Generic"`;

        let stage2JsonText = "";
        
        try {
            // Attempt 1: Puter.js (Claude Sonnet)
            console.log("Stage 2: Calling Claude via Puter...");
            if (!process.env.PUTER_AUTH_TOKEN) {
                throw new Error("PUTER_AUTH_TOKEN is missing in environment variables. Cannot use Puter backend.");
            }
            const { init } = require('@heyputer/puter.js/src/init.cjs');
            const puter = init(process.env.PUTER_AUTH_TOKEN);
            
            const puterRes = await puter.ai.chat(promptStage2, { model: 'claude-3-5-sonnet' });
            stage2JsonText = typeof puterRes === 'string' ? puterRes : (puterRes.message?.content || puterRes.text || JSON.stringify(puterRes));
        } catch (puterErr) {
            console.log("Puter failed:", puterErr.message);
            try {
                // Attempt 2: Gemini
                console.log("Stage 2: Falling back to Gemini...");
                const resStage2 = await model.generateContent(promptStage2);
                stage2JsonText = resStage2.response.text();
            } catch (geminiErr) {
                console.log("Gemini fallback failed:", geminiErr.message);
                if (process.env.GROQ_API_KEY) {
                    try {
                        // Attempt 3: Groq Qwen
                        console.log("Stage 2: Falling back to Groq Qwen...");
                        const groqResStage2 = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: 'qwen/qwen3-32b',
                                messages: [{ role: 'user', content: promptStage2 }],
                                temperature: 0.3,
                                max_tokens: 4000
                            })
                        });
                        const groqDataStage2 = await groqResStage2.json();
                        if (groqDataStage2.choices && groqDataStage2.choices[0]) {
                            stage2JsonText = groqDataStage2.choices[0].message.content;
                        }
                    } catch (groqErr) {
                         console.error('Groq fallback failed:', groqErr.message);
                    }
                }
            }
        }

        let stage2Judgments = [];
        if (stage2JsonText) {
            stage2JsonText = stage2JsonText.replace(/<think>[\s\S]*?<\/think>/gi, '');
            stage2JsonText = stage2JsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            const firstBrace = stage2JsonText.indexOf('{');
            const lastBrace = stage2JsonText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
                stage2JsonText = stage2JsonText.substring(firstBrace, lastBrace + 1);
            }
            try {
                parsed2 = JSON.parse(stage2JsonText);
                stage2Judgments = parsed2.judgments || [];
            } catch (e) {
                console.error("Failed to parse Stage 2 JSON:", e);
                console.error("Raw text was:", stage2JsonText);
            }
        }

        console.log("--- EXACT STAGE 2 DECODED RESPONSE ---");
        console.log(JSON.stringify(stage2Judgments, null, 2));
        console.log("--------------------------------------");

        // Apply Judgments & Filter
        let survivingCores = [];
        let highestScoringFailed = null;
        
        stage2Judgments.forEach(j => {
            const index = j.candidateIndex !== undefined ? j.candidateIndex : j.index;
            if (j.rejected) {
                if (!highestScoringFailed || j.currentScore > (highestScoringFailed.currentScore || 0)) {
                    highestScoringFailed = j;
                }
            } else {
                survivingCores.push({
                    candidateIndex: index,
                    ids: explorerCandidates[index] || [],
                    currentScore: j.currentScore
                });
            }
        });

        if (survivingCores.length === 0) {
            // COMPLETE FAILURE SCENARIO
            const failReason = highestScoringFailed 
                ? highestScoringFailed.rejectionReason 
                : "None of the generated outfit combinations met basic fashion criteria for this occasion.";
                
            console.log("All candidates rejected. Reason:", failReason);
            sendEvent({ 
                result: { 
                    collections: [], 
                    isOffline: true, 
                    offlineMsg: failReason 
                } 
            });
            res.end();
            return;
        }

        console.log(`Stage 2 surviving cores: ${survivingCores.length}`);

        // ==========================================
        // STAGE 3: DIVERSITY FILTER (Hybrid Category-Aware)
        // ==========================================
        sendEvent({ status: "Applying diversity filter..." });

        // Step A: Extract category footprints and attach items
        survivingCores.forEach(core => {
            const mappedItems = core.ids.map(id => itemMap[id]).filter(Boolean);
            core.items = mappedItems;
            
            // Extract sorted categories to represent the structural footprint
            const categories = mappedItems.map(item => item.category).sort();
            core.structureFootprint = categories.join('|');
        });

        // Step B: Sort by score descending
        survivingCores.sort((a, b) => b.currentScore - a.currentScore);

        // Step C: Elimination Tournament & Final Ranking (Category Reuse Collision)
        const finalCores = [];
        let remainingCores = [...survivingCores];
        
        while (finalCores.length < 3 && remainingCores.length > 0) {
            // Re-sort strictly by currentScore descending
            remainingCores.sort((a, b) => b.currentScore - a.currentScore);

            // 1. Collect all used items from finalCores
            const usedItems = new Set();
            finalCores.forEach(fc => fc.ids.forEach(id => usedItems.add(id)));

            // 2. Find all non-colliding candidates
            const validCandidates = [];
            for (let i = 0; i < remainingCores.length; i++) {
                const core = remainingCores[i];
                let collided = false;
                
                for (const approvedCore of finalCores) {
                    let reuseCount = 0;
                    let sharedCount = 0;
                    let coreMajorCount = 0;
                    let approvedMajorCount = 0;
                    
                    const coreCategories = {};
                    core.items.forEach(item => coreCategories[item.category] = item.id);
                    
                    const approvedCategories = {};
                    approvedCore.items.forEach(item => approvedCategories[item.category] = item.id);
                    
                    const majorCategories = ['topwear', 'bottomwear', 'outerwear', 'footwear'];
                    
                    majorCategories.forEach(cat => {
                        if (coreCategories[cat]) coreMajorCount++;
                        if (approvedCategories[cat]) approvedMajorCount++;
                        if (coreCategories[cat] && approvedCategories[cat]) {
                            sharedCount++;
                            if (coreCategories[cat] === approvedCategories[cat]) {
                                reuseCount++;
                            }
                        }
                    });
                    
                    const isTrueDuplicate = (sharedCount > 0 && reuseCount === sharedCount && coreMajorCount === approvedMajorCount);
                    if (reuseCount >= 3 || isTrueDuplicate) {
                        collided = true;
                        break;
                    }
                }

                if (!collided) {
                    validCandidates.push({ index: i, core: core });
                }
            }

            // 3. Apply Diversity Preference Tie-Breaker
            let selectedIndex = -1;
            
            if (validCandidates.length > 0) {
                let referenceScore = validCandidates[0].core.currentScore;
                if (finalCores.length > 0) {
                    // Compare against the lowest-scoring currently selected collection
                    referenceScore = finalCores[finalCores.length - 1].currentScore;
                }
                
                // Filter candidates within 5 points of the reference score AND with score >= 75
                const tieBreakerCandidates = validCandidates.filter(c => 
                    (referenceScore - c.core.currentScore) <= 5 && c.core.currentScore >= 75
                );
                
                if (tieBreakerCandidates.length > 0) {
                    // Calculate "unused items introduced" for each
                    tieBreakerCandidates.forEach(c => {
                        let unusedCount = 0;
                        c.core.ids.forEach(id => {
                            if (!usedItems.has(id)) unusedCount++;
                        });
                        c.unusedCount = unusedCount;
                    });
                    
                    // Sort by unusedCount descending, then by currentScore descending, then original rank
                    tieBreakerCandidates.sort((a, b) => {
                        if (b.unusedCount !== a.unusedCount) {
                            return b.unusedCount - a.unusedCount;
                        }
                        if (b.core.currentScore !== a.core.currentScore) {
                            return b.core.currentScore - a.core.currentScore;
                        }
                        return a.index - b.index; // Preserve original Stage 2 ranking on exact tie
                    });
                    
                    selectedIndex = tieBreakerCandidates[0].index;
                } else {
                    // Exceeds 5 points difference, remain strictly score-driven
                    selectedIndex = validCandidates[0].index;
                }
            }

            if (selectedIndex !== -1) {
                finalCores.push(remainingCores[selectedIndex]);
                remainingCores.splice(selectedIndex, 1);
            } else {
                // No more candidates can be added without Category Reuse Collision
                break;
            }
        }

        console.log(`Stage 3 final distinct cores: ${finalCores.length}`);

        // ==========================================
        // STAGE 4: THE STYLIST (Gemini 2.5 Flash)
        // ==========================================
        sendEvent({ status: "Styling final selections..." });

        let stage4InputText = `The user is dressing for: ${occasion} (Styles: ${styles})\n\n`;
        finalCores.forEach((core, index) => {
            stage4InputText += `Outfit ${index}:\n`;
            core.items.forEach(item => {
                const colorDesc = item.colorData 
                    ? `(${item.colorData.primary}${item.colorData.secondary && item.colorData.secondary !== item.colorData.primary ? ' + ' + item.colorData.secondary : ''})` 
                    : '';
                stage4InputText += `- ${item.name} ${colorDesc} [${item.category}]\n`;
            });
            stage4InputText += `currentScore: ${core.currentScore}\n\n`;
        });

        const promptStage4 = `You are an elite Fashion Stylist.
${stage4InputText}
Your Task:
For each outfit provided above, you must return styling enhancements and accessories to complete the look.

CRITICAL RESTRICTIONS:
- Do NOT modify or overwrite the currentScore.
- Do NOT change, add, or remove any of the core clothing items provided.
- Do NOT evaluate or judge the outfits as a whole.
- Do NOT introduce conflicting style families in the accessories.

ITEM CLASSIFICATION RULE:
- You may classify selected items as "KEEP" or "OPTIONAL". "KEEP" means the item strongly supports the outfit direction. "OPTIONAL" means the item works but may be removed or swapped by the user for an alternative. If an item is "OPTIONAL", you must provide a brief "reason".
- You must NOT generate replacement clothing items or mark anything as REPLACE.

OPTIONAL RULE:
- Use "OPTIONAL" sparingly. An item should only be marked "OPTIONAL" if it noticeably weakens color harmony, slightly conflicts with the styling direction, or reduces outfit versatility.
- Do not mark items "OPTIONAL" simply because a theoretically better alternative might exist.
- OPTIONAL reasons must be one short sentence (maximum 15 words).

PROJECTED SCORE RULE:
- projectedScore must represent a realistic improvement achievable through the suggested accessories and styling advice.
- Do not inflate scores. Typical improvement range is +0 to +15 points.
- projectedScore must be >= currentScore.
- Exceptional improvements above +15 should be rare.

ACCESSORY RULE:
- Return exactly 4 accessories for every outfit. This keeps the frontend UI consistent.

COLOR VALIDATION:
- A color appearing in an outfit core should not normally appear in any avoid array unless there is a strong styling reason.
- Match and avoid arrays must remain internally consistent. A color cannot appear in both match and avoid.
- Use ONLY basic color names (no materials/patterns/fabrics).

COLOR COHERENCE RULE:
- Match colors should be selected based on the outfit core's existing color palette and the accessory being suggested.
- Avoid colors should represent realistic clashes with the outfit core.
- Do not generate generic match/avoid lists. Different outfits should receive different color guidance when their underlying color palettes differ.

STYLING ADVICE RULE:
- Provide a maximum 1-sentence actionable tip focusing strictly on fit, layering, proportion, or styling technique.
- NO vague motivational language or fashion-blog commentary.

OUTFIT NAME RULE:
- Provide a short, evocative name (Maximum 2-3 words).

Respond ONLY in valid JSON matching this exact schema:
{
  "styledOutfits": [
    {
      "index": 0,
      "name": "Midnight Minimalist",
      "projectedScore": 91,
      "stylingAdvice": "Leave the overshirt open to create cleaner visual layering.",
      "itemFeedback": {
        "m-top-gen-4": { "status": "KEEP" },
        "m-bot-gen-2": { "status": "KEEP" },
        "m-foot-gen-1": { "status": "OPTIONAL", "reason": "Adds visual weight and may be swapped for a cleaner alternative if desired." }
      },
      "accessories": [
        {
          "name": "Minimal Watch",
          "category": "accessory",
          "why": "Adds polish without disrupting the clean silhouette.",
          "colors": {
            "match": ["Black", "Silver", "Grey"],
            "avoid": ["Neon Green"]
          }
        }
        // ... MUST HAVE EXACTLY 4 ACCESSORIES TOTAL ...
      ]
    }
  ]
}`;

        let stage4JsonText = "";
        try {
            console.log("Stage 4: Calling Gemini...");
            const resStage4 = await model.generateContent(promptStage4);
            stage4JsonText = resStage4.response.text();
        } catch (geminiErr) {
            console.log("Stage 4 Gemini failed:", geminiErr.message);
            if (process.env.GROQ_API_KEY) {
                try {
                    console.log("Stage 4: Falling back to Groq Qwen...");
                    const groqResStage4 = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: 'qwen/qwen3-32b',
                            messages: [{ role: 'user', content: promptStage4 }],
                            temperature: 0.4,
                            max_tokens: 4000
                        })
                    });
                    const groqDataStage4 = await groqResStage4.json();
                    if (groqDataStage4.choices && groqDataStage4.choices[0]) {
                        stage4JsonText = groqDataStage4.choices[0].message.content;
                    }
                } catch (groqErr) {
                    console.error('Stage 4 Groq fallback failed:', groqErr.message);
                }
            }
        }

        let styledOutfitsData = [];
        let parsed4 = { collections: [] };
        if (stage4JsonText) {
            stage4JsonText = stage4JsonText.replace(/<think>[\s\S]*?<\/think>/gi, '');
            stage4JsonText = stage4JsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            const firstBrace = stage4JsonText.indexOf('{');
            const lastBrace = stage4JsonText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
                stage4JsonText = stage4JsonText.substring(firstBrace, lastBrace + 1);
            }
            try {
                parsed4 = JSON.parse(stage4JsonText);
                styledOutfitsData = parsed4.styledOutfits || [];
            } catch (e) {
                console.error("Failed to parse Stage 4 JSON:", e);
                console.error("Raw text was:", stage4JsonText);
            }
        }

        console.log("--- EXACT STAGE 4 DECODED RESPONSE ---");
        console.log(JSON.stringify(styledOutfitsData, null, 2));
        console.log("--------------------------------------");

        const collections = finalCores.map((core, i) => {
            const stylistData = styledOutfitsData.find(s => s.index === i) || {};
            
            const itemFeedback = stylistData.itemFeedback || {};
            const enrichedLook = core.items.map(item => {
                const feedback = itemFeedback[item.id] || { status: 'KEEP' };
                return {
                    ...item,
                    status: feedback.status || 'KEEP',
                    reason: feedback.reason || ''
                };
            });

            return {
                name: stylistData.name || `Look ${i+1}`,
                currentScore: core.currentScore,
                projectedScore: stylistData.projectedScore || Math.min(100, core.currentScore + 5),
                stylingAdvice: stylistData.stylingAdvice || "",
                yourLook: enrichedLook,
                accessories: stylistData.accessories || []
            };
        });

        sendEvent({ result: { collections } });
        res.end();

    } catch (error) {
        console.error('API Error:', error);
        sendEvent({ error: error.message });
        res.end();
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
