import type { Request, Response } from 'express';

import { OrderService } from './orderService.js';
import type { LineItemInput } from './orderRepository.js';

export class OrderController {
  constructor(private readonly service: OrderService) {}

  listOrders = async (_req: Request, res: Response): Promise<void> => {
    const orders = await this.service.listOrders();
    res.status(200).json(orders);
  };

  getOrderById = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Order id is required' });
      return;
    }

    const order = await this.service.getOrderById(id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.status(200).json(order);
  };

  createOrder = async (req: Request, res: Response): Promise<void> => {
    const { type, customerOrVendor, orderDate, department, assignedTo, lineItems } = req.body as {
      type?: string;
      customerOrVendor?: string;
      orderDate?: string;
      department?: string | null;
      assignedTo?: string | null;
      lineItems?: LineItemInput[];
    };

    if (!type || !customerOrVendor || !orderDate || !lineItems || lineItems.length === 0) {
      res.status(400).json({ error: 'type, customerOrVendor, orderDate, and at least one line item are required' });
      return;
    }

    const order = await this.service.createOrder({
      type,
      customerOrVendor,
      orderDate: new Date(orderDate),
      department,
      assignedTo,
      lineItems,
    });

    res.status(201).json(order);
  };

  updateLineItemEta = async (req: Request, res: Response): Promise<void> => {
    const itemId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
    if (!itemId) {
      res.status(400).json({ error: 'Line item id is required' });
      return;
    }

    const { newEta, remarks, updatedBy } = req.body as {
      newEta?: string;
      remarks?: string | null;
      updatedBy?: string | null;
    };

    if (!newEta) {
      res.status(400).json({ error: 'newEta is required' });
      return;
    }

    const order = await this.service.updateLineItemEta(itemId, {
      newEta: new Date(newEta),
      remarks,
      updatedBy,
    });

    if (!order) {
      res.status(404).json({ error: 'Line item not found' });
      return;
    }

    res.status(200).json(order);
  };

  deleteOrder = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Order id is required' });
      return;
    }

    await this.service.deleteOrder(id);
    res.status(204).send();
  };
}