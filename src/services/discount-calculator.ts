import Decimal from "decimal.js";
import { CouponsRepository } from "@/repositories/coupons-repository";

export class DiscountCalculator {
  public constructor(private couponRepository: CouponsRepository) {}

  public calculate(discountCoupon: string, total: Decimal): Decimal {
    const percentage =
      this.couponRepository.getDiscountPercentage(discountCoupon);
    return total.times(percentage);
  }
}
