const { MongoClient } = require('mongodb');

const SOURCE_URI = 'mongodb://127.0.0.1:27017';
const SOURCE_DB = 'rcs_placements';
const TARGET_URI = 'mongodb+srv://ns300142:ns300142@mohit.z0lica1.mongodb.net/rcs_placements';
const TARGET_DB = 'rcs_placements';

async function migrate() {
    console.log('--- Starting MongoDB Migration ---');
    console.log(`Source: ${SOURCE_DB}`);
    console.log(`Target: ${TARGET_DB} on Atlas`);
    
    // Check if mongodb is installed
    try {
        require.resolve('mongodb');
    } catch (e) {
        console.error('Error: "mongodb" driver not found. Please run "npm install" first.');
        return;
    }

    const sourceClient = new MongoClient(SOURCE_URI);
    const targetClient = new MongoClient(TARGET_URI);

    try {
        console.log('Connecting to Source...');
        await sourceClient.connect();
        const srcDb = sourceClient.db(SOURCE_DB);

        console.log('Connecting to Target/Atlas...');
        await targetClient.connect();
        const trgDb = targetClient.db(TARGET_DB);

        const collections = await srcDb.listCollections().toArray();
        console.log(`Found ${collections.length} collections locally.`);

        for (const colInfo of collections) {
            const colName = colInfo.name;
            if (colName.startsWith('system.')) continue; // skip system collections

            console.log(`\nMigrating collection: ${colName}...`);
            
            const count = await srcDb.collection(colName).countDocuments();
            if (count === 0) {
                console.log(`  Skipping empty collection: ${colName}`);
                continue;
            }

            console.log(`  Found ${count} documents locally.`);
            const documents = await srcDb.collection(colName).find().toArray();
            
            // Drop target collection if it exists to ensure a clean migration
            try {
                await trgDb.collection(colName).drop();
                console.log(`  Dropped existing collection on Atlas to refresh data.`);
            } catch (err) {
                // Ignore if doesn't exist
            }

            const result = await trgDb.collection(colName).insertMany(documents);
            console.log(`  Successfully inserted ${result.insertedCount} documents into Atlas.`);
        }

        console.log('\n--- Migration Complete Successfully ---');

    } catch (err) {
        console.error('\n!!! Migration Failed !!!');
        console.error(err);
    } finally {
        await sourceClient.close();
        await targetClient.close();
    }
}

migrate();
