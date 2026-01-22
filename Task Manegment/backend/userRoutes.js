import express from 'express';
import { getAllUsers, createUser } from './userController.js';
import authMiddleware, { admin } from './authMiddleware.js';

const router = express.Router();

// All routes in this file are protected
router.use(authMiddleware);

router.route('/').get(getAllUsers);
router.route('/create').post(admin, createUser);

export default router;
