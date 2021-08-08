import { PlaceOrder } from "@/use-cases/place-order";
import { CpfValidator } from "@/services/cpf-validator";
import { OrderRepository } from "@/repositories/order-repository";
import { ZipCodeDistanceCalculatorAPIMemory } from "@/services/zip-code-distance-calculator-api-memory";
import { FreightCalculator } from "@/services/freight-calculator";
import { ProductRepository } from "@/repositories/product-repository";
import { CouponRepository } from "@/repositories/coupon-repository";

const makePlaceOrder = (
  params: Partial<PlaceOrder.ConstructorParams> = {},
): PlaceOrder => {
  const cpfValidator = new CpfValidator();
  const orderRepository = new OrderRepository();
  const zipCodeDistanceCalculator = new ZipCodeDistanceCalculatorAPIMemory();
  const freightCalculator = new FreightCalculator();
  const productRepository = new ProductRepository();
  const couponRepository = new CouponRepository();

  return new PlaceOrder({
    cpfValidator,
    orderRepository,
    zipCodeDistanceCalculator,
    freightCalculator,
    productRepository,
    couponRepository,
    ...params,
  });
};

const cpf = "810.869.508-28";
const zipCode = "22.222-222";

describe("PlaceOrder", () => {
  it("throw a error when a cpf is invalid", () => {
    const placeOrder = makePlaceOrder();
    expect(() =>
      placeOrder.execute({
        cpf: "810.869.508-25",
        items: [],
        zipCode,
      }),
    ).to.throw();
  });

  it("should make a order with a coupon", () => {
    const placeOrder = makePlaceOrder();
    const { total } = placeOrder.execute({
      cpf,
      items: [
        { productId: "1", quantity: 2 },
        { productId: "2", quantity: 1 },
        { productId: "3", quantity: 3 },
      ],
      zipCode,
      coupon: "VALE20",
    });

    expect(total).to.be.equals(5982);
  });

  it("should make a order with a expired coupon", () => {
    const placeOrder = makePlaceOrder();
    const { total } = placeOrder.execute({
      cpf,
      items: [
        { productId: "1", quantity: 2 },
        { productId: "2", quantity: 1 },
        { productId: "3", quantity: 3 },
      ],
      zipCode,
      coupon: "VALE20_EXPIRED",
    });

    expect(total).to.be.equals(7400);
  });

  it("should make a order with a invalid coupon", () => {
    const placeOrder = makePlaceOrder();
    const { total } = placeOrder.execute({
      cpf,
      items: [
        { productId: "1", quantity: 2 },
        { productId: "2", quantity: 1 },
        { productId: "3", quantity: 3 },
      ],
      zipCode,
      coupon: "NOT_FOUND",
    });

    expect(total).to.be.equals(7400);
  });

  it("should make a order with a freight correct", () => {
    const placeOrder = makePlaceOrder();
    const { freight } = placeOrder.execute({
      cpf,
      items: [
        { productId: "1", quantity: 2 },
        { productId: "2", quantity: 1 },
        { productId: "3", quantity: 3 },
      ],
      zipCode,
    });

    expect(freight).to.be.equals(310);
  });

  it("should throw a error if product is not found", () => {
    const placeOrder = makePlaceOrder();
    expect(() =>
      placeOrder.execute({
        cpf,
        items: [{ productId: "abc", quantity: 2 }],
        zipCode,
      }),
    ).to.throw();
  });
});
