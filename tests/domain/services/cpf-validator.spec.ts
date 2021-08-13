import { CpfValidator } from "@/domain/service/cpf-validator";

const validator = new CpfValidator();

describe("CpfValidator", () => {
  it("returns false when cpf is empty", () => {
    expect(validator.validate("")).to.be.false;
  });

  it("returnn false when cpf is too big", () => {
    expect(validator.validate("123456789012")).to.be.false;
    expect(validator.validate("123.456.789-012")).to.be.false;
  });

  it("returns false when all numbers are equals", () => {
    expect(validator.validate("11111111111")).to.be.false;
  });

  it("returns true for a valid cpf", () => {
    expect(validator.validate("529.982.247-25")).to.be.true;
  });

  it("returns false for a invalid cpf", () => {
    expect(validator.validate("529.982.147-25")).to.be.false;
  });
});
