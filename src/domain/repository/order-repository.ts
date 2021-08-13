import { Order } from "@/domain/entity/order";

export abstract class OrderRepository {
  public abstract add(order: Order): void;
  public abstract get(id: number): Order | undefined;
}
