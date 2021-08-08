import { Product } from "@/entities/product";
import faker from "faker";

export class ProductFactory {
  public build(params: ProductFactory.Params = {}): Product.ConstructorParams {
    return {
      id: faker.datatype.uuid(),
      height: faker.datatype.number({ min: 1, max: 100 }),
      width: faker.datatype.number({ min: 1, max: 100 }),
      depth: faker.datatype.number({ min: 1, max: 100 }),
      weight: faker.datatype.number({ min: 1, max: 100 }),
      price: faker.datatype.number({ min: 1, max: 100 }),
      description: faker.commerce.productDescription(),
      ...params,
    };
  }

  public buildInstance(params: ProductFactory.Params = {}): Product {
    return new Product(this.build(params));
  }

  public buildMany(
    length: number = faker.datatype.number({ min: 0, max: 10 }),
  ): Product.ConstructorParams[] {
    return Array.from({ length }, () => this.build());
  }

  public buildManyInstances(
    length: number = faker.datatype.number({ min: 0, max: 10 }),
  ): Product[] {
    return Array.from({ length }, () => this.buildInstance());
  }
}

export namespace ProductFactory {
  export type Params = Partial<Product.ConstructorParams>;
}
