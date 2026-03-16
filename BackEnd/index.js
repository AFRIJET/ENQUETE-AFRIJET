import { MongoClient } from 'mongodb';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routesClient from './routes/routesClient.js'
import routesAdmin from './routes/routesAdmin.js'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session';
import promClient from 'prom-client'

dotenv.config();

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173', // Local pour développement
    'https://secure.enquete-afrijet-flygabon.com', // Nom de domaine
    'https://enquete-afrijet-flygabon.netlify.app' // UAT sur Netlify
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS Policy: Origin not allowed'), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(session({
    secret: process.env.JWT_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {httpOnly: true, secure: true, sameSite: 'none', maxAge: 3600000 } 
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

promClient.collectDefaultMetrics({ timeout: 5000 });

// Métriques
const pageLoadTime = new promClient.Gauge({
    name: 'page_load_time',
    help: 'Temps de chargement de la page en millisecondes',
})

const requestTime = new promClient.Gauge({
    name: 'request_time',
    help: 'Temps d\'éxécution des requetes en millisecondes',
    labelNames: ['url'],
})

const concurrentRequests = new promClient.Gauge({
    name: 'concurrent_requests_time',
    help: 'Scalabilité des requetes',
})

const errorCount = new promClient.Counter({
    name: 'erreur_javascript',
    help: 'Nombre total d\'erreurs JavaScript',
})

const httpRequestCounter = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Nombre Total de requetes HTTP',
    labelNames: ['method', 'route', 'status'],
});

const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Durée total d\'une requete HTTP',
    labelNames: ['method', 'route'],
    buckets: [0.1, 0.5, 1, 2, 5],
});

const metricsMiddleware = (req, res, next) => {
    const end = httpRequestDuration.startTimer();
    res.on('finish', () => {
        httpRequestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status: res.statusCode,
        });
        end({ method: req.method, route: req.route ? req.route.path : req.path });
    });
    next();
};

app.use(metricsMiddleware);

app.post('/metrics', express.json(), (req, res) => {
    try {
        const {
            pageLoadTime: plTime,
            requestTime: reqTime,
            concurrentRequests: concReq,
            countErrors: errCount,
        } = req.body

        if (typeof plTime !== 'number' || !Array.isArray(reqTime) ||
            typeof concReq !== 'number' || typeof errCount !== 'number') {
            res.status(400).send('Données métriques invalides')
        }
        pageLoadTime.set(plTime);
        reqTime.forEach(({ url, time }) => {
            requestTime.set({ url }, time);
        })
        concurrentRequests.set(concReq);
        errorCount.inc(errCount);
        res.status(200).send('Métriques mises à jour');
    } catch (error) {
        res.status(500).send('Erreur interne du serveur')
    }

})

app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', promClient.register.contentType);
        res.end(await promClient.register.metrics());
    } catch (error) {
        res.status(500).send('Erreur interne au serveur')
    }

});

app.use('/api', routesClient); 
app.use('/admin', routesAdmin); 

connectToDatabase();

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port : ${port}`);
});
