import { subDays, addDays } from "date-fns";
import { Coupon } from "@/domain/entity/coupon";
import { CouponRepository } from "@/domain/repository/coupon-repository";

export class CouponRepositoryMemory implements CouponRepository {
  private readonly coupons: Coupon[];

  public constructor() {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const yesterday = subDays(today, 1);

    this.coupons = [
      new Coupon({
        code: "VALE20",
        percentage: 20,
        expirationDate: tomorrow,
      }),
      new Coupon({
        code: "VALE20_EXPIRED",
        percentage: 20,
        expirationDate: yesterday,
      }),
    ];
  }

  public get(code: string): Coupon | undefined {
    return this.coupons.find((coupon: Coupon) => coupon.code === code);
  }
}
