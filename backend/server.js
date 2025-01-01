import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbClient from './config/db.js';
import usersRoutes from './routes/usersRoutes.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import subcategoryRoutes from './routes/subcategoryRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dbClient.connect(process.env.MONGO_URI);

// Routes
app.use('/users', usersRoutes);
app.use('/', authRoutes);
app.use('/', uploadRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/subcategories', subcategoryRoutes);

// Handel graceful shutdown
process.on('SIGINT', async () => {
  await dbClient.disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
