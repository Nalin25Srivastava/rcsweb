const fs = require('fs');
const path = require('path');

/**
 * Robust script to mirror the frontend/dist directory to a root-level public directory.
 * This ensures Vercel can always find the production assets in a standard location.
 */
function mirrorBuild() {
    console.log('--- Starting Build Mirroring ---');
    
    const rootDir = process.cwd();
    const sourceDir = path.join(rootDir, 'frontend', 'dist');
    const targetDir = path.join(rootDir, 'dist');

    console.log(`Source: ${sourceDir}`);
    console.log(`Target: ${targetDir}`);

    // Check if source exists
    if (!fs.existsSync(sourceDir)) {
        console.error('ERROR: frontend/dist directory not found.');
        process.exit(1);
    }

    // Prepare target directory
    try {
        if (fs.existsSync(targetDir)) {
            console.log('Removing old target directory...');
            fs.rmSync(targetDir, { recursive: true, force: true });
        }
        fs.mkdirSync(targetDir, { recursive: true });
        console.log('Target directory created.');
    } catch (err) {
        console.error(`ERROR: Failed to prepare target directory: ${err.message}`);
        process.exit(1);
    }

    // Copy all files recursively from source to target
    try {
        console.log('Copying files...');
        fs.cpSync(sourceDir, targetDir, { recursive: true });
        console.log('Files copied successfully.');
    } catch (err) {
        console.error(`ERROR: Failed to copy files: ${err.message}`);
        process.exit(1);
    }

    // Verify copy
    const indexHtml = path.join(targetDir, 'index.html');
    if (fs.existsSync(indexHtml)) {
        console.log('SUCCESS: Build mirrored correctly. index.html found in target.');
    } else {
        console.warn('WARNING: index.html not found in target directory.');
    }

    console.log('--- Build Mirroring Complete ---');
}

mirrorBuild();
