export class Customer {
  public readonly cpf: string;

  public constructor({ cpf }: Customer.ConstructorParams) {
    this.cpf = cpf;
  }
}

export namespace Customer {
  export type ConstructorParams = {
    cpf: string;
  };
}
