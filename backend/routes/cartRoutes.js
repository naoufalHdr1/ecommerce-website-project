// routes/cartRoutes.js

import express from 'express';
import CartController from '../controllers/cartController.js';
import { handleAuthAndSession } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', handleAuthAndSession, CartController.getCartItems);
router.post('/', handleAuthAndSession, CartController.addToCart);
router.put('/', handleAuthAndSession, CartController.updateCart);

export default router;
