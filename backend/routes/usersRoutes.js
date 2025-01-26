// routes/usersRoutes.js

import express from 'express';
import UsersController from '../controllers/UsersController.js';
import { verifyToken, checkAdmin, handleAuthAndSession } from '../middleware/auth.js';

const router = express.Router();

// Define routes for user operations (Private)
//router.get('/', verifyToken, checkAdmin, UsersController.findAllUser);
router.get('/', UsersController.findUserByName);
router.get('/find-user', handleAuthAndSession, UsersController.findByToken);
router.get('/:id', verifyToken, checkAdmin, UsersController.findUser);
router.post('/', verifyToken, checkAdmin, UsersController.createUser);
router.put('/:id', verifyToken, checkAdmin, UsersController.updateUser);
router.delete('/:id', verifyToken, checkAdmin, UsersController.deleteUser);

export default router;

