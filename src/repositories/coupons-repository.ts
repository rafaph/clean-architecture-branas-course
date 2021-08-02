import { subDays } from "date-fns";

import { Coupon } from "@/entities/coupon";

export class CouponsRepository {
  private readonly coupons: Coupon[];

  public constructor() {
    this.coupons = [
      new Coupon("BR10", 0.1),
      new Coupon("BR20", 0.2, subDays(new Date(), 1)),
      new Coupon("BR101", 1.1),
    ];
  }

  public getCoupon(discountCoupon: string): Coupon | undefined {
    return this.coupons.find((coupon) => coupon.code === discountCoupon);
  }
}
