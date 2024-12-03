import express from 'express';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import ExcelJS from 'exceljs';
import { stringify } from 'csv-stringify/browser/esm';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'

dotenv.config();

const router = express.Router();
const SECRET_KEY = "enquete-afrijet";

const url = process.env.MONGO_URL || "mongodb+srv://bryan:bryanafrijet@enquete-afrijet.j1yge.mongodb.net/EnqueteAfrijet-db?retryWrites=true&w=majority";

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

        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
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

//Route pour vérifier l'administrateur
router.get('/admin', async (req, res) => {
    const { utilisateur } = req.query;
    try {
        // Connexion à la base de données MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Utilisateur');

        // Recherche l'utilisateur dans la base de données
        const user = await collection.findOne({ utilisateur: utilisateur });

        // Vérifie si l'utilisateur est un administrateur
        const isAdmin = user.role === 'admin';
        const password = user.password;

        // Ferme la connexion à la base de données
        await client.close();

        // Renvoie le résultat
        return res.status(200).send({
            success: true,
            user: {
                id: user._id,
                utilisateur: user.utilisateur,
                role: user.role
            },
            isAdmin,
            password
        });
    } catch (error) {
        console.error('Erreur serveur:', error);
        return res.status(500).send({ success: false, message: "Erreur serveur" });
    }
});

//Route pour récupérer tout les utilisateurs
router.get('/users', async (req, res) => {
    try {
        // Connexion à la base de données MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Utilisateur');

        // Recherche l'utilisateur dans la base de données
        const users = await collection.find({}).toArray();

        // Ferme la connexion à la base de données
        await client.close();

        // Renvoie le résultat
        res.status(200).send({
            success: true,
            users
        });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).send({ success: false, message: "Erreur serveur" });
    }
});

//Route pour créer un utilisateur
router.post('/add_users', async (req, res) => {
    const data = req.body;

    try {
        // Hacher le mot de passe avec bcrypt
        const saltRounds = 5; // Nombre de tours pour générer le sel
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        // Remplace le mot de passe dans les données par le mot de passe haché
        data.password = hashedPassword;

        // Connexion à la base de données MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Utilisateur');

        //Insertion des données
        const result = await collection.insertOne(data);

        // Ferme la connexion à la base de données
        await client.close();

        // Renvoie le token et les informations utilisateur
        return res.status(200).send({ success: true, message: "Utilisateur crée avec succeès" });
    } catch (err) {
        console.error('Erreur serveur:', err);
        return res.status(500).send({ success: false, message: "Erreur serveur" });
    }
});

//Route pour recupérer un utilisateur
router.get('/user_update', async (req, res) => {
    const { id } = req.query;

    try {
        // Connexion à MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Utilisateur');

        // Conversion de l'ID en ObjectId si nécessaire
        const objectId = new ObjectId(id);

        // Recherche l'utilisateur dans la base de données
        const user = await collection.findOne({ _id: objectId });

        // Ferme la connexion à la base de données
        await client.close();

        // Renvoie le résultat
        res.status(200).send({ success: true, user });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).send({ success: false, message: "Erreur serveur" });
    }
})

//Route pour supprimer un utilisateur
router.delete('/delete_user', async (req, res) => {
    const { id } = req.body;

    try {
        // Connexion à MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Utilisateur');

        // Conversion de l'ID en ObjectId si nécessaire
        const objectId = new ObjectId(id);

        // Mise à jour du profil utilisateur
        const result = await collection.deleteMany({ _id: objectId });

        await client.close(); // Fermer la connexion

        return res.status(200).send({ success: true, message: "Utilisateur supprimé avec succès" });
    } catch (err) {
        console.error('Erreur serveur:', err);
        return res.status(500).send({ success: false, message: "Erreur serveur" });
    }
})

// Route pour mettre à jour un profil
router.put('/update_profil', async (req, res) => {
    const { id, ...data } = req.body; // Récupère l'utilisateur et les données à mettre à jour

    if (!id) {
        return res.status(400).send({ success: false, message: "Nom d'utilisateur manquant" });
    }

    try {
        // Hacher le mot de passe avec bcrypt
        const saltRounds = 5; // Nombre de tours pour générer le sel
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        // Remplace le mot de passe dans les données par le mot de passe haché
        data.password = hashedPassword;
        
        // Connexion à MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Utilisateur');

        // Conversion de l'ID en ObjectId si nécessaire
        const objectId = new ObjectId(id);

        // Mise à jour du profil utilisateur
        const result = await collection.updateOne(
            { _id: objectId }, // Filtre pour trouver l'utilisateur
            { $set: data } // Données à mettre à jour
        );

        await client.close(); // Fermer la connexion

        if (result.modifiedCount === 0) {
            return res.status(404).send({ success: false, message: "Utilisateur non trouvé ou aucune modification apportée" });
        }

        return res.status(200).send({ success: true, message: "Profil mis à jour avec succès" });
    } catch (err) {
        console.error('Erreur serveur:', err);
        return res.status(500).send({ success: false, message: "Erreur serveur" });
    }
});

