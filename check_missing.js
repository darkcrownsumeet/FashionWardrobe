const fs = require('fs');
const path = require('path');

const mockData = fs.readFileSync('js/data/mock-data.js', 'utf8');

// Extract all image filenames from mock-data.js (ignoring path and extension)
const imageRegex = /image:\s*'([^']+)'/g;
let match;
const usedImages = new Set();
while ((match = imageRegex.exec(mockData)) !== null) {
    const url = match[1];
    if (url.startsWith('assets/img/')) {
        // Get the basename without extension and convert to lowercase for comparison
        let basename = url.split('/').pop();
        // remove extension and any query params like ?v=3
        basename = basename.split('?')[0].split('.')[0].toLowerCase();
        // handle prefixes I added like 'Male '
        if (basename.startsWith('male ')) basename = basename.substring(5);
        if (basename.startsWith('female ')) basename = basename.substring(7);
        usedImages.add(basename);
    }
}

// Function to recursively find files
function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const stat = fs.statSync(path.join(dir, file));
        if (stat.isDirectory()) {
            getFiles(path.join(dir, file), fileList);
        } else {
            fileList.push(path.join(dir, file));
        }
    }
    return fileList;
}

// Check MALE_Workshop Step-4 and Extra
const workshopPaths = [
    'd:/Fashion/MALE_Workshop/Step-4',
    'd:/Fashion/MALE_Workshop/Extra'
];

const missingFiles = [];

for (const wp of workshopPaths) {
    if (fs.existsSync(wp)) {
        const files = getFiles(wp);
        for (const file of files) {
            let basename = path.basename(file);
            basename = basename.split('.')[0].toLowerCase();
            // remove 'male ' prefix if it exists in the workshop file name
            if (basename.startsWith('male ')) basename = basename.substring(5);
            
            if (!usedImages.has(basename)) {
                missingFiles.push(file);
            }
        }
    }
}

console.log('--- MISSING FILES ---');
missingFiles.forEach(f => console.log(f));
console.log('Total Missing:', missingFiles.length);
