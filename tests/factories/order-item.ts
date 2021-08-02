import { OrderItem } from "@/entities/order";
import faker from "faker";
import { Product } from "@/entities/product";
import { ProductFactory } from "./product";

export class OrderItemFactory {
  public build(params: OrderItemFactory.Params = {}): OrderItem {
    const data = {
      product: new ProductFactory().build(),
      amount: faker.datatype.number({ min: 1, max: 10 }),
      ...params,
    };
    return new OrderItem(data.product, data.amount);
  }

  public buildMany(length: number): OrderItem[] {
    return Array.from({ length }, () => this.build());
  }
}

export namespace OrderItemFactory {
  export type Params = Partial<{
    product: Product;
    amount: number;
  }>;
}
