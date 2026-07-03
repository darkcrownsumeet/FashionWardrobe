function debugLog(title, content) {
    if (process.env.DEBUG_PIPELINE === 'true') {
        console.log(`\n--- ${title} ---`);
        console.log(typeof content === 'string' ? content : JSON.stringify(content, null, 2));
        console.log("-".repeat(title.length + 8) + "\n");
    }
}

function debugWarn(title, content) {
    if (process.env.DEBUG_PIPELINE === 'true') {
        console.warn(`\n[WARNING] --- ${title} ---`);
        console.warn(typeof content === 'string' ? content : JSON.stringify(content, null, 2));
        console.warn("-".repeat(title.length + 18) + "\n");
    }
}

module.exports = {
    debugLog,
    debugWarn
};
