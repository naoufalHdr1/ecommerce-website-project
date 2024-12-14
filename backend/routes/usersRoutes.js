// routes/usersRoutes.js

import express from 'express';
import UsersController from '../controllers/UsersController.js';

const router = express.Router();

// Define routes for user operations
router.post('/create', UsersController.createUser);
router.get('/find/:id', UsersController.findUser);
router.put('/update/:id', UsersController.updateUser);
router.delete('/delete/:id', UsersController.deleteUser);

export default router;

