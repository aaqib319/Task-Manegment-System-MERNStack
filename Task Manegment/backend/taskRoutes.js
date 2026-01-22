import express from 'express';
import {
    getAllTasks,
    getTasksByUserId,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
} from './taskController.js';
import authMiddleware from './authMiddleware.js';

const router = express.Router();

// All these routes are protected by the authMiddleware
router.use(authMiddleware);

router.route('/')
    .get(getAllTasks)
    .post(createTask);

router.route('/user/:userId').get(getTasksByUserId);

router.route('/:id')
    .delete(deleteTask)
    .patch(updateTask);

router.route('/:id/status')
    .patch(updateTaskStatus);

export default router;
