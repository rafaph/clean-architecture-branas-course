import { OrderItem } from "@/domain/entity/order-item";
import { ProductFactory } from "@tests/factory/product-factory";

describe("OrderItem", () => {
  it("total should be correct", () => {
    const product = new ProductFactory().buildInstance({
      price: 10,
    });
    const quantity = 10;
    const orderItem = new OrderItem({
      productId: product.id,
      price: product.price,
      quantity,
    });
    expect(orderItem.total).to.be.equal(100);
  });
});
