import { Product } from "@/entities/product";

export interface FreightCalculatorAPI {
  calculate(distance: number, product: Product): number;
}
