import { addDays, subDays } from "date-fns";
import { Coupon } from "@/domain/entity/coupon";

describe("Coupon", () => {
  it("isExpired should be true", () => {
    const coupon = new Coupon({
      code: "VALE20",
      percentage: 20,
      expirationDate: subDays(new Date(), 1),
    });
    expect(coupon.isExpired).to.be.true;
  });

  it("isExpired should be false", () => {
    const coupon = new Coupon({
      code: "VALE20",
      percentage: 20,
      expirationDate: addDays(new Date(), 1),
    });
    expect(coupon.isExpired).to.be.false;
  });
});
