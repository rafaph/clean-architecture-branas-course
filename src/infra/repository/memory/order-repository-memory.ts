import { Order } from "@/domain/entity/order";
import { OrderRepository } from "@/domain/repository/order-repository";

export class OrderRepositoryMemory implements OrderRepository {
  private readonly orders: Order[];

  public constructor() {
    this.orders = [];
  }

  public add(order: Order): void {
    order.id = this.orders.length + 1;
    this.orders.push(order);
  }

  public get(id: number): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }
}
