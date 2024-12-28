// routes/categoryRoutes.js

import express from 'express';
import SubcategoriesController from '../controllers/SubcategoriesController.js';
import { verifyToken, checkAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', SubcategoriesController.getAll.bind(SubcategoriesController));
router.get('/:id', SubcategoriesController.getById.bind(SubcategoriesController));

// Admin Only
router.post('/', verifyToken, checkAdmin, SubcategoriesController.create.bind(SubcategoriesController));
router.put('/:id', verifyToken, checkAdmin, SubcategoriesController.update.bind(SubcategoriesController));
router.delete('/:id', verifyToken, checkAdmin, SubcategoriesController.delete.bind(SubcategoriesController));

export default router;
