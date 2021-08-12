import { OrderRepository } from "@/interfaces/repositories/order-repository";

export class GetOrder {
  public orderRepository: OrderRepository;

  public constructor({ orderRepository }: GetOrder.ConstructorParams) {
    this.orderRepository = orderRepository;
  }

  public execute(input: GetOrder.Input): GetOrder.Output {
    const order = this.orderRepository.get(input.id);
    if (!order) {
      throw new Error(`order ${input.id} not found.`);
    }

    return {
      code: order.code,
      cpf: order.customer.cpf,
      zipCode: order.zipCode,
      discount: order.discount,
      freight: order.freight,
      total: order.total,
      items: order.items.map((item) => ({
        price: item.price,
        quantity: item.quantity,
      })),
    };
  }
}

export namespace GetOrder {
  export type ConstructorParams = {
    orderRepository: OrderRepository;
  };

  export type Input = {
    id: number;
  };

  export type OutputItem = {
    price: number;
    quantity: number;
  };

  export type Output = {
    code: string;
    cpf: string;
    zipCode: string;
    items: OutputItem[];
    discount: number;
    freight: number;
    total: number;
  };
}
