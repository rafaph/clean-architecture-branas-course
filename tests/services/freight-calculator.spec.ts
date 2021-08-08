import { FreightCalculator } from "@/services/freight-calculator";
import { ProductFactory } from "@tests/factories/product";

const freightCalculator = new FreightCalculator();

describe("FreightCalculator", () => {
  it("freight should be correct", () => {
    const distance = 1000;
    const product = new ProductFactory().buildInstance({
      width: 100,
      height: 50,
      depth: 15,
      weight: 3,
    });
    const freightPrice = freightCalculator.calculate(distance, product);
    expect(freightPrice).to.be.equal(30);
  });

  it("freight should be at least 10", () => {
    const distance = 1000;
    const product = new ProductFactory().buildInstance({
      width: 9,
      height: 9,
      depth: 9,
      weight: 0.1,
    });
    const freightPrice = freightCalculator.calculate(distance, product);
    expect(freightPrice).to.be.equal(10);
  });
});
