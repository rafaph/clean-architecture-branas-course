import { Product } from "@/entities/product";

export class OrderItem {
  public product: Product;
  public quantity: number;

  public constructor({ product, quantity }: OrderItem.ConstructorParams) {
    this.product = product;
    this.quantity = quantity;
  }

  public get total(): number {
    return this.product.price * this.quantity;
  }
}

export namespace OrderItem {
  export type ConstructorParams = {
    product: Product;
    quantity: number;
  };
}
