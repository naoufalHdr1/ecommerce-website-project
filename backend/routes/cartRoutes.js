// routes/cartRoutes.js

import express from 'express';
import CartController from '../controllers/cartController.js';

const router = express.Router();

// Public
router.get('/', CartController.getCartItems);
router.post('/', CartController.addToCart);

export default router;
