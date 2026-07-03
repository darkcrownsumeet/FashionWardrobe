const { extractFootprintAndSort, filterDistinctCores } = require('../utils/ranking');
const { debugLog } = require('../utils/logger');

function runStage3(survivingCores, itemMap, sendEvent) {
    sendEvent({ status: "Applying diversity filter..." });

    const sortedCores = extractFootprintAndSort(survivingCores, itemMap);
    const finalCores = filterDistinctCores(sortedCores);
    
    console.log(`Stage 3 final distinct cores: ${finalCores.length}`);
    debugLog("STAGE 3 FINAL CORES", finalCores);
    return finalCores;
}

module.exports = { runStage3 };
