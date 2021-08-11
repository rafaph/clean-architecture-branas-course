import { OrderItem } from "@/entities/order-item";
import { Customer } from "@/entities/customer";
import { Coupon } from "@/entities/coupon";
import { Product } from "@/entities/product";

export class Order {
  public customer: Customer;
  public items: OrderItem[];
  public freight: number;
  public coupon?: Coupon;

  public constructor({ customer }: Order.ConstructorParams) {
    this.customer = customer;
    this.items = [];
    this.freight = 0;
  }

  public addCoupon(coupon: Coupon): void {
    if (!coupon.isExpired) {
      this.coupon = coupon;
    }
  }

  public addItem({ productId, price, quantity }: Order.Item): void {
    this.items.push(
      new OrderItem({
        productId,
        price,
        quantity,
      }),
    );
  }

  public get total(): number {
    let total = 0;

    for (const orderItem of this.items) {
      total += orderItem.total;
    }

    if (this.coupon) {
      total -= total * (this.coupon.percentage / 100);
    }

    total += this.freight;

    return total;
  }
}

export namespace Order {
  export type ConstructorParams = {
    customer: Customer;
    coupon?: Coupon;
  };

  export type Item = {
    productId: string;
    price: number;
    quantity: number;
  };
}
