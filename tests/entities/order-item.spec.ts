import { OrderItem } from "@/entities/order-item";
import { ProductFactory } from "@tests/factories/product";

describe("OrderItem", () => {
  it("total should be correct", () => {
    const product = new ProductFactory().buildInstance({
      price: 10,
    });
    const quantity = 10;
    const orderItem = new OrderItem({
      product,
      quantity,
    });
    expect(orderItem.total).to.be.equal(100);
  });
});
