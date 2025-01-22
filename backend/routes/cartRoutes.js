// routes/cartRoutes.js

import express from 'express';
import CartController from '../controllers/cartController.js';
import { generateSessionId } from '../middleware/sessionIdGenerator.js';

const router = express.Router();

// Public
router.get('/', generateSessionId, CartController.getCartItems);
router.post('/', generateSessionId, CartController.addToCart);

export default router;
