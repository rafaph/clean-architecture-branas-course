import faker from "faker";
import { PlaceOrder } from "@/services/place-order";
import Decimal from "decimal.js";
import { DiscountCalculator } from "@/services/discount-calculator";
import { CouponsRepository } from "@/repositories/coupons-repository";
import { OrdersRepository } from "@/repositories/orders-repository";
import { CpfValidator } from "../../src/services/cpf-validator";

const makeProduct = (
  params: {
    description?: string;
    price?: number;
  } = {},
): PlaceOrder.Product => {
  const price = params.price ?? new Decimal(faker.commerce.price()).toNumber();
  const description = params.description ?? faker.commerce.product();
  return {
    price,
    description,
  };
};

const makeOrderItem = (
  params: {
    product?: PlaceOrder.Product;
    amount?: number;
  } = {},
): PlaceOrder.OrderItem => {
  const product = params.product ?? makeProduct();
  const amount = params.amount ?? faker.datatype.number({ min: 1, max: 10 });
  return {
    product,
    amount,
  };
};

const couponsRepository = new CouponsRepository();
const discountCalculator = new DiscountCalculator(couponsRepository);
const cpfValidator = new CpfValidator();
const ordersRepository = new OrdersRepository();

const makePlaceOrder = () =>
  new PlaceOrder(discountCalculator, cpfValidator, ordersRepository);

describe("PlaceOrder", () => {
  it("throw a error when a cpf is invalid", () => {
    const service = makePlaceOrder();
    expect(() =>
      service.execute({
        cpf: "810.869.508-25",
        items: [],
      }),
    ).to.throw();
  });

  it("calculated total must be valid", () => {
    const service = makePlaceOrder();
    const items = new Array(10).fill(null).map(() => makeOrderItem());
    const total = items.reduce(
      (current, item) => current + item.product.price * item.amount,
      0,
    );

    const order = service.execute({
      cpf: "810.869.508-28",
      items,
    });

    expect(order.total.toNumber()).to.be.equals(total);
  });

  it("calculated total with discount must be valid", () => {
    const service = makePlaceOrder();
    const order = service.execute({
      cpf: "810.869.508-28",
      items: [
        makeOrderItem({
          product: makeProduct({
            price: 20,
          }),
          amount: 3,
        }),
        makeOrderItem({
          product: makeProduct({
            price: 10,
          }),
          amount: 4,
        }),
      ],
      discountCoupon: "BR10",
    });

    expect(order.total.toNumber()).to.be.equals(90);
  });

  it("calculated total with discount must be zero", () => {
    const service = makePlaceOrder();
    const order = service.execute({
      cpf: "810.869.508-28",
      items: [
        makeOrderItem({
          product: makeProduct({
            price: 20,
          }),
          amount: 3,
        }),
        makeOrderItem({
          product: makeProduct({
            price: 10,
          }),
          amount: 4,
        }),
      ],
      discountCoupon: "BR101",
    });

    expect(order.total.toNumber()).to.be.equals(0);
  });
});
