export interface ZipCodeDistanceCalculatorAPI {
  calculate(zipCodeA: string, zipCodeB: string): number;
}
