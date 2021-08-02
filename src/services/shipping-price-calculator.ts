import Decimal from "decimal.js";
import { OrderItem } from "@/entities/order";
import { CepDistanceCalculator } from "@/services/cep-distance-calculator";

export class ShippingPriceCalculator {
  public constructor(
    public readonly cepDistanceCalculator: CepDistanceCalculator,
  ) {}

  private calculateInfo(items: OrderItem[]): {
    volume: number;
    density: number;
  } {
    let volume = 0;
    let density = 0;

    for (const item of items) {
      volume += item.product.volume * item.amount;
      density += item.product.density * item.amount;
    }

    return {
      volume,
      density,
    };
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
    const { volume, density } = this.calculateInfo(items);
    let price = distance.toNumber() * volume * (density / 100);

    if (price < 10) {
      price = 10;
    }

    return new Decimal(price);
  }
}
