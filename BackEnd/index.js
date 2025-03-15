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


const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173', // Local pour développement
    'https://secure.enquete-afrijet-flygabon.com', // Nom de domaine
];
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(session({
    secret: process.env.JWT_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {httpOnly: true, secure: false, sameSite: 'Strict', maxAge: 3600000 } 
}));

app.use(express.json());
app.use(bodyParser.json());

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

app.use('/api', routesClient); 
app.use('/admin', routesAdmin); 

connectToDatabase();

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});