//Route pour générer un rapport excel des enquetes
router.get('/generate_excel_report', async (req, res) => {
    const { enquete, StartDate, EndDate } = req.query;

    try {
        // Connexion à la base de données MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection(enquete);

        // Convertir la date en objet Date dans MongoDB pour filtrer les données
        db.collection.updateMany(
            {},
            [
                {
                    $set: {
                        date: { $toDate: "$date" } // Convertit le champ date en type Date
                    }
                }
            ]
        );

        // Construire la requête de filtrage
        const query = {};
        if (StartDate && EndDate) {
            query.date = {
                $gte: new Date(StartDate),
                $lte: new Date(EndDate),
            };
        }

        // Recherche des données dans la base de données
        const users = await collection.find(query, { projection: { _id: 0 } }).toArray();

        // Si des utilisateurs sont trouvés, générer le rapport Excel
        if (users.length === 0) {
            return res.status(404).send({ success: false, message: "Aucune donnée trouvée pour le rapport" });
        }

        // Déterminer dynamiquement les colonnes nécessaires
        const columns = new Set();
        users.forEach(user => {
            Object.keys(user).forEach(key => columns.add(key));
        });

        // Convertir le Set en tableau trié pour les colonnes
        const columnsArray = Array.from(columns);

        // Construire les données dans le format des colonnes
        const data = users.map(user => {
            return columnsArray.map(col => user[col] || ''); // Ajouter une valeur vide si la colonne est absente
        });

        // Créer un nouveau classeur Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(enquete);

        // Ajouter les en-têtes des colonnes
        worksheet.addRow(columnsArray)

        // Ajouter les données des utilisateurs
        data.forEach(row => worksheet.addRow(row));

        // Ajustement automatique des colonnes
        worksheet.columns.forEach(column => {
            column.width = 30
        });

        // Convertir le classeur en fichier Excel
        const buffer = await workbook.xlsx.writeBuffer();

        await client.close(); // Fermer la connexion

        // Définir le type de contenu pour un fichier Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=rapport_${enquete}.xlsx`);
        res.status(200).send(buffer);
    } catch (error) {
        console.error('Erreur serveur:', error);
        return res.status(500).send({ success: false, message: "Erreur serveur lors de la génération du rapport Excel" });
    }
});

// Route pour générer les rapports des enquetes aux formats CSV
router.get('/generate_csv_report', async (req, res) => {
    const { enquete, StartDate, EndDate } = req.query;

    try {
        // Connexion à la base de données MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection(enquete);

        // Convertir la date en objet Date dans MongoDB pour filtrer les données
        db.collection.updateMany(
            {},
            [
                {
                    $set: {
                        date: { $toDate: "$date" } // Convertit le champ date en type Date
                    }
                }
            ]
        );

        // Construire la requête de filtrage
        const query = {};
        if (StartDate && EndDate) {
            query.date = {
                $gte: new Date(StartDate),
                $lte: new Date(EndDate),
            };
        }

        // Recherche des données dans la base de données
        const users = await collection.find(query, { projection: { _id: 0 } }).toArray();

        if (users.length === 0) {
            return res.status(404).send({ success: false, message: "Aucune donnée trouvée pour le rapport" });
        }

        // Générer dynamiquement les colonnes
        const columns = Array.from(
            new Set(users.flatMap(user => Object.keys(user)))
        );

        // Construire les données en CSV
        const rows = users.map(user => {
            return columns.map(col => user[col] || ''); // Ajoute une valeur vide si la colonne est absente
        });

        // Ajouter les en-têtes de colonnes en première ligne
        rows.unshift(columns);


        // Configuration pour le fichier CSV
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=rapport_${enquete}.csv`);

        // Création et envoi du flux CSV
        const stringifier = stringify({ header: false }); // Pas besoin de redéfinir les en-têtes, déjà inclus dans `rows`
        stringifier.pipe(res); // Rediriger les données vers la réponse HTTP
        rows.forEach(row => stringifier.write(row)); // Ajouter chaque ligne au CSV
        stringifier.end(); // Terminer le flux
        res.status(200)

        await client.close();

    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).send({ success: false, message: "Erreur serveur lors de la génération du rapport CSV" });
    }
});

export default router;