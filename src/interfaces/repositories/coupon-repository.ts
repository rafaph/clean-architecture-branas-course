import { Coupon } from "@/entities/coupon";

export abstract class CouponRepository {
  public abstract get(code: string): Coupon | undefined;
}
