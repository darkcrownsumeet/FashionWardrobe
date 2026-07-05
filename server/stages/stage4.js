const { buildStage4Prompt } = require('../prompts/stage4Prompt');
const { CANONICAL_COLORS } = require('../utils/colors');
const { parseLLMJson } = require('../utils/jsonParser');
const llmClient = require('../llm/index');
const { recordMetric } = require('../utils/metrics');
const { debugLog, debugWarn } = require('../utils/logger');

const STAGE4_TIMEOUT_MS = 60000;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createFallbackStylistData(core) {
    const itemFeedback = {};
    if (core.items) {
        core.items.forEach(item => {
            itemFeedback[item.id] = { status: "KEEP" };
        });
    }

    return {
        name: "Complete Look",
        projectedScore: core.currentScore,
        requiredGarment: null,
        stylingInsight: "No additional styling insight available.",
        itemFeedback: itemFeedback,
        accessories: []
    };
}

function validateStage4Response(parsed, core) {
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        recordMetric('schema_violations');
        return false;
    }
    
    const requiredKeys = [
        'name',
        'projectedScore',
        'stylingInsight',
        'itemFeedback',
        'accessories'
    ];
    
    for (const key of requiredKeys) {
        if (!(key in parsed)) {
            recordMetric('schema_violations');
            return false;
        }
    }

    if (typeof parsed.projectedScore !== 'number' || parsed.projectedScore < core.currentScore || parsed.projectedScore > 100) {
        debugWarn("Stage 4 Validation", `projectedScore ${parsed.projectedScore} must be >= currentScore ${core.currentScore}`);
        recordMetric('schema_violations');
        return false;
    }

    if (!('requiredGarment' in parsed)) {
        recordMetric('schema_violations');
        return false;
    }
    if (parsed.requiredGarment !== null && typeof parsed.requiredGarment !== 'object') {
        recordMetric('schema_violations');
        return false;
    }

    return true;
}

