const fs = require('fs');

try {
    const data = fs.readFileSync('js/data/mock-data.js', 'utf8');
    
    // Extract the products array string
    const start = data.indexOf('const products = [');
    const end = data.indexOf('];', start) + 1;
    
    let arrayStr = data.substring(start + 17, end);
    // Remove the trailing semicolon if present
    if(arrayStr.endsWith(';')) {
        arrayStr = arrayStr.slice(0, -1);
    }

    // Evaluate the array
    const products = eval(arrayStr);
    
    const names = { male: new Set(), female: new Set(), unisex: new Set() };
    const duplicates = [];
    
    const allProducts = products;
    console.log(`Checking ${allProducts.length} items...`);

    allProducts.forEach(p => {
        // Check for duplicate names (case-insensitive) within the same gender
        const nameLower = p.name.toLowerCase();
        const gender = p.gender;

        if (names[gender] && names[gender].has(nameLower)) {
            duplicates.push(`Duplicate Name (${gender}): ${p.name} (ID: ${p.id})`);
        }
        
        if (names[gender]) names[gender].add(nameLower);
    });

    if (duplicates.length === 0) {
        console.log("No duplicates found! Everything is clean.");
    } else {
        console.log("--- DUPLICATES FOUND ---");
        duplicates.forEach(d => console.log(d));
    }
} catch (e) {
    console.error("Error parsing or checking data:", e);
}
