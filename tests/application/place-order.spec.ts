import { PlaceOrder } from "@/application/place-order";
import { CpfValidator } from "@/domain/service/cpf-validator";
import { OrderRepositoryMemory } from "@/infra/repository/memory/order-repository-memory";
import { ZipCodeDistanceCalculatorAPIMemory } from "@/infra/gateway/memory/zip-code-distance-calculator-api-memory";
import { FreightCalculator } from "@/domain/service/freight-calculator";
import { ProductRepositoryMemory } from "@/infra/repository/memory/product-repository-memory";
import { CouponRepositoryMemory } from "@/infra/repository/memory/coupon-repository-memory";

const makePlaceOrder = (
  params: Partial<PlaceOrder.ConstructorParams> = {},
): PlaceOrder => {
  const cpfValidator = new CpfValidator();
  const orderRepository = new OrderRepositoryMemory();
  const zipCodeDistanceCalculator = new ZipCodeDistanceCalculatorAPIMemory();
  const freightCalculator = new FreightCalculator();
  const productRepository = new ProductRepositoryMemory();
  const couponRepository = new CouponRepositoryMemory();

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

  it("should generate a order code", () => {
    const placeOrder = makePlaceOrder();
    const { code } = placeOrder.execute({
      cpf,
      items: [{ productId: "1", quantity: 2 }],
      zipCode,
    });
    const year = new Date().getFullYear();

    expect(code).to.be.equals(`${year}00000001`);
  });
});
