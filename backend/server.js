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
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

const { v4: uuidv4 } = pkg;
const __filename = fileURLToPath(import.meta.url);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
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

app.get('/cookies', (req, res) => {
  try {
    if (req.cookies.sessionId) {
      return res.send('Session ID is: ' + req.cookies.sessionId);
    }
    return res.send('Session ID not found');
  } catch (err) {
    console.error(err);
  }
});

// Route that handles the payment intent.
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

// Handel graceful shutdown
process.on('SIGINT', async () => {
  await dbClient.disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
});

export default app;
