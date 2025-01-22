import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dbClient from './config/db.js';
import usersRoutes from './routes/usersRoutes.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import subcategoryRoutes from './routes/subcategoryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'uuid';

const { v4: uuidv4 } = pkg;
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 }
}));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dbClient.connect(process.env.MONGO_URI);

// Routes
app.use('/users', usersRoutes);
app.use('/', authRoutes);
app.use('/', uploadRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/subcategories', subcategoryRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);

// Experimental route to set a cookie
app.get('/cookies', (req, res) => {
  if (!req.session.sessionId) {
    req.session.sessionId = uuidv4(); // Assign a new session ID if not set
    res.send({ sessionId: req.session.sessionId, message: 'New session created' });
  } else {
    res.send({ sessionId: req.session.sessionId, message: 'Session exists' });
  }
});

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
