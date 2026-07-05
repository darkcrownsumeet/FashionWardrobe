const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Default timeout for Gemini calls (should be less than pipeline timeout of 240s)
const GEMINI_TIMEOUT_MS = 120000;

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
    
    // Wrap with timeout since GoogleGenerativeAI doesn't support native timeout
    const generatePromise = model.generateContent(prompt);
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Gemini timeout")), GEMINI_TIMEOUT_MS);
    });
    
    const result = await Promise.race([generatePromise, timeoutPromise]);
    return result.response.text();
}

module.exports = { callGemini };
