import { Order } from "@/entities/order";
import { Customer } from "@/entities/customer";
import { CpfValidator } from "@/services/cpf-validator";
import { FreightCalculatorAPI } from "@/interfaces/freight-calculator-api";
import { ZipCodeDistanceCalculatorAPI } from "@/interfaces/zip-code-distance-calculator-api";
import { OrderRepository } from "@/interfaces/repositories/order-repository";
import { ProductRepository } from "@/interfaces/repositories/product-repository";
import { CouponRepository } from "@/interfaces/repositories/coupon-repository";

export class PlaceOrder {
  private readonly cpfValidator: CpfValidator;
  private readonly orderRepository: OrderRepository;
  private readonly zipCodeDistanceCalculator: ZipCodeDistanceCalculatorAPI;
  private readonly freightCalculator: FreightCalculatorAPI;
  private readonly productRepository: ProductRepository;
  private readonly couponRepository: CouponRepository;

  public constructor({
    cpfValidator,
    orderRepository,
    zipCodeDistanceCalculator,
    freightCalculator,
    productRepository,
    couponRepository,
  }: PlaceOrder.ConstructorParams) {
    this.cpfValidator = cpfValidator;
    this.orderRepository = orderRepository;
    this.zipCodeDistanceCalculator = zipCodeDistanceCalculator;
    this.freightCalculator = freightCalculator;
    this.productRepository = productRepository;
    this.couponRepository = couponRepository;
  }

  private validate(input: PlaceOrder.Input): void {
    if (!this.cpfValidator.validate(input.cpf)) {
      throw new Error("CPF invalid");
    }
  }

  public execute(input: PlaceOrder.Input): PlaceOrder.Output {
    this.validate(input);

    const customer = new Customer({ cpf: input.cpf });
    const order = new Order({
      customer,
      zipCode: input.zipCode,
    });
    const distance = this.zipCodeDistanceCalculator.calculate(
      input.zipCode,
      "99.999-99",
    );

    for (const { productId, quantity } of input.items) {
      const product = this.productRepository.get(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      order.addItem({
        productId,
        price: product.price,
        quantity,
      });
      order.freight +=
        this.freightCalculator.calculate(distance, product) * quantity;
    }

    if (input.coupon) {
      const coupon = this.couponRepository.get(input.coupon);
      if (coupon) {
        order.addCoupon(coupon);
      }
    }

    this.orderRepository.add(order);

    return {
      total: order.total,
      freight: order.freight,
      code: order.code,
    };
  }
}

export namespace PlaceOrder {
  export type Input = {
    cpf: string;
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    zipCode: string;
    coupon?: string;
  };

  export type Output = {
    total: number;
    freight: number;
    code: string;
  };

  export type ConstructorParams = {
    cpfValidator: CpfValidator;
    orderRepository: OrderRepository;
    zipCodeDistanceCalculator: ZipCodeDistanceCalculatorAPI;
    freightCalculator: FreightCalculatorAPI;
    productRepository: ProductRepository;
    couponRepository: CouponRepository;
  };
}
