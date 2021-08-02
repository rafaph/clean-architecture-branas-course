import Decimal from "decimal.js";
import { CouponsRepository } from "@/repositories/coupons-repository";

export class DiscountCalculator {
  public constructor(private couponRepository: CouponsRepository) {}

  private getPercentage(discountCoupon?: string): number {
    if (!discountCoupon) {
      return 0;
    }

    const coupon = this.couponRepository.getCoupon(discountCoupon);

    if (!coupon) {
      throw new Error("Invalid coupon");
    }

    if (!coupon.isValid()) {
      throw new Error("Expired coupon");
    }

    return coupon.value;
  }

  public calculate(total: Decimal, discountCoupon?: string): Decimal {
    const percentage = this.getPercentage(discountCoupon);
    return total.times(percentage);
  }
}
