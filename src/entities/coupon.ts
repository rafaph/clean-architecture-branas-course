import { compareAsc } from "date-fns";

export class Coupon {
  public constructor(
    public readonly code: string,
    public readonly value: number,
    public readonly expirationDate?: Date,
  ) {}

  public isValid(): boolean {
    if (!this.expirationDate) {
      return true;
    }
    const now = new Date();
    return compareAsc(this.expirationDate, now) >= 0;
  }
}
