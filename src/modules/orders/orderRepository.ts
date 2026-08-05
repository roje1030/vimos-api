import { prisma } from '../../config/prisma.js';
import type { Order as PrismaOrder, OrderLineItem as PrismaLineItem } from '../../generated/prisma/client.js';

export interface LineItemInput {
  partNumber: string;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  eta?: Date | null;
}

export interface OrderRecord {
  id: string;
  type: string;
  customerOrVendor: string;
  orderDate: Date;
  status: string;
  assignedTo: string | null;
  department: string | null;
  totalAmount: number;
  syncStatus: string;
  lastSync: Date | null;
  supplierRisk: string | null;
  slaThresholdDays: number | null;
  createdAt: Date;
  lineItems: {
    id: string;
    partNumber: string;
    description: string | null;
    quantity: number;
    unitPrice: number;
    eta: Date | null;
  }[];
}

type OrderWithLineItems = PrismaOrder & { lineItems: PrismaLineItem[] };

function toOrderRecord(order: OrderWithLineItems): OrderRecord {
  return {
    id: order.id,
    type: order.type,
    customerOrVendor: order.customerOrVendor,
    orderDate: order.orderDate,
    status: order.status,
    assignedTo: order.assignedTo,
    department: order.department,
    totalAmount: Number(order.totalAmount),
    syncStatus: order.syncStatus,
    lastSync: order.lastSync,
    supplierRisk: order.supplierRisk,
    slaThresholdDays: order.slaThresholdDays,
    createdAt: order.createdAt,
    lineItems: order.lineItems.map((item) => ({
      id: item.id,
      partNumber: item.partNumber,
      description: item.description,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      eta: item.eta,
    })),
  };
}

export class OrderRepository {
  async findAll(): Promise<OrderRecord[]> {
    const orders = await prisma.order.findMany({
      include: { lineItems: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(toOrderRecord);
  }

  async findById(id: string): Promise<OrderRecord | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { lineItems: true },
    });
    return order ? toOrderRecord(order) : null;
  }

  async create(data: {
    type: string;
    customerOrVendor: string;
    orderDate: Date;
    department?: string | null;
    assignedTo?: string | null;
    lineItems: LineItemInput[];
  }): Promise<OrderRecord> {
    const totalAmount = data.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const order = await prisma.order.create({
      data: {
        id: `${data.type}-${Date.now()}`,
        type: data.type as PrismaOrder['type'],
        customerOrVendor: data.customerOrVendor,
        orderDate: data.orderDate,
        department: data.department ?? null,
        assignedTo: data.assignedTo ?? null,
        totalAmount,
        lineItems: {
          create: data.lineItems.map((item) => ({
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            partNumber: item.partNumber,
            description: item.description ?? null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            eta: item.eta ?? null,
          })),
        },
      },
      include: { lineItems: true },
    });

    return toOrderRecord(order);
  }

  async delete(id: string): Promise<void> {
    await prisma.order.delete({ where: { id } }).catch(() => undefined);
  }
}