const { buildStage1Prompt } = require('../prompts/stage1Prompt');
const { parseLLMJson } = require('../utils/jsonParser');
const llmClient = require('../llm/index');
const { recordMetric } = require('../utils/metrics');
const { debugLog, debugWarn } = require('../utils/logger');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runStage1(gender, occasion, styles, wearingList, itemIdList, sendEvent) {
    sendEvent({ status: "Exploring wardrobe..." });
    const prompt = buildStage1Prompt(gender, occasion, styles, wearingList, itemIdList);
    
    let jsonText = null;
    
    // Attempt 1: Primary
    try {
        debugLog("EXACT STAGE 1 PROMPT", prompt);
        console.log("Stage 1: Calling LLM Client (Attempt 1)...");
        jsonText = await llmClient.generate({ stage: "stage1", prompt: prompt });
    } catch (err) {
        console.warn(`Stage 1 Attempt 1 failed: ${err.message}. Retrying primary provider...`);
        recordMetric('stage1_retry_count');
        
        // Exponential backoff: 2 seconds before retry
        await sleep(2000);
        
        // Attempt 2: Primary Retry
        try {
            console.log("Stage 1: Calling LLM Client (Attempt 2)...");
            jsonText = await llmClient.generate({ stage: "stage1", prompt: prompt });
        } catch (err2) {
            console.warn(`Stage 1 Attempt 2 failed: ${err2.message}. Falling back to secondary provider...`);
            recordMetric('stage1_fallback_count');
            sendEvent({ status: "Primary provider failed, using fallback..." });
            
            // Exponential backoff: 5 seconds before fallback
            await sleep(5000);
            
            // Attempt 3: Fallback Provider
            try {
                console.log("Stage 1: Calling LLM Client (Attempt 3 - Fallback)...");
                jsonText = await llmClient.generate({ stage: "stage1", prompt: prompt, useFallback: true });
            } catch (fallbackErr) {
                console.error(`Stage 1 Fallback Error: ${fallbackErr.message}. Stage 1 completely failed.`);
                // Return gracefully; pipeline aborts safely with empty array
            }
        }
    }

    let parsed = { candidates: [] };
    if (jsonText) {
        parsed = parseLLMJson(jsonText) || { candidates: [] };
        
        // Deterministic Schema Validation
        if (!Array.isArray(parsed.candidates)) {
            debugWarn("Stage 1 Validation", "Schema Validation Failed: expected { candidates: [...] }");
            recordMetric('schema_violations');
            parsed = { candidates: [] };
        } else {
            const validCandidates = [];
            const allowedIdSet = new Set(itemIdList);
            
            for (const candidate of parsed.candidates) {
                if (!Array.isArray(candidate)) {
                    debugWarn("Stage 1 Validation", "Schema Validation Failed: candidate is not an array");
                    recordMetric('schema_violations');
                    continue;
                }
                
                // Check for duplicate IDs
                const uniqueIds = Array.from(new Set(candidate));
                if (uniqueIds.length !== candidate.length) {
                    recordMetric('schema_violations');
                }
                
                // Check for hallucinated IDs
                let hasHallucination = false;
                if (allowedIdSet.size > 0) {
                    for (const id of uniqueIds) {
                        if (!allowedIdSet.has(id)) {
                            hasHallucination = true;
                            recordMetric('stage1_hallucinated_ids');
                            debugWarn("Stage 1 Hallucination", `Removed hallucinated ID: ${id}`);
                        }
                    }
                }
                
                if (!hasHallucination && uniqueIds.length > 0) {
                    validCandidates.push(uniqueIds);
                }
            }
            parsed.candidates = validCandidates;
        }
    }

    const explorerCandidates = parsed.candidates || [];
    console.log("Stage 1 found valid candidates:", explorerCandidates.length);
    debugLog("EXACT STAGE 1 DECODED RESPONSE", explorerCandidates);

    return explorerCandidates;
}

module.exports = { runStage1 };
