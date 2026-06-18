const fs = require('fs');
let code = fs.readFileSync('d:/Fashion/FashionWardrobe/js/data/mock-data.js', 'utf8');

const outerwearNames = ['Tailored Blazer', 'Cardigan', 'Graphic Hoodie', 'Zip-Up Track Jacket', 'Windbreaker Pullover', 'Chunky Knit Sweater'];

const dataStrMatch = code.match(/const products = \[([\s\S]*?)\];/);
if (!dataStrMatch) {
    console.error('Could not find products array');
    process.exit(1);
}
const dataStr = dataStrMatch[0];
const productsStr = dataStr.replace('const products = ', '').replace(/;$/, '');
let products;
eval('products = ' + productsStr + ';');

products.forEach(p => {
    if (p.gender === 'female') {
        if (outerwearNames.includes(p.name)) {
            p.category = 'outerwear';
        }
        
        if (p.styles.includes('power-dressing') || p.styles.includes('business-casual') || p.styles.includes('effortless-chic') || p.name === 'Structured Tote') {
            if (!p.occasions.includes('business-casual')) {
                p.occasions.push('business-casual');
            }
        }
    }
});

function serializeObject(obj) {
    const pairs = Object.entries(obj).map(([k, v]) => {
        let valStr;
        if (Array.isArray(v)) {
            valStr = '[' + v.map(item => "'" + item + "'").join(', ') + ']';
        } else if (typeof v === 'string') {
            valStr = "'" + v.replace(/'/g, "\\'") + "'";
        } else {
            valStr = v;
        }
        return k + ': ' + valStr;
    });
    return '        { ' + pairs.join(', ') + ' }';
}

const lines = ['const products = ['];
products.forEach((p, i) => {
    lines.push(serializeObject(p) + (i === products.length - 1 ? '' : ','));
});
lines.push('];');

code = code.replace(dataStr, lines.join('\\n'));
fs.writeFileSync('d:/Fashion/FashionWardrobe/js/data/mock-data.js', code);
console.log('Successfully updated mock-data.js');