async function callLlmWithTimeout(prompt, useFallback = false) {
    const llmPromise = llmClient.generate({ stage: "stage4", prompt: prompt, useFallback });
    
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error("Timeout"));
        }, STAGE4_TIMEOUT_MS);
    });

    try {
        const result = await Promise.race([llmPromise, timeoutPromise]);
        clearTimeout(timeoutId);
        return result;
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
}
function sanitizeStage4Result(stage4Result, core) {
    if (!stage4Result) return stage4Result;

    // Cross-Stage Contract Validation: completionPotential
    if (core.completionPotential !== 'HIGH' && stage4Result.requiredGarment !== null) {
        debugWarn("Stage 4 Contract Violation", "LLM violated completionPotential contract (returned a requiredGarment when NONE).");
        recordMetric('stage4_completion_violations');
        stage4Result.requiredGarment = null;
    }

    // Cross-Stage Contract Validation: requiredGarment sub-field integrity
    if (stage4Result.requiredGarment && typeof stage4Result.requiredGarment === 'object') {
        const requiredGarmentKeys = ['category', 'name', 'reason', 'matchColors', 'avoidColors'];
        const missingKeys = requiredGarmentKeys.filter(key => !(key in stage4Result.requiredGarment));
        if (missingKeys.length > 0) {
            debugWarn("Stage 4 Sanitizer", `requiredGarment missing fields: ${missingKeys.join(', ')}. Nullifying.`);
            recordMetric('stage4_sanitizer_corrections');
            stage4Result.requiredGarment = null;
        } else if (!Array.isArray(stage4Result.requiredGarment.matchColors) || !Array.isArray(stage4Result.requiredGarment.avoidColors)) {
            debugWarn("Stage 4 Sanitizer", "requiredGarment matchColors or avoidColors is not an array. Nullifying.");
            recordMetric('stage4_sanitizer_corrections');
            stage4Result.requiredGarment = null;
        }
    }

    // Cross-Stage Contract Validation: itemFeedback hallucination check
    if (stage4Result.itemFeedback && typeof stage4Result.itemFeedback === 'object') {
        const expectedIds = new Set(core.items.map(i => i.id));
        const feedbackKeys = Object.keys(stage4Result.itemFeedback);
        const validFeedback = {};
        for (const key of feedbackKeys) {
            if (expectedIds.has(key)) {
                validFeedback[key] = stage4Result.itemFeedback[key];
            } else {
                debugWarn("Stage 4 Hallucination", `Removed hallucinated itemFeedback ID: ${key}`);
                recordMetric('stage4_sanitizer_corrections');
            }
        }
        // Ensure all expected IDs are present
        for (const id of expectedIds) {
            if (!validFeedback[id]) {
                validFeedback[id] = { status: "KEEP" };
                recordMetric('stage4_sanitizer_corrections');
            }
        }
        stage4Result.itemFeedback = validFeedback;
    }

    // Build outfit color set — used only for requiredGarment.matchColors
    const existingOutfitColors = new Set();
    if (core && core.items) {
        core.items.forEach(item => {
            if (item.colorData) {
                if (item.colorData.primary) existingOutfitColors.add(item.colorData.primary.toLowerCase());
                if (item.colorData.secondary) existingOutfitColors.add(item.colorData.secondary.toLowerCase());
            }
        });
    }

    // Core color cleaner — generic, reusable
    const cleanColors = (colorArray, options = {}) => {
        if (!Array.isArray(colorArray)) return [];
        const seen = new Set();
        const cleaned = [];
        let modified = false;
        for (const color of colorArray) {
            if (!color || typeof color !== 'string' || color.trim() === '') {
                modified = true;
                continue;
            }
            const normalized = color.trim().toLowerCase();
            if (seen.has(normalized)) {
                modified = true;
                continue;
            }
            seen.add(normalized);
            if (options.whitelist && !options.whitelist.has(normalized)) {
                modified = true;
                continue;
            }
            if (options.blacklist && options.blacklist.has(normalized)) {
                modified = true;
                continue;
            }
            cleaned.push(color.trim());
        }
        if (modified && options.trackCorrection) recordMetric('stage4_color_corrections');
        return cleaned;
    };

    // Semantic wrappers — enforce the correct validation contract per field type
    const cleanGarmentColors = (colorArray, options = {}) =>
        cleanColors(colorArray, options);

    const cleanAccessoryColors = (colorArray) =>
        cleanColors(colorArray, { whitelist: CANONICAL_COLORS, trackCorrection: true });

    // requiredGarment color validation
    if (stage4Result.requiredGarment) {
        stage4Result.requiredGarment.matchColors = cleanGarmentColors(
            stage4Result.requiredGarment.matchColors,
            { whitelist: existingOutfitColors }
        );
        stage4Result.requiredGarment.avoidColors = cleanGarmentColors(
            stage4Result.requiredGarment.avoidColors,
            { whitelist: CANONICAL_COLORS }
        );
    }

    // Accessory validation
    if (Array.isArray(stage4Result.accessories)) {
        // Structural filter: discard malformed or non-accessory entries
        stage4Result.accessories = stage4Result.accessories.filter(acc => {
            if (!acc || typeof acc !== 'object' || Array.isArray(acc)) return false;
            if (typeof acc.category !== 'string') return false;
            if (acc.category.trim().toLowerCase() !== 'accessory') return false;
            return true;
        });

        // Enforce exactly 4 accessories
        if (stage4Result.accessories.length !== 4) {
            debugWarn("Stage 4 Accessory Count", `Expected 4 accessories, got ${stage4Result.accessories.length}. Padding/trimming.`);
            recordMetric('stage4_sanitizer_corrections');
            while (stage4Result.accessories.length < 4) {
                stage4Result.accessories.push({
                    name: "Curated Accessory",
                    category: "accessory",
                    why: "Completes the overall look.",
                    colors: { match: ["Black"], avoid: [] }
                });
            }
            stage4Result.accessories = stage4Result.accessories.slice(0, 4);
        }

        // Color validation for accessories
        stage4Result.accessories.forEach(acc => {
            if (acc.colors && typeof acc.colors === 'object' && !Array.isArray(acc.colors)) {
                acc.colors.match = cleanAccessoryColors(acc.colors.match);
                acc.colors.avoid = cleanAccessoryColors(acc.colors.avoid);
            }
        });
    }

    return stage4Result;
}

