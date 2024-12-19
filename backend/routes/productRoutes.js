// routes/productRoutes.js

import express from 'express';
import ProductsController from '../controllers/ProductsController.js';

const router = express.Router();

router.get('/', ProductsController.getProducts);
router.get('/:id', ProductsController.getProductById);
router.post('/create', ProductsController.createProduct);

export default router;