import { compareAsc } from "date-fns";

export class Coupon {
  public code: string;
  public percentage: number;
  public expirationDate: Date;

  public constructor({
    code,
    percentage,
    expirationDate,
  }: Coupon.ConstructorParams) {
    this.code = code;
    this.percentage = percentage;
    this.expirationDate = expirationDate;
  }

  public get isExpired(): boolean {
    const now = new Date();
    return compareAsc(this.expirationDate, now) === -1;
  }
}

export namespace Coupon {
  export type ConstructorParams = {
    code: string;
    percentage: number;
    expirationDate: Date;
  };
}
