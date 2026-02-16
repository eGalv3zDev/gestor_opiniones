import { Router } from 'express';
import { createPost, updatePost, deletePost } from './post.controller.js';
import { authMiddleware } from '../../middlewares/auth.js';

const router = Router();

router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
