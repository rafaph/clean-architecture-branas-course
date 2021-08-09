import { Order } from "@/entities/order";

export abstract class OrderRepository {
  public abstract addOrder(order: Order): void;
}
