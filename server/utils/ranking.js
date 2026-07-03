const DIVERSITY_SCORE_THRESHOLD = 60;
const DIVERSITY_PROXIMITY_WINDOW = 5;

// Phase 9.1: Competitive Candidate Filtering Constants
const COMPETITIVE_SCORE_WINDOW = 25;
const MIN_COMPETITIVE_SCORE = 30;
const COMPLETION_RESCUE_WINDOW = 35; // conservative rescue window


function extractFootprintAndSort(survivingCores, itemMap) {
    survivingCores.forEach(core => {
        const mappedItems = core.ids.map(id => itemMap[id]).filter(Boolean);
        core.items = mappedItems;
        const categories = mappedItems.map(item => item.category).sort();
        core.structureFootprint = categories.join('|');
    });

    survivingCores.sort((a, b) => b.currentScore - a.currentScore);
    return survivingCores;
}

function filterDistinctCores(survivingCores) {
    if (!survivingCores || survivingCores.length === 0) return [];

    // Ensure sorted to find the absolute best score
    survivingCores.sort((a, b) => b.currentScore - a.currentScore);

    // Compute dynamic relative threshold
    const bestScore = survivingCores[0].currentScore;
    const competitiveThreshold = Math.max(bestScore - COMPETITIVE_SCORE_WINDOW, MIN_COMPETITIVE_SCORE);
    // Compute the completion rescue threshold (bounded by minimum competitive score)
    const rescueThreshold = Math.max(bestScore - COMPLETION_RESCUE_WINDOW, MIN_COMPETITIVE_SCORE);

    const finalCores = [];
    // Filter out outfits that fail both thresholds
    let remainingCores = survivingCores.filter(core => {
        const passesCompetitive = core.currentScore >= competitiveThreshold;
        const passesCompletion = core.completionPotential === "HIGH" && core.currentScore >= rescueThreshold;
        // Temporary debug log for outfits rescued solely by completionPotential
        if (!passesCompetitive && passesCompletion) {
            console.log(`[Stage3] Completion Rescue | Best=${bestScore} | Threshold=${rescueThreshold} | Candidate=${core.currentScore}`);
        }
        return passesCompetitive || passesCompletion;
    });
    
    while (finalCores.length < 3 && remainingCores.length > 0) {
        remainingCores.sort((a, b) => b.currentScore - a.currentScore);

        const usedItems = new Set();
        finalCores.forEach(fc => fc.ids.forEach(id => usedItems.add(id)));

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

        let selectedIndex = -1;
        
        if (validCandidates.length > 0) {
            let referenceScore = validCandidates[0].core.currentScore;
            
            const tieBreakerCandidates = validCandidates.filter(c => 
                (referenceScore - c.core.currentScore) <= DIVERSITY_PROXIMITY_WINDOW && c.core.currentScore >= DIVERSITY_SCORE_THRESHOLD
            );
            
            if (tieBreakerCandidates.length > 0) {
                tieBreakerCandidates.forEach(c => {
                    let unusedCount = 0;
                    c.core.ids.forEach(id => {
                        if (!usedItems.has(id)) unusedCount++;
                    });
                    c.unusedCount = unusedCount;
                });
                
                tieBreakerCandidates.sort((a, b) => {
                    if (b.unusedCount !== a.unusedCount) {
                        return b.unusedCount - a.unusedCount;
                    }
                    if (b.core.currentScore !== a.core.currentScore) {
                        return b.core.currentScore - a.core.currentScore;
                    }
                    return a.index - b.index;
                });
                
                selectedIndex = tieBreakerCandidates[0].index;
            } else {
                selectedIndex = validCandidates[0].index;
            }
        }

        if (selectedIndex !== -1) {
            finalCores.push(remainingCores[selectedIndex]);
            remainingCores.splice(selectedIndex, 1);
        } else {
            break;
        }
    }
    return finalCores;
}

module.exports = { extractFootprintAndSort, filterDistinctCores };
