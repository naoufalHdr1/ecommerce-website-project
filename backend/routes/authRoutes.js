// routes/usersRoutes.js

import express from 'express';
import AuthController from '../controllers/AuthController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Define routes for auth operations
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', verifyToken, AuthController.getCurrentUser);

export default router;