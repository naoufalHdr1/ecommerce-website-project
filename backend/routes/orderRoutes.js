// routes/orderRoutes.js

import express from 'express';
import OrderController from '../controllers/orderController.js';
import { verifyToken, checkAdmin, handleAuthAndSession } from '../middleware/auth.js';

const router = express.Router();

// Private Routes
router.get('/', verifyToken, checkAdmin, OrderController.fetchAllOrders);
router.post('/', handleAuthAndSession, OrderController.createOrder);
router.put('/:id', verifyToken, checkAdmin, OrderController.updateOrder);
router.delete('/:id', verifyToken, checkAdmin, OrderController.deleteOrder);

export default router;

