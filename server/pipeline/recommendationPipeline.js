const { validateRequest } = require('../utils/validator');
const { runStage1 } = require('../stages/stage1');
const { runStage2 } = require('../stages/stage2');
const { runStage3 } = require('../stages/stage3');
const { runStage4 } = require('../stages/stage4');
const { validateCandidate } = require('../stages/structuralValidator');
const { resetMetrics, dumpMetricsIfDebug, recordMetric } = require('../utils/metrics');
const { debugLog, debugWarn } = require('../utils/logger');

const PIPELINE_TIMEOUT_MS = 240000;

async function runRecommendationPipeline(reqBody, sendEvent, isClientConnectedRef) {
    const pipelineStartTime = Date.now();

    // Global pipeline timeout — hard deadline to prevent indefinite hangs
    let pipelineTimeoutId;
    const pipelineTimeout = new Promise((_, reject) => {
        pipelineTimeoutId = setTimeout(() => reject(new Error("Pipeline timeout")), PIPELINE_TIMEOUT_MS);
    });

    // Heartbeat — sends periodic progress so the frontend doesn't appear stuck
    const heartbeatInterval = setInterval(() => {
        if (isClientConnectedRef && isClientConnectedRef()) {
            sendEvent({ status: "Still analyzing your outfit..." });
        }
    }, 15000);

    resetMetrics();

    try {
        await Promise.race([
            runPipeline(reqBody, sendEvent, pipelineStartTime, isClientConnectedRef),
            pipelineTimeout
        ]);
    } catch (error) {
        if (error.message === "Pipeline timeout") {
            const duration = Date.now() - pipelineStartTime;
            debugWarn("Pipeline Timeout", `Pipeline exceeded ${PIPELINE_TIMEOUT_MS}ms limit after ${duration}ms`);
            if (isClientConnectedRef && isClientConnectedRef()) {
                sendEvent({ 
                    error: "The recommendation engine timed out. Please try again." 
                });
            }
        } else {
            throw error;
        }
    } finally {
        clearTimeout(pipelineTimeoutId);
        clearInterval(heartbeatInterval);
    }
}

