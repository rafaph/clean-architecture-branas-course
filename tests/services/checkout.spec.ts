import faker from "faker";
import { CheckoutService } from "@/services/checkout";
import { Product } from "@/entities/product";
import Decimal from "decimal.js";
import { OrderItem } from "@/entities/order";
import { DiscountCalculator } from "@/services/discount-calculator";
import { CouponsRepository } from "@/repositories/coupons-repository";
import { OrdersRepository } from "@/repositories/orders-repository";

const makeProduct = (
  params: {
    description?: string;
    price?: number;
  } = {},
): Product => {
  const price = new Decimal(params.price ?? faker.commerce.price());
  const description = params.description ?? faker.commerce.product();
  return new Product(description, price);
};

const makeOrderItem = (
  params: {
    product?: Product;
    amount?: number;
  } = {},
): OrderItem => {
  const product = params.product ?? makeProduct();
  const amount = params.amount ?? faker.datatype.number({ min: 1, max: 10 });
  return new OrderItem(product, amount);
};

const couponsRepository = new CouponsRepository();
const discountCalculator = new DiscountCalculator(couponsRepository);
const ordersRepository = new OrdersRepository();

describe("CheckoutService", () => {
  it("calculated total must be valid", () => {
    const service = new CheckoutService(discountCalculator, ordersRepository);
    service.addItem(
      makeOrderItem({
        product: makeProduct({
          price: 10,
        }),
        amount: 1,
      }),
    );
    service.addItem(
      makeOrderItem({
        product: makeProduct({
          price: 10,
        }),
        amount: 1,
      }),
    );
    service.addItem(
      makeOrderItem({
        product: makeProduct({
          price: 10,
        }),
        amount: 1,
      }),
    );
    const order = service.checkout();
    expect(order.total.toNumber()).to.be.equals(30);
  });

  it("calculated total with discount must be valid", () => {
    const service = new CheckoutService(discountCalculator, ordersRepository);
    service.addItem(
      makeOrderItem({
        product: makeProduct({
          price: 10,
        }),
        amount: 1,
      }),
    );
    service.addItem(
      makeOrderItem({
        product: makeProduct({
          price: 10,
        }),
        amount: 1,
      }),
    );
    service.addItem(
      makeOrderItem({
        product: makeProduct({
          price: 10,
        }),
        amount: 1,
      }),
    );
    service.addCoupon("BR10");
    const order = service.checkout();
    expect(order.total.toNumber()).to.be.equals(27);
  });
});
