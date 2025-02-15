import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const url = process.env.MONGO_URL || "mongodb+srv://bryan:bryanafrijet@enquete-afrijet.j1yge.mongodb.net/EnqueteAfrijet-db?retryWrites=true&w=majority";
let db;


// Route pour sauvegarder une enquête agence
router.post('/enquete_agence', async (req, res) => {
    const data = req.body;
    
    try {
        if (data.date && typeof data.date === 'string') {
            data.date = new Date(data.date);
        }
        const client = new MongoClient(url);
        db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Enquete_Agence');
        const result = await collection.insertOne(data);
        res.status(201).json(result);
    } catch (error) {
        console.error('Erreur lors de l\'insertion:', error);
        res.status(500).send('Erreur lors de l\'insertion des données');
    }
});

// Route pour sauvegarder une enquete satisfaction
router.post('/enquete_satisfaction', async (req, res) => {
    const data = req.body;

    try {
        if (data.date && typeof data.date === 'string') {
            data.date = new Date(data.date);
        }
        const client = new MongoClient(url);
        db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Enquete_Satisfaction');
        const result = await collection.insertOne(data);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error lors de l\'insertion:", error);
        res.status(500).send("Errreur lors de l'insertion des données");
    }
})

router.post('/enquete_entreprise', async (req, res) => {
    const data = req.body;

    try {
        if (data.date && typeof data.date === 'string') {
            data.date = new Date(data.date);
        }
        const client = new MongoClient(url);
        db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Enquete_Entreprise');
        const result = await collection.insertOne(data);
        res.status(201).json(result);
    } catch (error) {
        console.error("Erreur lors de l\'insertion des données", error)
        res.status(500).send("Erreur lors de l\'insertion");
    }
})

export default router;