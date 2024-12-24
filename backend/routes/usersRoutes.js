// routes/usersRoutes.js

import express from 'express';
import UsersController from '../controllers/UsersController.js';
import { verifyToken, checkAdmin } from '../middleware/auth.js';

const router = express.Router();

// Define routes for user operations (Private)
router.get('/:id', verifyToken, checkAdmin, UsersController.findUser);
router.post('/', verifyToken, checkAdmin, UsersController.createUser);
router.put('/:id', verifyToken, checkAdmin, UsersController.updateUser);
router.delete('/:id', verifyToken, checkAdmin, UsersController.deleteUser);

export default router;

