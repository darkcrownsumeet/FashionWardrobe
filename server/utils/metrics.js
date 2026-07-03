const metricsStore = {
    stage1_retry_count: 0,
    stage1_fallback_count: 0,
    stage1_hallucinated_ids: 0,
    stage2_fallback_count: 0,
    stage4_retry_count: 0,
    stage4_fallback_count: 0,
    stage4_sanitizer_corrections: 0,
    stage4_completion_violations: 0,
    stage4_color_corrections: 0,
    schema_violations: 0,
    stage1_latency_ms: 0,
    stage2_latency_ms: 0,
    stage3_latency_ms: 0,
    stage4_latency_ms: 0,
    pipeline_total_latency_ms: 0
};

function recordMetric(key, amount = 1) {
    if (metricsStore.hasOwnProperty(key)) {
        metricsStore[key] += amount;
    }
}

function getMetrics() {
    return { ...metricsStore };
}

function resetMetrics() {
    for (const key in metricsStore) {
        metricsStore[key] = 0;
    }
}

function dumpMetricsIfDebug() {
    if (process.env.DEBUG_PIPELINE === 'true') {
        console.log("\n=== PIPELINE METRICS ===");
        console.log(JSON.stringify(metricsStore, null, 2));
        console.log("========================\n");
    }
}

module.exports = {
    recordMetric,
    getMetrics,
    resetMetrics,
    dumpMetricsIfDebug
};
