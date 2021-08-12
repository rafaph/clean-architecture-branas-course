import { GetOrder } from "@/use-cases/get-order";
import { InMemoryOrderRepository } from "@/repositories/in-memory-order-repository";
import { Order } from "@/entities/order";
import { Customer } from "@/entities/customer";
import { Coupon } from "@/entities/coupon";
import { addDays } from "date-fns";

const makeOrder = (
  expectedInfo: GetOrder.Output,
  coupon?: Coupon,
): { order: Order; repository: InMemoryOrderRepository } => {
  const orderRepository = new InMemoryOrderRepository();
  const customer = new Customer({
    cpf: expectedInfo.cpf,
  });
  const order = new Order({
    customer,
    zipCode: expectedInfo.zipCode,
  });
  order.addItem({
    productId: "1",
    quantity: expectedInfo.items[0].quantity,
    price: expectedInfo.items[0].price,
  });
  order.addItem({
    productId: "2",
    quantity: expectedInfo.items[1].quantity,
    price: expectedInfo.items[1].price,
  });
  order.addItem({
    productId: "3",
    quantity: expectedInfo.items[2].quantity,
    price: expectedInfo.items[2].price,
  });
  order.freight = expectedInfo.freight;
  if (coupon) {
    order.addCoupon(coupon);
  }
  orderRepository.add(order);

  return { order, repository: orderRepository };
};

describe("GetOrder", () => {
  it("should throw a error if order not found", () => {
    const orderRepository = new InMemoryOrderRepository();
    const getOrder = new GetOrder({ orderRepository });

    expect(() => getOrder.execute({ id: 1 })).to.throw;
  });

  it("should get corrected order info with coupon", () => {
    const expectedInfo = {
      code: `${new Date().getFullYear()}00000001`,
      cpf: "848.067.240-41",
      zipCode: "11.1111-11",
      discount: 1418,
      freight: 310,
      total: 5982,
      items: [
        { price: 1000, quantity: 2 },
        { price: 5000, quantity: 1 },
        { price: 30, quantity: 3 },
      ],
    };

    const { order, repository } = makeOrder(
      expectedInfo,
      new Coupon({
        code: "VALE20",
        expirationDate: addDays(new Date(), 1),
        percentage: 20,
      }),
    );

    const getOrder = new GetOrder({ orderRepository: repository });
    const orderInfo = getOrder.execute({ id: order.id });

    expect(orderInfo).to.be.deep.equals(expectedInfo);
  });

  it("should get corrected order info without coupon", () => {
    const expectedInfo = {
      code: `${new Date().getFullYear()}00000001`,
      cpf: "848.067.240-41",
      zipCode: "11.1111-11",
      discount: 0,
      freight: 310,
      total: 7400,
      items: [
        { price: 1000, quantity: 2 },
        { price: 5000, quantity: 1 },
        { price: 30, quantity: 3 },
      ],
    };

    const { order, repository } = makeOrder(expectedInfo);

    const getOrder = new GetOrder({ orderRepository: repository });
    const orderInfo = getOrder.execute({ id: order.id });

    expect(orderInfo).to.be.deep.equals(expectedInfo);
  });
});
