import Decimal from "decimal.js";

export class Product {
  public description: string;
  public height: number;
  public width: number;
  public depth: number;
  public weight: number;
  public price: Decimal;

  public constructor(params: Product.Params) {
    this.description = params.description;
    this.height = params.height;
    this.width = params.width;
    this.depth = params.depth;
    this.weight = params.weight;
    this.price = new Decimal(params.price);
  }

  public get volume(): number {
    const height = this.height / 100;
    const width = this.width / 100;
    const depth = this.depth / 100;

    return height * width * depth;
  }

  public get density(): number {
    return new Decimal(this.weight / this.volume).floor().toNumber();
  }
}

export namespace Product {
  export type Params = {
    description: string;
    height: number;
    width: number;
    depth: number;
    weight: number;
    price: number;
  };
}
