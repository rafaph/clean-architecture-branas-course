import { CepDistanceCalculator } from "@/services/cep-distance-calculator";
import { OrderItem } from "@/entities/order";
import { ShippingPriceCalculator } from "@/services/shipping-price-calculator";
import { OrderItemFactory } from "../factories/order-item";
import { ProductFactory } from "../factories/product";
import { expect } from "chai";

const cepDistanceCalculator = new CepDistanceCalculator();

const makeSut = (params: { items?: OrderItem[] } = {}): number => {
  const shippingPriceCalculator = new ShippingPriceCalculator(
    cepDistanceCalculator,
  );
  const data = {
    items: [
      new OrderItemFactory().build({
        product: new ProductFactory().build({
          height: 100,
          width: 100,
          depth: 100,
          weight: 100,
        }),
        amount: 2,
      }),
    ],
    ...params,
  };
  return shippingPriceCalculator.calculate(data.items, "", "").toNumber();
};

describe("ShippingPriceCalculator", () => {
  it("calculated shipping price must be correct", () => {
    const shippingPrice = makeSut();
    expect(shippingPrice).to.be.equals(400);
  });

  it("calculated shipping price must be at least 10", () => {
    const shippingPrice = makeSut({
      items: [
        new OrderItemFactory().build({
          product: new ProductFactory().build({
            height: 5,
            width: 5,
            depth: 5,
            weight: 2,
          }),
          amount: 1,
        }),
      ],
    });
    expect(shippingPrice).to.equals(10);
  });
});
