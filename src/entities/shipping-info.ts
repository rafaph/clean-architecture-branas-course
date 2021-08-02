import Decimal from "decimal.js";

export class ShippingInfo {
  public constructor(
    public cepDestination: string,
    public value: Decimal = new Decimal(0),
    public cepOrigin: string = "11111-111",
  ) {}
}
