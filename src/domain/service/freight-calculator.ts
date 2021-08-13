import { Product } from "@/domain/entity/product";

export class FreightCalculator {
  public calculate(distance: number, product: Product): number {
    let price = distance * product.volume * (product.density / 100);

    if (price < 10) {
      price = 10;
    }

    return price;
  }
}
