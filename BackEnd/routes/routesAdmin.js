import express from 'express';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import ExcelJS from 'exceljs';
import { stringify } from 'csv-stringify/browser/esm';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Joi from 'joi';

dotenv.config();

const router = express.Router();
const url = process.env.MONGO_URL;
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware JWT
const authenticateToken = (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token invalide ou expiré' });
    }
};

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send({ message: 'Non autorisé' });
    }
}

// Route le login
router.post('/login', async (req, res) => {

    const schema = Joi.object({
        utilisateur: Joi.string().required(),
        password: Joi.string().required()
    });

    // Validation des données d'entrée
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({
            success: false,
            message: "Données de connexion invalides",
            details: error.details
        });
    }

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
            { id: user._id, user: user.utilisateur, role: user.role }, // Payload
            SECRET_KEY, // Clé secrète
            { expiresIn: '1h' } // Expiration
        );

        req.session.user = { id: user._id, name: user.utilisateur, role: user.role };
        req.session.save();


        // Définition du cookie avec des options sécurisées
        res.cookie('auth_token', token, {
            httpOnly: true,      // Inaccessible au JavaScript client
            secure: false,        // Transmis uniquement via HTTPS
            sameSite: 'Strict',  // Protéger contre les requêtes CSRF
            maxAge: 3600000,     // Durée de vie : 1 heure
        });

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
router.get('/admin', isAuthenticated, authenticateToken, async (req, res) => {

    const utilisateur = req.session.user

    try {
        // Connexion à la base de données MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Utilisateur');

        // Recherche l'utilisateur dans la base de données
        const user = await collection.findOne({ utilisateur: utilisateur.name });

        // Vérifie si l'utilisateur est un administrateur
        const isAdmin = user.role === 'admin';

        // Ferme la connexion à la base de données
        await client.close();

        // Renvoie le résultat
        return res.status(200).send({
            success: true,
            isAdmin,
            utilisateur
        });
    } catch (error) {
        console.error('Erreur serveur:', error);
        return res.status(500).send({ success: false, message: "Erreur serveur" });
    }

});

