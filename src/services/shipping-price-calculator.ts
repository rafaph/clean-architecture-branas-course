import { OrderItem } from "@/entities/order";
import Decimal from "decimal.js";
import { CepDistanceCalculator } from "@/services/cep-distance-calculator";

export class ShippingPriceCalculator {
  public constructor(
    public readonly cepDistanceCalculator: CepDistanceCalculator,
  ) {}

  private calculateVolume(items: OrderItem[]): number {
    let total = 0;

    for (const item of items) {
      total += item.product.volume * item.amount;
    }

    return total;
  }

  private calculateDensity(items: OrderItem[]): number {
    let total = 0;

    for (const item of items) {
      total += item.product.density * item.amount;
    }

    return total;
  }

  public calculate(
    items: OrderItem[],
    cepOrigin: string,
    cepDestination: string,
  ): Decimal {
    const distance = this.cepDistanceCalculator.calculate(
      cepOrigin,
      cepDestination,
    );
    const volume = this.calculateVolume(items);
    const density = this.calculateDensity(items);
    let price = distance.toNumber() * volume * (density / 100);

    if (price < 10) {
      price = 10;
    }

    return new Decimal(price);
  }
}
