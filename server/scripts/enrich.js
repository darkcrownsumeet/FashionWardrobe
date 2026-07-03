/**
 * DEV-ONLY MIGRATION SCRIPT — NOT RUNTIME CODE
 *
 * Purpose: One-time data enrichment script used during initial catalog migration.
 *          Reads mock-data.js, parses the products array, enriches items with
 *          additional metadata fields, and writes the result back to mock-data.js.
 *
 * Usage:   node scripts/enrich.js   (run from server/ directory, never in production)
 *
 * WARNING: Uses eval() to parse the products array and writes directly to
 *          the source file. Only run this in a development environment with
 *          a clean working tree so changes can be reviewed before committing.
 */
const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../../js/data/mock-data.js');
let content = fs.readFileSync(dataPath, 'utf-8');

// Use regex to extract the products array content safely
const productsStart = content.indexOf('const products = [');
if (productsStart === -1) {
    console.error('Could not find products array');
    process.exit(1);
}

// We will use eval to parse the products, enrich them, then reconstruct the file.
// Since mock-data.js assigns to MockData at the end, let's extract just the array part.
const arrayStart = content.indexOf('[', productsStart);
let bracketCount = 0;
let arrayEnd = -1;
for (let i = arrayStart; i < content.length; i++) {
    if (content[i] === '[') bracketCount++;
    if (content[i] === ']') bracketCount--;
    if (bracketCount === 0) {
        arrayEnd = i + 1;
        break;
    }
}

if (arrayEnd === -1) {
    console.error('Could not parse products array bounds');
    process.exit(1);
}

const productsStr = content.substring(arrayStart, arrayEnd);
let products;
try {
    // using eval to parse the array of objects (JSON.parse won't work because keys aren't quoted)
    eval('products = ' + productsStr + ';');
} catch (e) {
    console.error('Eval error', e);
    process.exit(1);
}

// Helper to determine metadata based on name/category
function enrichItem(item) {
    const name = item.name.toLowerCase();
    
    // Fit logic
    if (name.includes('oversized') || name.includes('baggy') || name.includes('relaxed') || name.includes('pump cover')) {
        item.fit = 'Oversized';
    } else if (name.includes('tailored') || name.includes('suit') || name.includes('blazer') || name.includes('corset')) {
        item.fit = 'Tailored';
    } else if (name.includes('seamless') || name.includes('slim') || name.includes('leggings')) {
        item.fit = 'Slim';
    } else {
        item.fit = 'Regular';
    }

    // Material logic
    if (name.includes('silk') || name.includes('satin')) item.material = 'Silk';
    else if (name.includes('leather')) item.material = 'Leather';
    else if (name.includes('linen')) item.material = 'Linen';
    else if (name.includes('denim') || name.includes('jeans')) item.material = 'Denim';
    else if (name.includes('knit') || name.includes('sweater') || name.includes('cardigan') || name.includes('turtleneck')) item.material = 'Knit';
    else if (name.includes('fleece') || name.includes('sweat') || name.includes('hoodie')) item.material = 'Fleece';
    else if (name.includes('chiffon') || name.includes('georgette')) item.material = 'Georgette';
    else if (name.includes('wool')) item.material = 'Wool';
    else item.material = 'Cotton/Blend'; // default generic

    // Season logic
    if (name.includes('sweater') || name.includes('turtleneck') || name.includes('fleece') || name.includes('boots') || name.includes('jacket') && !name.includes('linen')) {
        item.seasons = ['Fall', 'Winter', 'Spring'];
    } else if (name.includes('shorts') || name.includes('sandals') || name.includes('linen') || name.includes('resort') || name.includes('tank') || name.includes('camisole')) {
        item.seasons = ['Spring', 'Summer'];
    } else {
        item.seasons = ['Spring', 'Summer', 'Fall', 'Winter']; // All-season
    }
    
    return item;
}

products.forEach(enrichItem);

// Inject Genuine Gaps: Ribbed Tank Tops (Male & Female) for layering
const newItems = [
    {
        id: 'f-top-gen-tank', name: 'Ribbed Tank Top', category: 'topwear', garmentType: 'Tank Top', garmentStructure: 'Top', layer: 'Base', gender: 'female', occasions: ['casual', 'gym', 'college', 'vacation'], styles: ['effortless-chic', 'street-style', 'athleisure', 'minimalist'], colorPalette: 'Monochrome', budget: 'Budget', price: 20, image: 'assets/dummy/female_tank.jpg', affiliateUrl: '#', description: 'Essential layering piece', fit: 'Slim', material: 'Cotton Blend', seasons: ['Spring', 'Summer', 'Fall', 'Winter']
    },
    {
        id: 'm-top-gen-tank', name: 'Ribbed Tank Top', category: 'topwear', garmentType: 'Tank Top', garmentStructure: 'Top', layer: 'Base', gender: 'male', occasions: ['casual', 'gym', 'vacation'], styles: ['streetwear', 'athleisure', 'resort', 'minimalist'], colorPalette: 'Monochrome', budget: 'Budget', price: 20, image: 'assets/dummy/male_tank.jpg', affiliateUrl: '#', description: 'Essential base layer for open shirts', fit: 'Slim', material: 'Cotton Blend', seasons: ['Spring', 'Summer', 'Fall', 'Winter']
    }
];

products.push(...newItems);

// Convert back to JS string
let newProductsStr = '[\n';
products.forEach((p, idx) => {
    // stringify the object
    let objStr = JSON.stringify(p);
    // remove quotes from keys for cleaner JS syntax matching original
    objStr = objStr.replace(/"([^"]+)":/g, '$1: ').replace(/"/g, "'");
    newProductsStr += '        ' + objStr + (idx < products.length - 1 ? ',\n' : '\n');
});
newProductsStr += '    ]';

// Replace the original array with the new one
content = content.substring(0, arrayStart) + newProductsStr + content.substring(arrayEnd);

fs.writeFileSync(dataPath, content, 'utf-8');
console.log('Successfully enriched mock-data.js and added structural gaps!');
