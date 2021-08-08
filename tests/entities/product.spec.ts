import { ProductFactory } from "@tests/factories/product";
import { Product } from "@/entities/product";

describe("Product", () => {
  it("volume should be correct", () => {
    const sut = new Product(
      new ProductFactory().build({
        height: 100,
        width: 100,
        depth: 100,
      }),
    );
    expect(sut.volume).to.be.equals(1);
  });

  it("density should be correct", () => {
    const sut = new Product(
      new ProductFactory().build({
        height: 100,
        width: 100,
        depth: 100,
        weight: 100,
      }),
    );
    expect(sut.density).to.be.equals(100);
  });
});
