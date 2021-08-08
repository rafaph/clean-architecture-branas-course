import { Product } from "@/entities/product";
import { FreightCalculatorAPI } from "@/interfaces/freight-calculator-api";

export class FreightCalculator implements FreightCalculatorAPI {
  public calculate(distance: number, product: Product): number {
    let price = distance * product.volume * (product.density / 100);

    if (price < 10) {
      price = 10;
    }

    return price;
  }
}
