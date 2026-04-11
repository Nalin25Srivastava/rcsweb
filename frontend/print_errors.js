const fs = require('fs');
try {
    const data = JSON.parse(fs.readFileSync('lint.json', 'utf8')); // npm run lint output usually utf8, but let's try. Actually npx eslint is utf8 unless piped in PS? We'll see.
    data.forEach(file => {
        file.messages.forEach(msg => {
            if (msg.severity === 2) {
                console.log(`${file.filePath}:${msg.line}:${msg.column} - ${msg.message} (${msg.ruleId})`);
            }
        });
    });
} catch(e) {
    const data16 = JSON.parse(fs.readFileSync('lint.json', 'utf16le'));
    data16.forEach(file => {
        file.messages.forEach(msg => {
            if (msg.severity === 2) {
                console.log(`${file.filePath}:${msg.line}:${msg.column} - ${msg.message} (${msg.ruleId})`);
            }
        });
    });
}
