// routes/productRoutes.js

import express from 'express';
import ProductsController from '../controllers/ProductsController.js';
import { verifyToken, checkAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', ProductsController.getAll.bind(ProductsController));
router.get('/:id', ProductsController.getById.bind(ProductsController));

// Admin Only
router.post('/', verifyToken, checkAdmin, ProductsController.create.bind(ProductsController));
router.put('/:id', verifyToken, checkAdmin, ProductsController.update.bind(ProductsController));
router.delete('/:id', verifyToken, checkAdmin, ProductsController.delete.bind(ProductsController));

export default router;
