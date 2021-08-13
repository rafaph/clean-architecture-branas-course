import { ProductFactory } from "@test/factory/product-factory";
import { Product } from "@/domain/entity/product";

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
