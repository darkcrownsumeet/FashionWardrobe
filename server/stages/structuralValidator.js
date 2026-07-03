

function validateCandidate(candidateIds, itemMap) {
    const primaryCounts = { Top: 0, Bottom: 0, OnePiece: 0 };
    const secondaryCounts = { Outerwear: 0, Footwear: 0, Unknown: 0 };

    candidateIds.forEach(id => {
        const item = itemMap[id];
        if (!item) return;
        
        const structure = item.garmentStructure;
        if (structure === 'Top') primaryCounts.Top++;
        else if (structure === 'Bottom') primaryCounts.Bottom++;
        else if (structure === 'OnePiece') primaryCounts.OnePiece++;
        else if (structure === 'Outerwear') secondaryCounts.Outerwear++;
        else if (structure === 'Footwear') secondaryCounts.Footwear++;
        else secondaryCounts.Unknown++;
    });

    let isStructurallyValid = true;
    const structuralConflicts = [];

    if (primaryCounts.Top === 0 && primaryCounts.Bottom === 0 && primaryCounts.OnePiece === 0) {
        isStructurallyValid = false;
        structuralConflicts.push("Zero primary garments");
    }

    if (primaryCounts.OnePiece > 0 && (primaryCounts.Top > 0 || primaryCounts.Bottom > 0)) {
        isStructurallyValid = false;
        structuralConflicts.push("Contradictory OnePiece combination");
    }

    const missingPrimaryCategories = [];
    if (isStructurallyValid && primaryCounts.OnePiece === 0) {
        if (primaryCounts.Top === 0) missingPrimaryCategories.push("Top");
        if (primaryCounts.Bottom === 0) missingPrimaryCategories.push("Bottom");
    }

    return {
        isStructurallyValid,
        primaryCounts,
        secondaryCounts,
        missingPrimaryCategories,
        structuralConflicts
    };
}

module.exports = { validateCandidate };
