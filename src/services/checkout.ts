import { Order, OrderItem } from "@/entities/order";
import Decimal from "decimal.js";
import { DiscountCalculator } from "@/services/discount-calculator";
import { OrdersRepository } from "@/repositories/orders-repository";

export class CheckoutService {
  private order: Order;

  public constructor(
    private discountCalculator: DiscountCalculator,
    private repository: OrdersRepository,
  ) {
    this.order = new Order();
  }

  public calculateTotal(): Decimal {
    let total = new Decimal(0);

    for (const item of this.order.items) {
      total = total.plus(item.product.price.times(item.amount));
    }

    total = total.minus(
      this.discountCalculator.calculate(this.order.discountCoupon, total),
    );

    if (total.comparedTo(0) === -1) {
      total = new Decimal(0);
    }

    return total;
  }

  public addItem(item: OrderItem): void {
    this.order.items.push(item);
  }

  public addCoupon(discountCoupon: string): void {
    this.order.discountCoupon = discountCoupon;
  }

  public checkout(): Order {
    this.order.total = this.calculateTotal();
    this.repository.addOrder(this.order);

    const order = this.order;

    this.order = new Order();

    return order;
  }
}
