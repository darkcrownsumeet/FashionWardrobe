const { callGemini } = require('./gemini');
const { callNvidia } = require('./nvidia');
const { callOpencode } = require('./opencode');
const { callOpenrouter } = require('./openrouter');
const { MODELS } = require('../config/models');

async function generate({ stage, prompt, useFallback = false }) {
    const config = MODELS[stage];
    if (!config) {
        throw new Error(`No model config found for stage: ${stage}`);
    }

    const provider = useFallback ? config.fallbackProvider : config.provider;
    const model = useFallback ? config.fallbackModel : config.model;

    if (!provider || !model) {
        throw new Error(`No provider or model specified for ${stage} (fallback: ${useFallback})`);
    }

    const options = {
        temperature: useFallback && config.fallbackTemperature !== undefined ? config.fallbackTemperature : config.temperature,
        top_p: useFallback && config.fallbackTopP !== undefined ? config.fallbackTopP : config.top_p,
        maxTokens: useFallback && config.fallbackMaxTokens !== undefined ? config.fallbackMaxTokens : config.maxTokens
    };

    if (provider === 'gemini') {
        return await callGemini(model, prompt, options);
    } else if (provider === 'nvidia') {
        return await callNvidia(model, prompt, options);
    } else if (provider === 'opencode') {
        return await callOpencode(model, prompt, options);
    } else if (provider === 'openrouter') {
        return await callOpenrouter(model, prompt, options);
    } else {
        throw new Error(`Unsupported provider: ${provider}`);
    }
}

module.exports = { generate };