//Route pour récupérer tout les utilisateurs
router.get('/users', isAuthenticated, authenticateToken, async (req, res) => {
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
router.post('/add_users', isAuthenticated, authenticateToken, async (req, res) => {
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
router.get('/user_update', isAuthenticated, authenticateToken, async (req, res) => {
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
router.delete('/delete_user', isAuthenticated, authenticateToken, async (req, res) => {
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
router.put('/update_profil', isAuthenticated, authenticateToken, async (req, res) => {
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
router.get('/generate_excel_report', isAuthenticated, authenticateToken, async (req, res) => {
    const { enquete, StartDate, EndDate } = req.query;

    try {
        // Connexion à la base de données MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection(enquete);

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

router.get('/generate_excel_report_global', isAuthenticated, authenticateToken, async (req, res) => {
    const { enquete } = req.query;

    try {
        // Connexion à la base de données MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection(enquete);

        // Recherche des données dans la base de données
        const users = await collection.find({}, { projection: { _id: 0 } }).toArray();

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
router.get('/generate_csv_report', isAuthenticated, authenticateToken, async (req, res) => {
    const { enquete, StartDate, EndDate } = req.query;

    try {
        // Connexion à la base de données MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection(enquete);

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

router.get('/generate_csv_report_global', isAuthenticated, authenticateToken, async (req, res) => {
    const { enquete } = req.query;

    try {
        // Connexion à la base de données MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection(enquete);

        // Recherche des données dans la base de données
        const users = await collection.find({}, { projection: { _id: 0 } }).toArray();

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

// Route pour recupérer le nombre d'enquete en agence
router.get('/enquete_agence', isAuthenticated, authenticateToken, async (req, res) => {
    const { StartDate, EndDate } = req.query;
    try {
        // Connexion à MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Enquete_Agence');

        // Construire la requête de filtrage
        const query = {};
        if (StartDate && EndDate) {
            query.date = {
                $gte: new Date(StartDate),
                $lte: new Date(EndDate),
            };
        }

        // Compter le nombre total d'enquêtes
        const totalEnquetes = await collection.countDocuments(query);

        // Fermer la connexion à la base de données
        await client.close();

        // Retourner le résultat au client
        res.status(200).send({ success: true, total: totalEnquetes });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).send({ success: false, message: "Erreur serveur lors de la récupération des enquêtes" });
    }
})

// Route pour recupérer le nombre d'enquete en agence
router.get('/enquete_agence_global', isAuthenticated, authenticateToken, async (req, res) => {
    try {
        // Connexion à MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Enquete_Agence');

        // Compter le nombre total d'enquêtes
        const totalEnquetes = await collection.countDocuments();

        // Fermer la connexion à la base de données
        await client.close();

        // Retourner le résultat au client
        res.status(200).send({ success: true, total: totalEnquetes });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).send({ success: false, message: "Erreur serveur lors de la récupération des enquêtes" });
    }
})

// Route pour recupérer le nombre d'enquete de satisfaction
router.get('/enquete_satisfaction', isAuthenticated, authenticateToken, async (req, res) => {
    const { StartDate, EndDate } = req.query;
    try {
        // Connexion à MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Enquete_Satisfaction');

        // Construire la requête de filtrage
        const query = {};
        if (StartDate && EndDate) {
            query.date = {
                $gte: new Date(StartDate),
                $lte: new Date(EndDate),
            };
        }

        // Compter le nombre total d'enquêtes
        const totalEnquetes = await collection.countDocuments(query);

        // Fermer la connexion à la base de données
        await client.close();

        // Retourner le résultat au client
        res.status(200).send({ success: true, total: totalEnquetes });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).send({ success: false, message: "Erreur serveur lors de la récupération des enquêtes" });
    }
})

// Route pour recupérer le nombre d'enquete de satisfaction
router.get('/enquete_satisfaction_global', isAuthenticated, authenticateToken, async (req, res) => {
    try {
        // Connexion à MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Enquete_Satisfaction');

        // Compter le nombre total d'enquêtes
        const totalEnquetes = await collection.countDocuments();

        // Fermer la connexion à la base de données
        await client.close();

        // Retourner le résultat au client
        res.status(200).send({ success: true, total: totalEnquetes });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).send({ success: false, message: "Erreur serveur lors de la récupération des enquêtes" });
    }
})

// Route pour recupérer le nombre d'enquete corporate
router.get('/enquete_entreprise', isAuthenticated, authenticateToken, async (req, res) => {
    const { StartDate, EndDate } = req.query;
    try {
        // Connexion à MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Enquete_Entreprise');

        // Construire la requête de filtrage
        const query = {};
        if (StartDate && EndDate) {
            query.date = {
                $gte: new Date(StartDate),
                $lte: new Date(EndDate),
            };
        }

        // Compter le nombre total d'enquêtes
        const totalEnquetes = await collection.countDocuments(query);

        // Fermer la connexion à la base de données
        await client.close();

        // Retourner le résultat au client
        res.status(200).send({ success: true, total: totalEnquetes });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).send({ success: false, message: "Erreur serveur lors de la récupération des enquêtes" });
    }
})

// Route pour recupérer le nombre d'enquete corporate
router.get('/enquete_entreprise_global', isAuthenticated, authenticateToken, async (req, res) => {
    try {
        // Connexion à MongoDB
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('EnqueteAfrijet-db');
        const collection = db.collection('Enquete_Entreprise');

        // Compter le nombre total d'enquêtes
        const totalEnquetes = await collection.countDocuments();

        // Fermer la connexion à la base de données
        await client.close();

        // Retourner le résultat au client
        res.status(200).send({ success: true, total: totalEnquetes });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).send({ success: false, message: "Erreur serveur lors de la récupération des enquêtes" });
    }
})

router.post('/logout', isAuthenticated, (req, res) => {

    // Supprimer le cookie de session
    res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: false // Mettez `true` si vous utilisez HTTPS
    });
    // Supprimer le cookie de session
    res.clearCookie('auth_token', {
        path: '/',
        httpOnly: true,
        secure: false // Mettez `true` si vous utilisez HTTPS
    });

    return res.status(200).send({ success: true, message: "Déconnexion réussie" });

});

//Renouvellement de la session utilisateur
router.post('/renew', isAuthenticated, authenticateToken, (req, res) => {
    const token = req.cookies.auth_token; // Récupérer le token depuis les cookies

    if (!token) {
        return res.status(401).send({ success: false, message: 'Utilisateur non authentifié.' });
    }

    try {
        // Vérification et décodage du token
        const utilisateur = jwt.verify(token, SECRET_KEY);

        // Renouveler le token
        const newToken = jwt.sign(
            { id: utilisateur.id, user: utilisateur.user, role: utilisateur.role },
            SECRET_KEY,
            { expiresIn: '1h' } // Expiration : 1 heure
        );

        // Mettre à jour la session
        req.session.user = { id: utilisateur._id, name: utilisateur.utilisateur, role: utilisateur.role };
        req.session.save()

        // Définir le nouveau cookie
        res.cookie('auth_token', newToken, {
            httpOnly: true,
            secure: true, // Mettre à true en production si HTTPS est utilisé
            sameSite: 'Strict',
            maxAge: 3600000, // Durée de vie : 1 heure
        });

        return res.status(200).send({
            success: true,
            message: 'Token et session renouvelés avec succès.',
            token: newToken,
        });
    } catch (err) {
        console.error('Erreur lors du renouvellement du token:', err);
        return res.status(403).send({ success: false, message: 'Token invalide ou expiré.' });
    }
})

export default router;