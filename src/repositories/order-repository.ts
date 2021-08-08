import { Order } from "@/entities/order";

export class OrderRepository {
  private readonly orders: Order[];

  public constructor() {
    this.orders = [];
  }

  public addOrder(order: Order): void {
    this.orders.push(order);
  }
}
