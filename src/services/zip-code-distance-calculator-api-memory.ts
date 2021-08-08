import { ZipCodeDistanceCalculatorAPI } from "@/interfaces/zip-code-distance-calculator-api";

export class ZipCodeDistanceCalculatorAPIMemory
  implements ZipCodeDistanceCalculatorAPI
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public calculate(zipCodeA: string, zipCodeB: string): number {
    return 1000;
  }
}
