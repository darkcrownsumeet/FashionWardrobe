const OpenAI = require('openai');

let client = null;

function getClient() {
    if (!client) {
        const apiKey = process.env.OPENCODE_API_KEY;
        if (!apiKey) {
            throw new Error(`Missing OPENCODE_API_KEY`);
        }
        client = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://console.opencode.ai/inference/openai/v1',
        });
    }
    return client;
}

async function callOpencode(modelName, prompt, options = {}) {
    const apiClient = getClient();
    
    const completion = await apiClient.chat.completions.create({
        model: modelName,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        top_p: options.top_p,
        max_tokens: options.maxTokens || 2048,
        stream: false
    }, { timeout: 45000 });
    
    if (!completion || !completion.choices || !completion.choices[0]) {
        console.error("Opencode returned unexpected response:", JSON.stringify(completion, null, 2));
        throw new Error("Opencode returned unexpected response format");
    }
    
    const text = completion.choices[0].message?.content;
    if (!text) throw new Error("Empty response from Opencode");
    return text;
}

module.exports = { callOpencode };