async function runPipeline(reqBody, sendEvent, pipelineStartTime, isClientConnectedRef) {
    const MAX_PROJECTED_SCORE_BOOST = 15;

    console.log('[PIPELINE] runPipeline started');
    console.log('[PIPELINE] reqBody keys:', Object.keys(reqBody));
    console.log('[PIPELINE] prefs:', JSON.stringify(reqBody.prefs));
    console.log('[PIPELINE] selectedItems count:', reqBody.selectedItems?.length);
    console.log('[PIPELINE] itemColors keys:', Object.keys(reqBody.itemColors || {}));

    const validation = validateRequest(reqBody);
    if (!validation.isValid) {
        console.log('[PIPELINE] Validation failed:', validation.error);
        sendEvent({ error: validation.error });
        dumpMetricsIfDebug();
        return;
    }
    console.log('[PIPELINE] Validation passed');

    // Check client connection early
    if (isClientConnectedRef && !isClientConnectedRef()) {
        debugWarn("Pipeline Abort", "Client disconnected before pipeline started");
        return;
    }

    const { prefs, selectedItems } = reqBody;
    const styles = (prefs.stylePersonality || []).join(', ') || 'fashionable';
    const occasion = prefs.occasions?.[0] || 'casual';
    const gender = prefs.gender || 'Not specified';
    const itemColors = prefs.itemColors || {};
    const hasSelections = selectedItems && selectedItems.length > 0;

    const wearingList = hasSelections
        ? selectedItems.map(i => {
            const colorData = itemColors[i.id];
            const colorDesc = colorData
                ? `(${colorData.primary}${colorData.secondary ? ' + ' + colorData.secondary : ''}${colorData.pattern && colorData.pattern !== 'Solid' ? ', ' + colorData.pattern : ''})`
                : '';
            let metadata = `[Type: ${i.garmentType || i.category}, Structure: ${i.garmentStructure || 'Unknown'}, Layer: ${i.layer || 'Unknown'}`;
            metadata += `]`;
            return `ID:${i.id} | ${i.name} ${colorDesc} ${metadata}`;
        }).join('\n  - ')
        : `a ${styles} outfit for ${occasion}`;

    const itemIdList = hasSelections ? selectedItems.map(i => i.id) : [];

    const itemMap = {};
    if (hasSelections) {
        selectedItems.forEach(item => {
            itemMap[item.id] = {
                name: item.name,
                image: item.image,
                category: item.category,
                garmentType: item.garmentType,
                garmentStructure: item.garmentStructure,
                layer: item.layer,
                objectPosition: item.objectPosition || 'center center',
                colorData: itemColors[item.id] || null,
                id: item.id,
                fit: item.fit,
                material: item.material,
                seasons: item.seasons
            };
        });
    }

    // --- STAGE 1: Explorer ---
    if (isClientConnectedRef && !isClientConnectedRef()) {
        debugWarn("Pipeline Abort", "Client disconnected before Stage 1");
        return;
    }
    const t1Start = Date.now();
    const stage1ResultRaw = await runStage1(gender, occasion, styles, wearingList, itemIdList, sendEvent);
    recordMetric('stage1_latency_ms', Date.now() - t1Start);
    
    if (stage1ResultRaw.length === 0) {
        debugWarn("Pipeline Abort", "Stage 1 completely failed to extract valid candidates.");
        recordMetric('pipeline_total_latency_ms', Date.now() - pipelineStartTime);
        sendEvent({ 
            result: { 
                collections: [], 
                isOffline: true, 
                offlineMsg: "Our fashion models are currently overwhelmed! Please try again in a few seconds." 
            } 
        });
        dumpMetricsIfDebug();
        return;
    }

    // --- STRUCTURAL VALIDATION ---
    const explorerCandidates = [];
    stage1ResultRaw.forEach(candidateIds => {
        const validation = validateCandidate(candidateIds, itemMap);
        if (validation.isStructurallyValid) {
            explorerCandidates.push({ ids: candidateIds, validation });
        } else {
            debugWarn("Pipeline Validation", `Validator dropped invalid candidate [${candidateIds.join(', ')}]: ${validation.structuralConflicts.join(', ')}`);
        }
    });

    if (explorerCandidates.length === 0) {
        debugWarn("Pipeline Abort", "All candidates failed structural validation.");
        recordMetric('pipeline_total_latency_ms', Date.now() - pipelineStartTime);
        sendEvent({ 
            result: { 
                collections: [], 
                isOffline: true, 
                offlineMsg: "We couldn't put together a physically wearable outfit from those pieces. Try adjusting your selections!" 
            } 
        });
        dumpMetricsIfDebug();
        return;
    }

    // Check client connection before Stage 2
    if (isClientConnectedRef && !isClientConnectedRef()) {
        debugWarn("Pipeline Abort", "Client disconnected before Stage 2");
        return;
    }

    // --- STAGE 2: Outfit Judge ---
    const t2Start = Date.now();
    const stage2Result = await runStage2(gender, occasion, styles, explorerCandidates, itemMap, sendEvent);
    recordMetric('stage2_latency_ms', Date.now() - t2Start);
    const { survivingCores, highestScoringFailed } = stage2Result;

    if (survivingCores.length === 0) {
        const failReason = highestScoringFailed 
            ? highestScoringFailed.rejectionReason 
            : "None of the generated outfit combinations met basic fashion criteria for this occasion.";
            
        debugWarn("Pipeline Abort", `All candidates rejected. Reason: ${failReason}`);
        recordMetric('pipeline_total_latency_ms', Date.now() - pipelineStartTime);
        sendEvent({ 
            result: { 
                collections: [], 
                isOffline: true, 
                offlineMsg: failReason 
            } 
        });
        dumpMetricsIfDebug();
        return;
    }

    // Check client connection before Stage 3
    if (isClientConnectedRef && !isClientConnectedRef()) {
        debugWarn("Pipeline Abort", "Client disconnected before Stage 3");
        return;
    }

    // --- STAGE 3: Diversity Filter ---
    const t3Start = Date.now();
    const stage3Result = runStage3(survivingCores, itemMap, sendEvent);
    recordMetric('stage3_latency_ms', Date.now() - t3Start);

    // Check client connection before Stage 4
    if (isClientConnectedRef && !isClientConnectedRef()) {
        debugWarn("Pipeline Abort", "Client disconnected before Stage 4");
        return;
    }

    // --- STAGE 4: The Stylist ---
    const t4Start = Date.now();
    const stage4Result = await runStage4(occasion, styles, stage3Result, sendEvent);
    recordMetric('stage4_latency_ms', Date.now() - t4Start);

    // --- Final Assembly ---
    const finalRecommendations = stage3Result.map((core, i) => {
        const stylistData = stage4Result.find(s => s.index === i) || {};
        
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
            projectedScore: Math.min(100, Math.max(core.currentScore, Math.min(stylistData.projectedScore || (core.currentScore + 5), core.currentScore + MAX_PROJECTED_SCORE_BOOST))),
            stylingAdvice: stylistData.stylingInsight || "",
            yourLook: enrichedLook,
            accessories: stylistData.accessories || [],
            completionPotential: core.completionPotential,
            requiredGarment: stylistData.requiredGarment || null
        };
    });

    sendEvent({ result: { collections: finalRecommendations } });
    recordMetric('pipeline_total_latency_ms', Date.now() - pipelineStartTime);
    dumpMetricsIfDebug();
}

module.exports = { runRecommendationPipeline };
