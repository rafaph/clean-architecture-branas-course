import { Order } from "@/entities/order";
import { Customer } from "@/entities/customer";

describe("Order", () => {
  it("should calculate order code", () => {
    const customer = new Customer({
      cpf: "718.169.150-33",
    });
    const order = new Order({
      customer,
    });
    order.id = 123;
    const year = new Date().getFullYear();

    expect(order.code).to.be.equals(`${year}00000${order.id}`);
  });
});
