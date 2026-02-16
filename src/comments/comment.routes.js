import { Router } from 'express';
import { createComment, updateComment, deleteComment } from './comment.controller.js';
import { authMiddleware } from '../../middlewares/auth.js';

const router = Router();

router.post('/', authMiddleware, createComment);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);

export default router;
