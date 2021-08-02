import { Order, OrderItem } from "@/entities/order";
import Decimal from "decimal.js";
import { DiscountCalculator } from "@/services/discount-calculator";
import { OrdersRepository } from "@/repositories/orders-repository";
import { Customer } from "@/entities/customer";
import { CpfValidator } from "@/services/cpf-validator";
import { Product } from "@/entities/product";

export class PlaceOrder {
  public constructor(
    private discountCalculator: DiscountCalculator,
    private cpfValidator: CpfValidator,
    private repository: OrdersRepository,
  ) {}

  public calculateTotal(order: Order): Decimal {
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

    return total;
  }

  private getCustomer(cpf: string): Customer {
    return new Customer(cpf);
  }

  private getProduct(product: { description: string; price: number }) {
    return new Product(product.description, new Decimal(product.price));
  }

  private getOrderItem(orderItem: { product: Product; amount: number }) {
    return new OrderItem(orderItem.product, orderItem.amount);
  }

  private validate(input: PlaceOrder.Input): void {
    if (!this.cpfValidator.validate(input.cpf)) {
      throw new Error("CPF invalid!");
    }
  }

  public execute(input: PlaceOrder.Input): Order {
    this.validate(input);

    const customer = this.getCustomer(input.cpf);
    const order = new Order(customer);

    if (input.discountCoupon) {
      order.discountCoupon = input.discountCoupon;
    }

    for (const item of input.items) {
      const product = this.getProduct(item.product);
      const orderItem = this.getOrderItem({
        product,
        amount: item.amount,
      });
      order.addItem(orderItem);
    }

    order.total = this.calculateTotal(order);
    this.repository.addOrder(order);

    return order;
  }
}

export namespace PlaceOrder {
  export type Product = {
    description: string;
    price: number;
  };

  export type OrderItem = {
    product: Product;
    amount: number;
  };

  export type Input = {
    cpf: string;
    items: OrderItem[];
    discountCoupon?: string;
  };
}
