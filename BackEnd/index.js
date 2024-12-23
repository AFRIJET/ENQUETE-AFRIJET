import { MongoClient } from 'mongodb';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routesClient from './routes/routesClient.js'
import routesAdmin from './routes/routesAdmin.js'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session';

dotenv.config();

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 5000;

// Configuration CORS
// Configurez les origines autorisées
const allowedOrigins = [
    'http://localhost:5000',
    'http://localhost:5173', // Local pour développement
    'https://enquete-afrijet-flygabon.com', // Nom de domaine
];
app.use(cors({
    origin: allowedOrigins, // Remplacez par l'URL de votre frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
    credentials: true // Pour envoyer des cookies et des autorisations
}));

app.use(session({
    secret: process.env.JWT_SECRET,  // Clé secrète pour sécuriser les sessions
    resave: false,
    saveUninitialized: true,
    cookie: {httpOnly: true, secure: false, sameSite: 'Strict', maxAge: 3600000 } // Durée de vie du cookie de session (1h)
}));

app.use(express.json());
app.use(bodyParser.json()); // Permet de lire le corps des requêtes JSON

// Charger la chaîne de connexion MongoDB depuis .env
const url = process.env.MONGO_URL;
let db;

async function connectToDatabase() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        db = client.db('EnqueteAfrijet-db');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}


// Utilisation des routes
app.use('/api', routesClient); // Préfixez toutes les routes client par /api
app.use('/admin', routesAdmin); // Préfixez toutes les routes administrateur par /admin

connectToDatabase();

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});
