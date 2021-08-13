import { Coupon } from "@/domain/entity/coupon";

export abstract class CouponRepository {
  public abstract get(code: string): Coupon | undefined;
}
