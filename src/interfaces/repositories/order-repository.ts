import { Order } from "@/entities/order";

export abstract class OrderRepository {
  public abstract add(order: Order): void;
  public abstract get(id: number): Order | undefined;
}
