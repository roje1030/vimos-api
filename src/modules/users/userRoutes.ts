import { Router } from 'express';

import { asyncHandler } from '../../middleware/asyncHandler.js';
import { UserController } from './userController.js';
import { UserRepository } from './userRepository.js';
import { UserService } from './userService.js';

const router = Router();
const repository = new UserRepository();
const service = new UserService(repository);
const controller = new UserController(service);

router.get('/users', asyncHandler(controller.listUsers));
router.get('/users/:id', asyncHandler(controller.getUserById));
router.post('/users', asyncHandler(controller.createUser));
router.put('/users/:id', asyncHandler(controller.updateUser));
router.delete('/users/:id', asyncHandler(controller.deleteUser));

export default router;
