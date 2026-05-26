const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'frontend', 'src');

const colorMap = [
    // Tailwind classes
    { regex: /emerald-500/g, replacement: 'blue-600' },
    { regex: /emerald-600/g, replacement: 'blue-700' },
    { regex: /emerald-400/g, replacement: 'blue-500' },
    { regex: /emerald-300/g, replacement: 'blue-400' },
    { regex: /emerald-200/g, replacement: 'blue-300' },
    { regex: /emerald-100/g, replacement: 'blue-100' },
    { regex: /emerald-50/g, replacement: 'blue-50' },
    { regex: /emerald-700/g, replacement: 'blue-800' },
    { regex: /emerald-800/g, replacement: 'blue-900' },
    { regex: /emerald-900/g, replacement: 'blue-950' },

    // Hex codes used in Navbar / components
    { regex: /#00c57d/g, replacement: '#2563eb' }, // blue-600 equivalent
    { regex: /#00ae6e/g, replacement: '#1d4ed8' }, // blue-700 equivalent
];

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            for (const { regex, replacement } of colorMap) {
                content = content.replace(regex, replacement);
            }
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated colors in: ${fullPath}`);
            }
        }
    }
}

try {
    console.log(`Starting replacement in ${targetDir}`);
    processDirectory(targetDir);
    console.log('Finished replacing colors.');
} catch (err) {
    console.error('Error:', err);
}
