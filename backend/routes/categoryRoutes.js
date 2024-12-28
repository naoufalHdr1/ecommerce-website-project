// routes/categoryRoutes.js

import express from 'express';
import CategoriesController from '../controllers/CategoriesController.js';
import { verifyToken, checkAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', CategoriesController.getAll.bind(CategoriesController));
router.get('/:id', CategoriesController.getById.bind(CategoriesController));

// Admin Only
router.post('/', verifyToken, checkAdmin, CategoriesController.create.bind(CategoriesController));
router.put('/:id', verifyToken, checkAdmin, CategoriesController.update.bind(CategoriesController));
router.delete('/:id', verifyToken, checkAdmin, CategoriesController.delete.bind(CategoriesController));

export default router;
