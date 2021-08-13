import { Order } from "@/domain/entity/order";
import { Customer } from "@/domain/entity/customer";
import { CpfValidator } from "@/domain/service/cpf-validator";
import { FreightCalculator } from "@/domain/service/freight-calculator";
import { ZipCodeDistanceCalculatorAPI } from "@/domain/gateway/zip-code-distance-calculator-api";
import { OrderRepository } from "@/domain/repository/order-repository";
import { ProductRepository } from "@/domain/repository/product-repository";
import { CouponRepository } from "@/domain/repository/coupon-repository";

export class PlaceOrder {
  private readonly cpfValidator: CpfValidator;
  private readonly orderRepository: OrderRepository;
  private readonly zipCodeDistanceCalculator: ZipCodeDistanceCalculatorAPI;
  private readonly freightCalculator: FreightCalculator;
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
    freightCalculator: FreightCalculator;
    productRepository: ProductRepository;
    couponRepository: CouponRepository;
  };
}
