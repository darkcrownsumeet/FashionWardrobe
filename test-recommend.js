const fs = require('fs');

const code = `
${fs.readFileSync('d:/Fashion/FashionWardrobe/js/data/mock-data.js', 'utf8')}
${fs.readFileSync('d:/Fashion/FashionWardrobe/js/engine/recommend.js', 'utf8')}

try {
    const prefs = {
        gender: 'female',
        occasions: ['party'],
        stylePersonality: ['edgy'],
        colorPreference: 'Monochrome',
        budget: 'Premium'
    };
    const result = RecommendationEngine.generate(prefs);
    console.log("SUCCESS");
    console.log("Hero:", result.hero.name);
    console.log("Accessories:", result.accessories.map(a => a.name).join(', '));
} catch (e) {
    console.error("ERROR:", e.message);
    console.error(e.stack);
}
`;

eval(code);
