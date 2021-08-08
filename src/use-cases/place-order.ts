import { Order } from "@/entities/order";
import { OrderRepository } from "@/repositories/order-repository";
import { Customer } from "@/entities/customer";
import { CpfValidator } from "@/services/cpf-validator";
import { FreightCalculatorAPI } from "@/interfaces/freight-calculator-api";
import { ZipCodeDistanceCalculatorAPI } from "@/interfaces/zip-code-distance-calculator-api";
import { ProductRepository } from "@/repositories/product-repository";
import { CouponRepository } from "@/repositories/coupon-repository";

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
    const order = new Order({ customer });
    const distance = this.zipCodeDistanceCalculator.calculate(
      input.zipCode,
      "99.999-99",
    );

    for (const { productId, quantity } of input.items) {
      const product = this.productRepository.getProduct(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      order.addItem({
        product,
        quantity,
      });
      order.freight +=
        this.freightCalculator.calculate(distance, product) * quantity;
    }

    if (input.coupon) {
      const coupon = this.couponRepository.getCoupon(input.coupon);
      if (coupon) {
        order.addCoupon(coupon);
      }
    }

    this.orderRepository.addOrder(order);

    return {
      total: order.total,
      freight: order.freight,
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
