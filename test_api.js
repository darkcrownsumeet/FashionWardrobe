const http = require('http');

const payload = JSON.stringify({
    prefs: {
        gender: "male",
        occasions: ["casual"],
        stylePersonality: ["streetwear"],
        currentOutfit: null
    },
    selectedItems: [
        { id: "T1", category: "topwear", name: "White Graphic Tee", styles: ["streetwear", "casual"], occasions: ["casual", "party"], gender: "male" },
        { id: "B1", category: "bottomwear", name: "Black Cargo Pants", styles: ["streetwear", "utility"], occasions: ["casual", "outdoor"], gender: "male" },
        { id: "O1", category: "outerwear", name: "Denim Jacket", styles: ["casual"], occasions: ["casual"], gender: "male" }
    ],
    fallbackHero: null
});

const req = http.request({
    hostname: 'localhost',
    port: 4000,
    path: '/api/recommend',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
    }
}, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
        const text = chunk.toString();
        const lines = text.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const parsed = JSON.parse(line.substring(6));
                    if (parsed.status) {
                        console.log(`[STATUS] ${parsed.status}`);
                    }
                    if (parsed.result) {
                        console.log('\n--- FINAL RESULT ---');
                        console.log(JSON.stringify(parsed.result, null, 2));
                        console.log('--------------------');
                    }
                    if (parsed.error) {
                        console.error(`[ERROR] ${parsed.error}`);
                    }
                } catch(e) {}
            }
        }
    });
    res.on('end', () => {
        console.log('Stream ended');
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(payload);
req.end();
