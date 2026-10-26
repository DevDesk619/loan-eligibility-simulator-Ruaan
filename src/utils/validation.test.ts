import { describe, expect, test } from "vitest";
import { initialLoanFormValues } from "../features/eligibility/formDefaults";
import { validateLoanForm } from "./validation";

describe("validateLoanForm", () => {
  test("accepts the initial demo values", () => {
    expect(validateLoanForm(initialLoanFormValues)).toEqual({});
  });

  test("reports age, income and loan amount outside the personal-loan limits", () => {
    const errors = validateLoanForm({ ...initialLoanFormValues, age: 17, monthlyIncome: 4_000, requestedAmount: 350_000 });
    expect(errors.age).toBeDefined();
    expect(errors.monthlyIncome).toBeDefined();
    expect(errors.requestedAmount).toBeDefined();
  });

  test("uses vehicle-specific amount and term limits", () => {
    const errors = validateLoanForm({ ...initialLoanFormValues, loanType: "vehicle_loan", loanPurpose: "new_vehicle", requestedAmount: 600_000, loanTerm: 72 });
    expect(errors.requestedAmount).toBeUndefined();
    expect(errors.loanTerm).toBeUndefined();
  });

  test("rejects a vehicle purpose for a personal loan", () => {
    const errors = validateLoanForm({ ...initialLoanFormValues, loanPurpose: "new_vehicle" });
    expect(errors.loanPurpose).toBeDefined();
  });

  test("allows zero existing debt and zero monthly expenses", () => {
    const errors = validateLoanForm({ ...initialLoanFormValues, existingDebt: 0, monthlyExpenses: 0 });
    expect(errors.existingDebt).toBeUndefined();
    expect(errors.monthlyExpenses).toBeUndefined();
  });

  test("rejects empty financial inputs", () => {
  const errors = validateLoanForm({
    ...initialLoanFormValues,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    existingDebt: 0,
  });

  expect(errors.monthlyIncome).toBeDefined();
  expect(errors.monthlyExpenses).toBeDefined();
  expect(errors.existingDebt).toBeDefined();
});

  test("rejects negative or non-finite financial values", () => {
    const errors = validateLoanForm({ ...initialLoanFormValues, existingDebt: -1, monthlyExpenses: Number.NaN });
    expect(errors.existingDebt).toBeDefined();
    expect(errors.monthlyExpenses).toBeDefined();
  });
});
