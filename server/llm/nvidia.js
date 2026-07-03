const OpenAI = require('openai');

const clients = {};

function getClient(apiKeyName) {
    if (!clients[apiKeyName]) {
        const apiKey = process.env[apiKeyName];
        if (!apiKey) {
            throw new Error(`Missing ${apiKeyName}`);
        }
        clients[apiKeyName] = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://integrate.api.nvidia.com/v1',
        });
    }
    return clients[apiKeyName];
}

async function callNvidia(modelName, prompt, options = {}) {
    let apiKeyName = 'NVIDIA_API_KEY_QWEN';
    if (modelName.includes('llama')) {
        apiKeyName = 'NVIDIA_API_KEY_LLAMA';
    } else if (modelName.includes('stage2')) {
        apiKeyName = 'NVIDIA_API_KEY_STAGE2';
    } else if (modelName.includes('deepseek')) {
        apiKeyName = 'NVIDIA_API_KEY_DEEPSEEK';
    } else if (modelName.includes('minimax')) {
        apiKeyName = 'NVIDIA_API_KEY_MINIMAX';
    }

    const client = getClient(apiKeyName);
    
    const requestPayload = {
        model: modelName,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        top_p: options.top_p,
        max_tokens: options.maxTokens || 2048,
        stream: false
    };

    if (modelName.includes('deepseek')) {
        requestPayload.chat_template_kwargs = { "thinking": true, "reasoning_effort": "low" };
    }

    const requestOptions = { timeout: 45000 };
    if (modelName.includes('deepseek') || modelName.includes('minimax') || modelName.includes('qwen')) {
        requestOptions.timeout = 300000;
        requestOptions.maxRetries = 0;
    }

    const completion = await client.chat.completions.create(requestPayload, requestOptions);
    
    if (modelName.includes('deepseek')) {
        const reasoning = completion.choices[0]?.message?.reasoning || completion.choices[0]?.message?.reasoning_content;
        if (reasoning) {
            console.log(`\n--- DEEPSEEK REASONING ---\n${reasoning}\n--------------------------\n`);
        }
    }

    const text = completion.choices[0]?.message?.content;
    if (!text) throw new Error("Empty response from NVIDIA");
    return text;
}

module.exports = { callNvidia };
