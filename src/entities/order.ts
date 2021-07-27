import { Product } from "@/entities/product";
import Decimal from "decimal.js";

export class OrderItem {
  public constructor(public product: Product, public amount: number) {}
}

export class Order {
  public constructor(
    public items: OrderItem[] = [],
    public discountCoupon: string = "",
    public total: Decimal = new Decimal(0),
  ) {}
}
