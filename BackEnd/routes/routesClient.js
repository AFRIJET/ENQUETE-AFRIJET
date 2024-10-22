import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const url = process.env.MONGO_URL || "mongodb+srv://bryan:bryanafrijet@enquete-afrijet.j1yge.mongodb.net/EnqueteAfrijet-db?retryWrites=true&w=majority";
let db;


// Route pour sauvegarder une enquête client
router.post('/enqueteagence', async (req, res) => {
    const data = req.body;
    console.log('Données reçues:', data);
    
    try {
        // Effectuer l'opération d'insertion en base de données
        const client = new MongoClient(url);
        db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Enquete_Agence');
        const result = await collection.insertOne(data); // Assurez-vous que "collection" est bien définie
        res.status(201).json(result);
    } catch (error) {
        console.error('Erreur lors de l\'insertion:', error);
        res.status(500).send('Erreur lors de l\'insertion des données');
    }
});

export default router;