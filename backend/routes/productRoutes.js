// routes/productRoutes.js

import express from 'express';
import ProductsController from '../controllers/ProductsController.js';

const router = express.Router();

// Public
router.get('/',  ProductsController.getAllProducts);
router.get('/:id', ProductsController.getProduct);

// Admin Only
router.post('/', verifyToken, checkAdmin, ProductsController.createProduct);

export default router;
