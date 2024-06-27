const { MongoClient } = require('mongodb');

const DB_NAME = 'marvel';

const url = process.env.MONGO_URL;

const client = new MongoClient(url);

module.exports.handler = async (event, context) => {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('characters');

    if (await collection.countDocuments() === 0) {
        const characters = require('./characters.json');

        await collection.createIndex({ id: 1 }, { unique: true });
        await collection.insertMany(characters);
    }


    const id = event.queryStringParameters.id;
    if (!id) {
        const characters = await collection.find({}).toArray();
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(characters)
        };
    }

    const character = await collection.findOne({ id: parseInt(id) });
    if (!character) {
        return {
            statusCode: 404,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Not found' })
        };
    }

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(character)
    };
}