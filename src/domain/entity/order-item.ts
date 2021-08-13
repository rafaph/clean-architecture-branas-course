export class OrderItem {
  public productId: string;
  public price: number;
  public quantity: number;

  public constructor({
    productId,
    price,
    quantity,
  }: OrderItem.ConstructorParams) {
    this.productId = productId;
    this.price = price;
    this.quantity = quantity;
  }

  public get total(): number {
    return this.price * this.quantity;
  }
}

export namespace OrderItem {
  export type ConstructorParams = {
    productId: string;
    price: number;
    quantity: number;
  };
}
