import Decimal from "decimal.js";

export class ShippingInfo {
  public cepDestination: string;
  public cepOrigin: string;
  public value: Decimal;

  public constructor() {
    this.cepDestination = "";
    this.value = new Decimal(0);
    this.cepOrigin = "11111-111";
  }
}
