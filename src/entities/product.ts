import Decimal from "decimal.js";

export class Product {
  public constructor(public description: string, public price: Decimal) {}
}
