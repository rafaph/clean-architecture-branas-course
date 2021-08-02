import { ProductFactory } from "@tests/factories/product";

describe("Product", () => {
  it("must have volume calculated", () => {
    const sut = new ProductFactory().build({
      height: 100,
      width: 100,
      depth: 100,
    });
    expect(sut.volume).to.be.equals(1);
  });

  it("must have density calculated", () => {
    const sut = new ProductFactory().build({
      height: 100,
      width: 100,
      depth: 100,
      weight: 100,
    });
    expect(sut.density).to.be.equals(100);
  });
});
