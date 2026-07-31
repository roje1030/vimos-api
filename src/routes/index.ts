import { Router } from 'express';

import { loginController, logoutController, meController } from '../controllers/authController.js';
import { getHealthStatus, getWelcomeMessage } from '../controllers/healthController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', asyncHandler(getWelcomeMessage));
router.get('/health', asyncHandler(getHealthStatus));
router.post('/auth/login', asyncHandler(loginController));
router.post('/auth/logout', authMiddleware, asyncHandler(logoutController));
router.get('/auth/me', authMiddleware, asyncHandler(meController));

export default router;
