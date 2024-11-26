import express from 'express';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const SECRET_KEY = "enquete-afrijet";

const url = process.env.MONGO_URL || "mongodb+srv://bryan:bryanafrijet@enquete-afrijet.j1yge.mongodb.net/EnqueteAfrijet-db?retryWrites=true&w=majority";
let db;

// Route le login
router.post('/login', async (req, res) => {
    const { utilisateur, password } = req.body;

    try {
        // Vérifie si les champs sont fournis
        if (!utilisateur || !password) {
            return res.status(400).send({ success: false, message: "Nom d'utilisateur incorrect" });
        }

        // Connexion à la base de données MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Utilisateur');

        // Recherche l'utilisateur par le nom d'utilisateur
        const user = await collection.findOne({ utilisateur: utilisateur });
        if (!user) {
            await client.close(); // Fermer la connexion
            return res.status(404).send({ success: false, message: "Nom d'utilisateur incorrect" });
        }

        // Vérifie si le mot de passe correspond
        if (password !== user.password) {
            await client.close(); // Fermer la connexion
            return res.status(401).send({ success: false, message: "Mot de passe incorrect" });
        }

        // Génère un token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Payload
            SECRET_KEY, // Clé secrète
            { expiresIn: '2h' } // Expiration
        );

        // Ferme la connexion à la base de données après la génération du token
        await client.close();

        // Renvoie le token et les informations utilisateur
        return res.status(200).send({
            success: true,
            message: "Connexion réussie",
            token,
            user: {
                id: user._id,
                utilisateur: user.utilisateur,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Erreur serveur:', err);
        return res.status(500).send({ success: false, message: "Erreur serveur" });
    }
});

export default router;