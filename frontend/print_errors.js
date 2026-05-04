/* global require */
const fs = require('fs');
try {
    const data = JSON.parse(fs.readFileSync('lint.json', 'utf8')); 
    data.forEach(file => {
        file.messages.forEach(msg => {
            if (msg.severity === 2) {
                console.log(`${file.filePath}:${msg.line}:${msg.column} - ${msg.message} (${msg.ruleId})`);
            }
        });
    });
} catch(err) {
    try {
        const data16 = JSON.parse(fs.readFileSync('lint.json', 'utf16le'));
        data16.forEach(file => {
            file.messages.forEach(msg => {
                if (msg.severity === 2) {
                    console.log(`${file.filePath}:${msg.line}:${msg.column} - ${msg.message} (${msg.ruleId})`);
                }
            });
        });
    } catch (e2) {
        console.error('Failed to read lint.json:', err, e2);
    }
}
