import { Order, OrderItem } from "@/entities/order";
import Decimal from "decimal.js";
import { DiscountCalculator } from "@/services/discount-calculator";
import { OrdersRepository } from "@/repositories/orders-repository";
import { Customer } from "@/entities/customer";
import { CpfValidator } from "@/services/cpf-validator";
import { Product } from "@/entities/product";
import { ShippingPriceCalculator } from "@/services/shipping-price-calculator";
import { ShippingInfo } from "@/entities/shipping-info";

export class PlaceOrder {
  public constructor(
    private discountCalculator: DiscountCalculator,
    private shippingPriceCalculator: ShippingPriceCalculator,
    private cpfValidator: CpfValidator,
    private repository: OrdersRepository,
  ) {}

  private calculateTotal(order: Order): Decimal {
    let total = new Decimal(0);

    for (const item of order.items) {
      total = total.plus(item.product.price.times(item.amount));
    }

    total = total.minus(
      this.discountCalculator.calculate(total, order.discountCoupon),
    );

    if (total.comparedTo(0) === -1) {
      total = new Decimal(0);
    }

    total = total.plus(order.shippingInfo?.value ?? 0);

    return total;
  }

  private calculateShippingInfo(items: OrderItem[], cep: string): ShippingInfo {
    const shippingInfo = new ShippingInfo(cep);
    shippingInfo.value = this.shippingPriceCalculator.calculate(
      items,
      shippingInfo.cepOrigin,
      shippingInfo.cepDestination,
    );
    return shippingInfo;
  }

  private getCustomer(cpf: string): Customer {
    return new Customer(cpf);
  }

  private getOrderItem(orderItem: { product: Product; amount: number }) {
    return new OrderItem(orderItem.product, orderItem.amount);
  }

  private validate(input: PlaceOrder.Input): void {
    if (!this.cpfValidator.validate(input.cpf)) {
      throw new Error("CPF invalid!");
    }
  }

  private getOrder(input: PlaceOrder.Input): Order {
    const customer = this.getCustomer(input.cpf);

    return new Order(customer);
  }

  public execute(input: PlaceOrder.Input): Order {
    this.validate(input);

    const order = this.getOrder(input);

    if (input.discountCoupon) {
      order.discountCoupon = input.discountCoupon;
    }

    for (const item of input.items) {
      const product = item.product;
      const orderItem = this.getOrderItem({
        product,
        amount: item.amount,
      });
      order.addItem(orderItem);
    }

    order.shippingInfo = this.calculateShippingInfo(order.items, input.cep);
    order.total = this.calculateTotal(order);

    this.repository.addOrder(order);

    return order;
  }
}

export namespace PlaceOrder {
  export type OrderItem = {
    product: Product;
    amount: number;
  };

  export type Input = {
    cpf: string;
    items: OrderItem[];
    cep: string;
    discountCoupon?: string;
  };
}
