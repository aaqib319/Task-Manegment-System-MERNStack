import express from 'express';
import { login, register, verify } from './authController.js';
import authMiddleware from './authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify', authMiddleware, verify);

export default router;