import { Coupon } from "@/entities/coupon";

export abstract class CouponRepository {
  public abstract getCoupon(code: string): Coupon | undefined;
}
