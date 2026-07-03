function validateRequest(reqBody) {
    const { prefs, selectedItems } = reqBody;
    
    if (!prefs || typeof prefs !== 'object') {
        return { isValid: false, error: 'Invalid request: prefs is required.' };
    }

    if (selectedItems && selectedItems.length > 20) {
        return { isValid: false, error: "Too many items selected. Maximum is 20." };
    }
    if (prefs.stylePersonality && prefs.stylePersonality.join('').length > 150) {
        return { isValid: false, error: "Invalid style personality length." };
    }
    if (prefs.occasions && prefs.occasions.join('').length > 100) {
        return { isValid: false, error: "Invalid occasions length." };
    }

    return { isValid: true };
}

module.exports = { validateRequest };
