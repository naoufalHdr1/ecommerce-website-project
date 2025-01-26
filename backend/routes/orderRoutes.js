// routes/orderRoutes.js

import express from 'express';
import OrderController from '../controllers/orderController.js';
import { verifyToken, checkAdmin, handleAuthAndSession } from '../middleware/auth.js';

const router = express.Router();

// Private Routes (for admins)
router.get('/', verifyToken, checkAdmin, OrderController.fetchAllOrders);

// Public Routes
router.get('/my-orders', handleAuthAndSession, OrderController.fetchOrdersByUser);
router.post('/', handleAuthAndSession, OrderController.createOrder);
router.put('/:id', verifyToken, checkAdmin, OrderController.updateOrder);
router.delete('/:id', verifyToken, checkAdmin, OrderController.deleteOrder);

export default router;

