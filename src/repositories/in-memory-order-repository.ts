import { Order } from "@/entities/order";
import { OrderRepository } from "@/interfaces/repositories/order-repository";

export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders: Order[];

  public constructor() {
    this.orders = [];
  }

  public addOrder(order: Order): void {
    order.id = this.orders.length + 1;
    this.orders.push(order);
  }
}
