const { buildStage2Prompt } = require('../prompts/stage2Prompt');
const { parseLLMJson } = require('../utils/jsonParser');
const llmClient = require('../llm/index');
const { recordMetric } = require('../utils/metrics');
const { debugLog, debugWarn } = require('../utils/logger');

async function runStage2(gender, occasion, styles, explorerCandidates, itemMap, sendEvent) {
    sendEvent({ status: "Judging outfit candidates..." });
    
    let stage2CandidatesText = "";
    explorerCandidates.forEach((candidate, index) => {
        stage2CandidatesText += `\nCandidate ${index}:\n`;
        const ids = candidate.ids;
        
        if (candidate.validation && candidate.validation.missingPrimaryCategories.length > 0) {
            const counts = candidate.validation.primaryCounts;
            stage2CandidatesText += `[Primary Structure: Top=${counts.Top} Bottom=${counts.Bottom} OnePiece=${counts.OnePiece}]\n`;
        }

        ids.forEach(id => {
            const item = itemMap[id];
            if (!item) {
                stage2CandidatesText += `Name: Unknown (ID: ${id})\n---\n`;
                return;
            }
            const colorDesc = item.colorData 
                ? `${item.colorData.primary}${item.colorData.secondary && item.colorData.secondary !== item.colorData.primary ? ' + ' + item.colorData.secondary : ''}` 
                : 'Unknown';
            stage2CandidatesText += `Name: ${item.name}\nColor: ${colorDesc}\nType: ${item.garmentType || item.category}\nStructure: ${item.garmentStructure || 'Unknown'}\nLayer: ${item.layer || 'Unknown'}\n---\n`;
        });
    });

    const prompt = buildStage2Prompt(gender, occasion, styles, stage2CandidatesText);

    let jsonText = "";
    try {
        console.log("Stage 2: Calling LLM Client...");
        jsonText = await llmClient.generate({ stage: "stage2", prompt: prompt });
    } catch (err) {
        console.error("API Error (Stage 2):", err.message);
        recordMetric('stage2_fallback_count');
        sendEvent({ status: "Primary judge failed, using fallback..." });
        try {
            jsonText = await llmClient.generate({ stage: "stage2", prompt: prompt, useFallback: true });
        } catch (fallbackErr) {
            console.error("Fallback Error (Stage 2):", fallbackErr.message);
        }
    }

    let stage2Judgments = [];
    if (jsonText) {
        const parsed2 = parseLLMJson(jsonText) || {};
        if (Array.isArray(parsed2)) {
            stage2Judgments = parsed2;
        } else if (parsed2 && Array.isArray(parsed2.judgments)) {
            stage2Judgments = parsed2.judgments;
        } else {
            debugWarn("Stage 2 Validation", "Parsing failed: Unexpected schema");
            recordMetric('schema_violations');
        }
    }

    debugLog("EXACT STAGE 2 DECODED RESPONSE", stage2Judgments);

    let survivingCores = [];
    let highestScoringFailed = null;
    const seenIndices = new Set();
    
    stage2Judgments.forEach(j => {
        const index = j.candidateIndex !== undefined ? j.candidateIndex : j.index;
        
        // Deterministic Validation of Stage 2 contract
        if (typeof index !== 'number' || index < 0 || index >= explorerCandidates.length) {
            debugWarn("Stage 2 Validation", `invalid candidateIndex ${index}, skipping.`);
            recordMetric('schema_violations');
            return;
        }

        seenIndices.add(index);
        
        if (typeof j.currentScore !== 'number' || j.currentScore < 0 || j.currentScore > 100) {
            debugWarn("Stage 2 Validation", `Invalid score ${j.currentScore} for index ${index}, skipping.`);
            recordMetric('schema_violations');
            return;
        }

        if (typeof j.rejected !== 'boolean') {
            debugWarn("Stage 2 Validation", `Invalid rejected boolean for index ${index}, assuming true.`);
            recordMetric('schema_violations');
            j.rejected = true;
        }

        const validPotentials = ['HIGH', 'NONE'];
        if (j.completionPotential && !validPotentials.includes(j.completionPotential)) {
            debugWarn("Stage 2 Validation", `Invalid completionPotential ${j.completionPotential}, defaulting to NONE.`);
            recordMetric('schema_violations');
            j.completionPotential = 'NONE';
        }

        const candidateObj = explorerCandidates[index];
        if (!candidateObj || !candidateObj.ids || candidateObj.ids.length === 0) {
            debugWarn("Stage 2 Validation", `candidateIndex ${index} maps to empty candidate, skipping.`);
            return;
        }

        if (j.rejected) {
            if (!highestScoringFailed || j.currentScore > (highestScoringFailed.currentScore || 0)) {
                highestScoringFailed = j;
            }
        } else {
            survivingCores.push({
                candidateIndex: index,
                ids: candidateObj.ids,
                currentScore: j.currentScore,
                completionPotential: j.completionPotential || "NONE"
            });
        }
    });

    // Identity-based omission validation
    for (let i = 0; i < explorerCandidates.length; i++) {
        if (!seenIndices.has(i)) {
            debugWarn("Stage 2 Omission", `LLM failed to return a judgment for candidateIndex ${i}.`);
            recordMetric('schema_violations');
        }
    }
    
    if (seenIndices.size !== stage2Judgments.length) {
        debugWarn("Stage 2 Omission", `LLM returned duplicate judgments for some candidates.`);
        recordMetric('schema_violations');
    }

    return { survivingCores, highestScoringFailed };
}

module.exports = { runStage2 };
