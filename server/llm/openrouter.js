const OpenAI = require('openai');

let client = null;

function getClient() {
    if (!client) {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new Error(`Missing OPENROUTER_API_KEY`);
        }
        client = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://openrouter.ai/api/v1',
            defaultHeaders: {
                'HTTP-Referer': 'https://fashionwardrobe.app',
                'X-Title': 'FashionWardrobe',
            },
        });
    }
    return client;
}

// Timeout for OpenRouter - 120s (must be less than pipeline timeout of 240s)
const OPENROUTER_TIMEOUT_MS = 120000;

async function callOpenrouter(modelName, prompt, options = {}) {
    const apiClient = getClient();

    const completion = await apiClient.chat.completions.create({
        model: modelName,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature ?? 0.2,
        top_p: options.top_p,
        max_tokens: options.maxTokens || 4096,
        stream: false,
    }, { timeout: OPENROUTER_TIMEOUT_MS });

    if (!completion || !completion.choices || !completion.choices[0]) {
        console.error('OpenRouter returned unexpected response:', JSON.stringify(completion, null, 2));
        throw new Error('OpenRouter returned unexpected response format');
    }

    const text = completion.choices[0].message?.content;
    if (!text) throw new Error('Empty response from OpenRouter');
    return text;
}

module.exports = { callOpenrouter };
