interface Coupons {
  [key: string]: number;
}

export class CouponsRepository {
  private readonly coupons: Coupons;

  public constructor() {
    this.coupons = {
      BR10: 0.1,
      BR20: 0.2,
    };
  }

  public getDiscountPercentage(discountCoupon: string): number {
    if (this.coupons[discountCoupon] === undefined) {
      return 0;
    }

    return this.coupons[discountCoupon];
  }
}
