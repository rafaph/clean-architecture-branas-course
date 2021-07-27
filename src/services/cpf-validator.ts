export class CpfValidator {
  private sanitize(cpf: string): string {
    return cpf.replace(/\D/g, "");
  }

  private isInvalidLenght(cpf: string): boolean {
    return cpf.length !== 11;
  }

  private allNumberAreEqual(cpf: number[]): boolean {
    return cpf.every((digit) => digit === cpf[0]);
  }

  private toNumbersArray(cpf: string): number[] {
    return Array.from(cpf).map((digit) => parseInt(digit, 10));
  }

  public validate(cpf: string): boolean {
    if (!cpf) {
      return false;
    }

    cpf = this.sanitize(cpf);

    if (this.isInvalidLenght(cpf)) {
      return false;
    }

    const cpfArray = this.toNumbersArray(cpf);

    if (this.allNumberAreEqual(cpfArray)) {
      return false;
    }

    let checkerDigit1 = 0;
    let checkerDigit2 = 0;

    for (let i = 0; i < 9; i++) {
      const digit = cpfArray[i];

      checkerDigit1 += digit * (10 - (i % 10));
      checkerDigit2 += digit * (11 - (i % 11));
    }

    checkerDigit1 = (checkerDigit1 * 10) % 11;
    checkerDigit2 += checkerDigit1 * 2;
    checkerDigit2 = (checkerDigit2 * 10) % 11;

    return checkerDigit1 === cpfArray[9] && checkerDigit2 === cpfArray[10];
  }
}
