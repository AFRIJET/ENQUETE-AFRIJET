import express from 'express';
import connectToDatabase from './index.js';

const app = express();
app.use(express.json());

app.get('/api/data', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('EnqueteAfrijet-db');
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});