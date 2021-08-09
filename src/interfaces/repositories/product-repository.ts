import { Product } from "@/entities/product";

export abstract class ProductRepository {
  public abstract getProduct(id: string): Product | undefined;
}
