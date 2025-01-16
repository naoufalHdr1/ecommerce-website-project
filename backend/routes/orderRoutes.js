// routes/orderRoutes.js

import express from 'express';
import OrderController from '../controllers/orderController.js';
import { verifyToken, checkAdmin } from '../middleware/auth.js';

const router = express.Router();

// Private Routes
router.get('/', verifyToken, checkAdmin, OrderController.createOrder);

export default router;

