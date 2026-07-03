function parseLLMJson(jsonText) {
    if (!jsonText) return null;
    
    let cleanedText = jsonText.replace(/<think>[\s\S]*?<\/think>/gi, '');
    cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    const firstBrace = cleanedText.indexOf('{');
    const lastBrace = cleanedText.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
        cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
    }
    
    try {
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse JSON:", e);
        console.error("Raw text was:", jsonText);
        return null;
    }
}

module.exports = { parseLLMJson };
