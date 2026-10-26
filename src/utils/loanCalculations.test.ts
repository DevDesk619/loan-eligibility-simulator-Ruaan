import { describe, expect, test } from "vitest";
import { calculateMonthlyPayment, roundCurrency } from "./loanCalculations";

describe("loan calculations", () => {
  test("calculates a positive amortised monthly payment", () => {
    expect(calculateMonthlyPayment(120_000, 12.5, 36)).toBeCloseTo(4_014.44, 2);
  });

  test("handles a zero-interest loan", () => {
    expect(calculateMonthlyPayment(12_000, 0, 12)).toBe(1_000);
  });

  test("returns zero for invalid loan inputs", () => {
    expect(calculateMonthlyPayment(-1, 10, 12)).toBe(0);
    expect(calculateMonthlyPayment(10_000, 10, 0)).toBe(0);
  });

  test("rounds currency to two decimal places", () => {
    expect(roundCurrency(123.456)).toBe(123.46);
  });
});
