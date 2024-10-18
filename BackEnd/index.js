import { MongoClient } from 'mongodb';
import express from 'express';
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Charger la chaîne de connexion MongoDB depuis .env
const url = process.env.MONGO_URL || "mongodb+srv://bryan:bryanafrijet@enquete-afrijet.j1yge.mongodb.net/EnqueteAfrijet-db?retryWrites=true&w=majority";

let db;

async function connectToDatabase() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        db = client.db('EnqueteAfrijet-db');
        console.log('Connected to MongoDB');
        // const collection = db.collection('EnqueteAfrijet'); // Remplace 'users' par le nom de ta collection

        // Récupérer toutes les données de la collection
        // const users = await collection.find({}).toArray();
        // console.log(users); // Afficher les données récupérées
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToDatabase();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