async function processOutfitWithRetry(core, index, occasion, styles) {
    let stage4InputText = `The user is dressing for: ${occasion} (Styles: ${styles})\n\n`;
    
    const allowedIds = core.items.map(item => `"${item.id}"`);
    stage4InputText += `ALLOWED_ITEM_IDS\n[\n${allowedIds.join(',\n')}\n]\n\n`;
    
    stage4InputText += `Outfit:\n`;
    core.items.forEach(item => {
        const colorDesc = item.colorData 
            ? `(${item.colorData.primary}${item.colorData.secondary && item.colorData.secondary !== item.colorData.primary ? ' + ' + item.colorData.secondary : ''})` 
            : '';
        stage4InputText += `- ID: ${item.id} | Name: ${item.name} ${colorDesc} | Category: ${item.category} | Type: ${item.garmentType || item.category} | Structure: ${item.garmentStructure || 'Unknown'} | Layer: ${item.layer || 'Unknown'}\n`;
    });
    stage4InputText += `currentScore: ${core.currentScore}\n`;
    stage4InputText += `completionPotential: ${core.completionPotential}\n`;

    // Compute structural facts deterministically from item data
    const structures = core.items.map(i => i.garmentStructure || 'Unknown');
    const hasOnePiece  = structures.includes('OnePiece');
    const hasTop       = structures.includes('Top');
    const hasBottom    = structures.includes('Bottom');
    const hasOuterwear = structures.includes('Outerwear');
    const hasFootwear  = structures.includes('Footwear');

    // Derive completion status facts
    const primaryRolesFilled = [];
    if (hasOnePiece)  primaryRolesFilled.push('OnePiece');
    else {
        if (hasTop)    primaryRolesFilled.push('Top');
        if (hasBottom) primaryRolesFilled.push('Bottom');
    }
    if (hasOuterwear) primaryRolesFilled.push('Outerwear');
    if (hasFootwear)  primaryRolesFilled.push('Footwear');

    const missingRoles = [];
    if (!hasOnePiece && !hasTop)    missingRoles.push('Top');
    if (!hasOnePiece && !hasBottom) missingRoles.push('Bottom');
    if (!hasOuterwear)              missingRoles.push('Outerwear');
    if (!hasFootwear)               missingRoles.push('Footwear');

    const isStructurallyComplete = !hasOnePiece
        ? (hasTop && hasBottom)
        : true; // OnePiece satisfies both Top and Bottom

    const layeringOpportunities = [];
    if (!hasOuterwear) layeringOpportunities.push('Outerwear layer is absent');
    if (hasOnePiece && !hasOuterwear) layeringOpportunities.push('OnePiece outfit is open to an outer layer');

    // Emit a structured facts block — no instructions, no policies
    stage4InputText += `\nSTRUCTURAL ANALYSIS\n`;
    stage4InputText += `Primary roles filled: ${primaryRolesFilled.join(', ') || 'None'}.\n`;
    stage4InputText += `Missing structural roles: ${missingRoles.join(', ') || 'None'}.\n`;
    stage4InputText += `Structurally complete: ${isStructurallyComplete ? 'Yes' : 'No'}.\n`;
    stage4InputText += `Contains OnePiece garment: ${hasOnePiece ? 'Yes' : 'No'}.\n`;
    stage4InputText += `Layering opportunities: ${layeringOpportunities.join('; ') || 'None identified'}.\n\n`;

    const prompt = buildStage4Prompt(occasion, styles, stage4InputText);

    let parsedResult = null;

    // Attempt 1
    try {
        const jsonText = await callLlmWithTimeout(prompt, false);
        const parsed = parseLLMJson(jsonText);
        if (validateStage4Response(parsed, core)) {
            parsedResult = parsed;
        } else {
            throw new Error("Validation Failed");
        }
    } catch (err) {
        console.warn(`Stage 4 (Outfit ${index}) Attempt 1 failed: ${err.message}. Retrying...`);
        recordMetric('stage4_retry_count');
        
        // Exponential backoff: 2 seconds before retry
        await sleep(2000);
        
        // Attempt 2 (Retry)
        try {
            const jsonText2 = await callLlmWithTimeout(prompt, true);
            const parsed2 = parseLLMJson(jsonText2);
            if (validateStage4Response(parsed2, core)) {
                parsedResult = parsed2;
            } else {
                throw new Error("Validation Failed on Retry");
            }
        } catch (err2) {
            console.error(`Stage 4 (Outfit ${index}) Retry failed: ${err2.message}. Using fallback.`);
            recordMetric('stage4_fallback_count');
            
            // Exponential backoff: 5 seconds before fallback
            await sleep(5000);
            
            parsedResult = createFallbackStylistData(core);
        }
    }
    if (parsedResult) {
        parsedResult = sanitizeStage4Result(parsedResult, core);
    }

    return { index, result: parsedResult };
}

async function runStage4(occasion, styles, finalCores, sendEvent) {
    sendEvent({ status: "Styling final selections..." });
    console.log("===== ENTERED STAGE 4 =====");
    console.log(`Stage 4: Processing ${finalCores.length} outfits with concurrency limit of 2...`);

    // Concurrency limiter - max 2 concurrent styling requests to avoid rate limiting
    const MAX_CONCURRENT = 2;
    const queue = [...finalCores];
    const results = [];
    const running = [];

    async function processNext() {
        if (queue.length === 0) return;
        const core = queue.shift();
        const index = finalCores.indexOf(core);
        
        const promise = processOutfitWithRetry(core, index, occasion, styles).then(result => {
            results.push(result);
            running.splice(running.indexOf(promise), 1);
            processNext();
        });
        
        running.push(promise);
        await promise;
    }

    // Start initial workers
    const initialWorkers = Math.min(MAX_CONCURRENT, queue.length);
    await Promise.all(Array(initialWorkers).fill().map(() => processNext()));

    // Wait for all to complete
    await Promise.all(running);

    // Sort results to preserve original Stage 3 order
    results.sort((a, b) => a.index - b.index);

    const finalStyledOutfits = results.map(item => {
        return {
            ...item.result,
            index: item.index
        };
    });

    debugLog("EXACT STAGE 4 DECODED RESPONSE", finalStyledOutfits);

    return finalStyledOutfits;
}

module.exports = { runStage4 };
