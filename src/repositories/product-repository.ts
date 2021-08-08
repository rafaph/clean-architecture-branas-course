import { Product } from "@/entities/product";

export class ProductRepository {
  private readonly products: Product[];

  public constructor() {
    this.products = [
      new Product({
        id: "1",
        description: "Guitarra",
        price: 1000,
        width: 100,
        height: 50,
        depth: 15,
        weight: 3,
      }),
      new Product({
        id: "2",
        description: "Amplificador",
        price: 5000,
        width: 50,
        height: 50,
        depth: 50,
        weight: 22,
      }),
      new Product({
        id: "3",
        description: "Cabo",
        price: 30,
        width: 10,
        height: 10,
        depth: 10,
        weight: 1,
      }),
    ];
  }

  public getProduct(id: string): Product | undefined {
    return this.products.find((product: Product) => product.id === id);
  }
}
