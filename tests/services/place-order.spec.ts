import { PlaceOrder } from "@/services/place-order";
import { DiscountCalculator } from "@/services/discount-calculator";
import { CouponsRepository } from "@/repositories/coupons-repository";
import { OrdersRepository } from "@/repositories/orders-repository";
import { CpfValidator } from "@/services/cpf-validator";
import { ShippingPriceCalculator } from "@/services/shipping-price-calculator";
import { CepDistanceCalculator } from "@/services/cep-distance-calculator";
import { OrderItemFactory } from "@tests/factories/order-item";
import sinon from "sinon";
import Decimal from "decimal.js";

const makePlaceOrder = (shippingPrice = 0) => {
  const couponsRepository = new CouponsRepository();
  const discountCalculator = new DiscountCalculator(couponsRepository);
  const cpfValidator = new CpfValidator();
  const ordersRepository = new OrdersRepository();
  const cepDistanceCalculator = new CepDistanceCalculator();
  const shippingPriceCalculator = new ShippingPriceCalculator(
    cepDistanceCalculator,
  );
  sinon
    .stub(shippingPriceCalculator, "calculate")
    .callsFake(() => new Decimal(shippingPrice));
  const placeOrder = new PlaceOrder(
    discountCalculator,
    shippingPriceCalculator,
    cpfValidator,
    ordersRepository,
  );

  return {
    placeOrder,
    shippingPriceCalculator,
  };
};

const cpf = "810.869.508-28";
const cep = "22222-222";

describe("PlaceOrder", () => {
  it("throw a error when a cpf is invalid", () => {
    const { placeOrder } = makePlaceOrder();
    expect(() =>
      placeOrder.execute({
        cpf: "810.869.508-25",
        items: [],
        cep,
      }),
    ).to.throw();
  });

  it("calculated total must be valid", () => {
    const { placeOrder } = makePlaceOrder();
    const items = new OrderItemFactory().buildMany(5);
    const total = items.reduce(
      (current, item) => current + item.product.price.toNumber() * item.amount,
      0,
    );

    const order = placeOrder.execute({
      cpf,
      items,
      cep,
    });

    expect(order.total.toFixed(2)).to.be.equals(new Decimal(total).toFixed(2));
  });

  it("calculated total with discount must be valid", () => {
    const { placeOrder } = makePlaceOrder();
    const items = new OrderItemFactory().buildMany(5);
    const total = items.reduce(
      (current, item) => current + item.product.price.toNumber() * item.amount,
      0,
    );
    const order = placeOrder.execute({
      cpf,
      items,
      cep,
      discountCoupon: "BR10",
    });

    expect(order.total.toFixed(2)).to.be.equals(
      new Decimal(total * 0.9).toFixed(2),
    );
  });

  it("calculated total with max discount must be zero", () => {
    const { placeOrder } = makePlaceOrder();
    const items = new OrderItemFactory().buildMany(5);
    const order = placeOrder.execute({
      cpf,
      items,
      cep,
      discountCoupon: "BR101",
    });

    expect(order.total.toNumber()).to.be.equals(0);
  });

  it("throw a error if coupon is not found", () => {
    const { placeOrder } = makePlaceOrder();
    expect(() =>
      placeOrder.execute({
        cpf,
        items: [new OrderItemFactory().build()],
        cep,
        discountCoupon: "BR31",
      }),
    ).to.throw();
  });

  it("throw a error if coupon is expired", () => {
    const { placeOrder } = makePlaceOrder();
    expect(() =>
      placeOrder.execute({
        cpf,
        items: [new OrderItemFactory().build()],
        discountCoupon: "BR20",
        cep,
      }),
    ).to.throw();
  });

  it("calculated total with discount must not apply to shipping price", () => {
    const { placeOrder } = makePlaceOrder(20);
    const items = new OrderItemFactory().buildMany(5);
    const total = items.reduce(
      (current, item) => current + item.product.price.toNumber() * item.amount,
      0,
    );
    const order = placeOrder.execute({
      cpf,
      items,
      cep,
      discountCoupon: "BR10",
    });

    expect(order.total.toFixed(2)).to.be.equals(
      new Decimal(total * 0.9 + 20).toFixed(2),
    );
  });
});
