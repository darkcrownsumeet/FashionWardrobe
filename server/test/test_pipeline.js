process.env.DEBUG_PIPELINE = 'true';

const llmClient = require('../llm/index');
const { runStage1 } = require('../stages/stage1');
const { runStage2 } = require('../stages/stage2');
const { runStage4 } = require('../stages/stage4');
const { runRecommendationPipeline } = require('../pipeline/recommendationPipeline');
const { getMetrics, resetMetrics } = require('../utils/metrics');

// Mock llmClient.generate to test validation paths
const originalGenerate = llmClient.generate;

async function testPipelineValidations() {
    console.log("=== STARTING DETERMINISTIC VALIDATION TESTS ===\n");
    
    // --- Test Pipeline Aborts ---
    console.log("Testing Pipeline Aborts: Invalid Request");
    resetMetrics();
    let e2eErr = null;
    await runRecommendationPipeline({}, (event) => {
        if (event.error) e2eErr = event.error;
    });
    if (!e2eErr) {
        console.error("FAIL: Pipeline failed to reject empty request body");
        process.exit(1);
    } else {
        console.log("PASS: Pipeline Aborts - Invalid Request\n");
    }
    
    // --- Test Stage 1 ---
    console.log("Testing Stage 1: Schema Violation & Hallucinated IDs");
    resetMetrics();
    llmClient.generate = async () => JSON.stringify({
        candidates: [
            ["valid1", "valid2"], // Valid candidate
            ["valid1", "hallucinated999"], // Hallucinated ID
            "not_an_array", // Schema violation
            ["dup1", "dup1"] // Schema violation (duplicates)
        ]
    });
    
    const stage1Res = await runStage1('M', 'casual', 'streetwear', '', ['valid1', 'valid2', 'dup1'], () => {});
    const m1 = getMetrics();
    
    if (stage1Res.length !== 2 || m1.stage1_hallucinated_ids !== 1 || m1.schema_violations !== 2) {
        console.error("FAIL: Stage 1 validation did not behave as expected.");
        console.error("Result length:", stage1Res.length, "(expected 2)");
        console.error("Metrics:", m1);
        process.exit(1);
    } else {
        console.log("PASS: Stage 1 Validation\n");
    }

    // --- Test Pipeline Abort: Empty Stage 1 ---
    console.log("Testing Pipeline Aborts: Stage 1 Empty Results (E2E)");
    resetMetrics();
    llmClient.generate = async () => JSON.stringify({ candidates: [] });
    
    let isOfflineE2E = false;
    await runRecommendationPipeline({
        prefs: { gender: 'M', occasions: ['casual'], stylePersonality: ['streetwear'] },
        selectedItems: [{ id: 'valid1', category: 'topwear', garmentStructure: 'Top', name: 'White Graphic Tee' }]
    }, (event) => {
        if (event.result && event.result.isOffline) isOfflineE2E = true;
    });
    
    if (!isOfflineE2E) {
        console.error("FAIL: Pipeline did not abort when Stage 1 returned empty array");
        process.exit(1);
    } else {
        console.log("PASS: Pipeline Aborts - Stage 1 Empty (E2E)\n");
    }

    // --- Test Stage 2 ---
    console.log("Testing Stage 2: Bounds & Enum Checking");
    resetMetrics();
    llmClient.generate = async () => JSON.stringify({
        judgments: [
            { candidateIndex: 0, currentScore: 85, rejected: false, completionPotential: "HIGH" }, // Valid
            { candidateIndex: 1, currentScore: 105, rejected: false, completionPotential: "HIGH" }, // Invalid score (Schema)
            { candidateIndex: 2, currentScore: 70, rejected: false, completionPotential: "INVALID_ENUM" }, // Invalid Enum
            { candidateIndex: 99, currentScore: 50, rejected: false } // Invalid Index (Schema)
        ]
    });

    const mockCandidates = [{ids:['a']}, {ids:['b']}, {ids:['c']}];
    const stage2Res = await runStage2('M', 'casual', 'streetwear', mockCandidates, { a:{}, b:{}, c:{} }, () => {});
    const m2 = getMetrics();

    // candidateIndex 2's completionPotential should default to NONE.
    // candidateIndex 1 (score 105) and 99 (bad index) should trigger schema_violations and be skipped.
    // The mismatch between unique valid indices (3) and total judgments (4) triggers the omission check.
    if (stage2Res.survivingCores.length !== 2 || m2.schema_violations !== 4 || stage2Res.survivingCores[1].completionPotential !== "NONE") {
        console.error("FAIL: Stage 2 validation did not behave as expected.");
        console.error("Surviving cores:", stage2Res.survivingCores);
        console.error("Metrics:", m2);
        process.exit(1);
    } else {
        console.log("PASS: Stage 2 Validation\n");
    }

    // --- Test Pipeline Abort: Stage 2 Rejects All ---
    console.log("Testing Pipeline Aborts: Stage 2 Rejects All (E2E)");
    resetMetrics();
    llmClient.generate = async (opts) => {
        if (opts.stage === "stage1") {
            return JSON.stringify({ candidates: [["valid1", "valid2"]] }); // Provide valid structure
        }
        if (opts.stage === "stage2") {
            return JSON.stringify({
                judgments: [
                    { candidateIndex: 0, currentScore: 50, rejected: true, rejectionReason: "Bad style", completionPotential: "NONE" }
                ]
            });
        }
        return "{}";
    };
    
    let isOfflineStage2 = false;
    let offlineMsg = "";
    await runRecommendationPipeline({
        prefs: { gender: 'M', occasions: ['casual'], stylePersonality: ['streetwear'] },
        selectedItems: [
            { id: 'valid1', category: 'topwear', garmentStructure: 'Top', name: 'White Graphic Tee' },
            { id: 'valid2', category: 'bottomwear', garmentStructure: 'Bottom', name: 'Black Cargo Pants' }
        ]
    }, (event) => {
        if (event.result && event.result.isOffline) {
            isOfflineStage2 = true;
            offlineMsg = event.result.offlineMsg;
        }
    });

    if (!isOfflineStage2 || offlineMsg !== "Bad style") {
        console.error("FAIL: Pipeline did not reject all properly");
        process.exit(1);
    } else {
        console.log("PASS: Pipeline Aborts - Stage 2 Rejects All (E2E)\n");
    }

    // --- Test Stage 4 (and 4.5 Sanitizer) ---
    console.log("Testing Stage 4: Contract Enforcement & Hallucination Removal");
    resetMetrics();
    llmClient.generate = async () => JSON.stringify({
        name: "Test Look",
        projectedScore: 70, // Invalid: must be >= currentScore (85) -> validation fails -> retries
        stylingInsight: "Insight",
        itemFeedback: { "valid1": { status: "KEEP" } },
        accessories: []
    });

    let retryCalled = false;
    // We will override again to simulate retry succeeding but with contract violations
    llmClient.generate = async (opts) => {
        if (opts.useFallback) {
            retryCalled = true;
            return JSON.stringify({
                name: "Test Look Retry",
                projectedScore: 90, // Valid
                stylingInsight: "Insight",
                itemFeedback: { "hallucinated": { status: "KEEP" } }, // Hallucinated ID
                requiredGarment: { type: "Jacket", matchColors: ["red"], avoidColors: ["blue"] }, // Completion Violation (NONE)
                accessories: [
                    { category: "Accessory", name: "Hat", colors: { match: ["NEON_YELLOW"], avoid: ["black"] } },
                    { category: "accessory", name: "Watch", colors: { match: ["Silver"], avoid: ["Gold"] } },
                    { category: "accessory", name: "Belt", colors: { match: ["Black"], avoid: ["Brown"] } },
                    { category: "accessory", name: "Bag", colors: { match: ["Navy"], avoid: ["Red"] } }
                ]
            });
        }
        return JSON.stringify({ name: "Fail", projectedScore: 10 }); // Force retry
    };

    const mockCore = {
        currentScore: 85,
        completionPotential: "NONE",
        items: [{ id: "valid1", name: "Valid Shirt", colorData: { primary: "black" } }]
    };

    const stage4Res = await runStage4('casual', 'streetwear', [mockCore], () => {});
    const m4 = getMetrics();
    const finalStyle = stage4Res[0];

    // Assertions
    if (
        !retryCalled ||
        m4.schema_violations !== 1 || // The initial failure due to projectedScore < currentScore
        m4.stage4_completion_violations !== 1 ||
        m4.stage4_sanitizer_corrections !== 2 || // 1 hallucinated ID dropped, 1 required ID restored
        m4.stage4_color_corrections !== 1 || // 'NEON_YELLOW' is not canonical, so it gets removed
        finalStyle.requiredGarment !== null || // Should be nullified by completionPotential === NONE
        !finalStyle.itemFeedback["valid1"] ||
        finalStyle.itemFeedback["hallucinated"]
    ) {
        console.error("FAIL: Stage 4 validation did not behave as expected.");
        console.error("Result:", JSON.stringify(finalStyle, null, 2));
        console.error("Metrics:", m4);
        process.exit(1);
    } else {
        console.log("PASS: Stage 4 Validation\n");
    }

    console.log("=== ALL TESTS PASSED SUCCESSFULLY ===");
    
    // Restore original
    llmClient.generate = originalGenerate;
}

testPipelineValidations().catch(console.error);
