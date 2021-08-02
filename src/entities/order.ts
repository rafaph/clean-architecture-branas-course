import { Product } from "@/entities/product";
import { Customer } from "@/entities/customer";
import Decimal from "decimal.js";
import { ShippingInfo } from "@/entities/shipping-info";

export class OrderItem {
  public constructor(public product: Product, public amount: number) {}
}

export class Order {
  public constructor(
    public customer: Customer,
    public items: OrderItem[] = [],
    public total: Decimal = new Decimal(0),
    public shippingInfo?: ShippingInfo,
    public discountCoupon?: string,
  ) {}

  public addItem(item: OrderItem): void {
    this.items.push(item);
  }
}
