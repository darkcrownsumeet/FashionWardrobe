const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

async function callGemini(modelName, prompt, options = {}) {
    if (!genAI) {
        throw new Error("Missing GEMINI_API_KEY");
    }
    const generationConfig = {};
    if (options.maxTokens) generationConfig.maxOutputTokens = options.maxTokens;
    if (options.temperature !== undefined) generationConfig.temperature = options.temperature;
    if (options.top_p !== undefined) generationConfig.topP = options.top_p;

    const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: Object.keys(generationConfig).length > 0 ? generationConfig : undefined
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
}

module.exports = { callGemini };
