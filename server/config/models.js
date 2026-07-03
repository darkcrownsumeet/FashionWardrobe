const MODELS = {
    stage1: {
        provider: "nvidia",
        model: "qwen/qwen3-next-80b-a3b-instruct",
        fallbackProvider: "nvidia",
        fallbackModel: "minimaxai/minimax-m3",
        fallbackTemperature: 1.0,
        fallbackTopP: 0.95,
        fallbackMaxTokens: 8192,
        temperature: 0.6,
        top_p: 0.7,
        maxTokens: 4096,
    },
    stage2: {
        provider: "gemini",
        model: "gemini-2.5-flash",
        fallbackProvider: "nvidia",
        fallbackModel: "qwen/qwen3-next-80b-a3b-instruct",
        fallbackTemperature: 0.2,
        fallbackMaxTokens: 8192,
        temperature: 0.2,
        maxTokens: 8192,
    },
    stage4: {
        provider: "openrouter",
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        fallbackProvider: "nvidia",
        fallbackModel: "meta/llama-3.1-8b-instruct",
        temperature: 0.2,
        top_p: 0.7,
        maxTokens: 4096,
    }
};

module.exports = { MODELS };
