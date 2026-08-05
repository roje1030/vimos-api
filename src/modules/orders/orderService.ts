import { OrderRepository, type OrderRecord, type LineItemInput } from './orderRepository.js';

export class OrderService {
  constructor(private readonly repository: OrderRepository) {}

  async listOrders(): Promise<OrderRecord[]> {
    return this.repository.findAll();
  }

  async getOrderById(id: string): Promise<OrderRecord | null> {
    return this.repository.findById(id);
  }

  async createOrder(input: {
    type: string;
    customerOrVendor: string;
    orderDate: Date;
    department?: string | null;
    assignedTo?: string | null;
    lineItems: LineItemInput[];
  }): Promise<OrderRecord> {
    return this.repository.create(input);
  }

  async deleteOrder(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}