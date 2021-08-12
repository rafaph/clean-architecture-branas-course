import { Product } from "@/entities/product";

export abstract class ProductRepository {
  public abstract get(id: string): Product | undefined;
}
