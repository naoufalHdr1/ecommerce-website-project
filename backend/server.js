import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbClient from './config/db.js';

// Load environment variables
dotenv.config();

const app = express();

//Middleware
app.use(express.json());
app.use(cors());

dbClient.connect(process.env.MONGO_URI);

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Handel graceful shutdown
process.on('SIGINT', async () => {
  await dbClient.disconnect();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
