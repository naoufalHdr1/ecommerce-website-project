// routes/cartRoutes.js

import express from 'express';
import { generateSessionId } from '../middleware/sessionIdGenerator.js';
import CartController from '../controllers/cartController.js';

const router = express.Router();

// Public
router.post('/', generateSessionId, CartController.addToCart);

export default router;
