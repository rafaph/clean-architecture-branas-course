import { Product } from "@/domain/entity/product";

export abstract class ProductRepository {
  public abstract get(id: string): Product | undefined;
}
