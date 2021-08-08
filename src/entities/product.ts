export class Product {
  public id: string;
  public description: string;
  public height: number;
  public width: number;
  public depth: number;
  public weight: number;
  public price: number;

  public constructor({
    id,
    description,
    height,
    width,
    depth,
    weight,
    price,
  }: Product.ConstructorParams) {
    this.id = id;
    this.description = description;
    this.height = height;
    this.width = width;
    this.depth = depth;
    this.weight = weight;
    this.price = price;
  }

  public get volume(): number {
    return (this.height / 100) * (this.width / 100) * (this.depth / 100);
  }

  public get density(): number {
    return this.weight / this.volume;
  }
}

export namespace Product {
  export type ConstructorParams = {
    id: string;
    description: string;
    height: number;
    width: number;
    depth: number;
    weight: number;
    price: number;
  };
}
