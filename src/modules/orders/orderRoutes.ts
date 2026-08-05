import { Router } from 'express';

import { asyncHandler } from '../../middleware/asyncHandler.js';
import { OrderController } from './orderController.js';
import { OrderRepository } from './orderRepository.js';
import { OrderService } from './orderService.js';

const router = Router();
const repository = new OrderRepository();
const service = new OrderService(repository);
const controller = new OrderController(service);

router.get('/orders', asyncHandler(controller.listOrders));
router.get('/orders/:id', asyncHandler(controller.getOrderById));
router.post('/orders', asyncHandler(controller.createOrder));
router.delete('/orders/:id', asyncHandler(controller.deleteOrder));

export default router;