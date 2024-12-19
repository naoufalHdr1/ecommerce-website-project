// routes/productRoutes.js

import express from 'express';
import ProductsController from '../controllers/ProductsController.js';
import { verifyToken, checkAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/',  ProductsController.getAllProducts);
router.get('/:id', ProductsController.getProduct);

// Admin Only
router.post('/', verifyToken, checkAdmin, ProductsController.createProduct);
router.put('/:id', verifyToken, checkAdmin, ProductsController.updateProduct);
router.delete('/:id', verifyToken, checkAdmin, ProductsController.deleteProduct);

export default router;
