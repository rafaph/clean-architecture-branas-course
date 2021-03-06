import { OrderItem } from "@/domain/entity/order-item";
import { Customer } from "@/domain/entity/customer";
import { Coupon } from "@/domain/entity/coupon";

export class Order {
  public id: number;
  public customer: Customer;
  public items: OrderItem[];
  public freight: number;
  public coupon?: Coupon;
  public date: Date;
  public zipCode: string;

  public constructor({ customer, zipCode }: Order.ConstructorParams) {
    this.id = -1;
    this.customer = customer;
    this.items = [];
    this.freight = 0;
    this.date = new Date();
    this.zipCode = zipCode;
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

  public get code(): string {
    const year = this.date.getFullYear();
    const seq = `${this.id}`.padStart(8, "0");

    return `${year}${seq}`;
  }

  public get discount(): number {
    if (!this.coupon) {
      return 0;
    }
    const totalWithoutFreight = this.total - this.freight;
    const totalWithoutDiscount =
      totalWithoutFreight / (1 - this.coupon.percentage / 100);

    return totalWithoutDiscount - totalWithoutFreight;
  }
}

export namespace Order {
  export type ConstructorParams = {
    customer: Customer;
    coupon?: Coupon;
    zipCode: string;
  };

  export type Item = {
    productId: string;
    price: number;
    quantity: number;
  };
}
