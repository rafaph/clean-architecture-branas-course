import { ZipCodeDistanceCalculatorAPIMemory } from "@/infra/gateway/memory/zip-code-distance-calculator-api-memory";

const zipCodeDistanceCalculatorApiMemory =
  new ZipCodeDistanceCalculatorAPIMemory();

describe("ZipCodeDistanceCalculatorAPIMemory", () => {
  it("should calculate distance between two zip codes", () => {
    const distance = zipCodeDistanceCalculatorApiMemory.calculate(
      "11.111-111",
      "99.999-999",
    );
    expect(distance).to.be.equals(1000);
  });
});
