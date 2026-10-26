import { describe, expect, test } from "vitest";
import { calculateLoanRateMock, checkEligibilityMock, getLoanProductsMock, getValidationRulesMock } from "./mockLoanService";
import { calculateMonthlyPayment } from "../utils/loanCalculations";
import type { LoanFormValues } from "../types";

const validValues: LoanFormValues = { age: 32, employmentStatus: "employed", employmentDuration: 36, monthlyIncome: 28000, monthlyExpenses: 14500, existingDebt: 2500, creditScore: 680, requestedAmount: 120000, loanTerm: 36, loanPurpose: "home_improvement", loanType: "personal_loan" };

describe("mock loan service", () => {
  test("calculates a positive monthly repayment for a valid loan", () => {
    expect(calculateMonthlyPayment(120000, 12.5, 36)).toBeGreaterThan(0);
  });
  test("returns a stable eligibility response with bounded likelihood", async () => {
    const result = await checkEligibilityMock(validValues);
    expect(result.eligibilityResult.approvalLikelihood).toBeGreaterThanOrEqual(5);
    expect(result.eligibilityResult.approvalLikelihood).toBeLessThanOrEqual(96);
    expect(result.recommendedLoan.monthlyPayment).toBeGreaterThan(0);
    expect(result.affordabilityAnalysis.disposableIncome).toBe(11000);
  });
  test("exposes loan products with the specified product limits", async () => {
    const result = await getLoanProductsMock();
    expect(result.products.find((product) => product.id === "vehicle_loan")?.minAmount).toBe(50000);
    expect(result.products.find((product) => product.id === "personal_loan")?.maxAmount).toBe(300000);
  });
  test("returns a month-by-month repayment schedule", async () => {
    const result = await calculateLoanRateMock({ loanAmount: 60_000, loanTerm: 12, creditScore: 700, loanType: "personal_loan" });
    expect(result.paymentSchedule).toHaveLength(12);
    expect(result.paymentSchedule[result.paymentSchedule.length - 1]?.balance).toBe(0);
    expect(result.totalRepayment).toBeGreaterThan(60_000);
  });

  test("returns validation rules in the documented nested shape", async () => {
    const result = await getValidationRulesMock();
    expect(result.rules.personalInfo.age.min).toBe(18);
    expect(result.rules.financialInfo.monthlyIncome.min).toBe(5000);
    expect(result.rules.loanDetails.loanTerm.max).toBe(60);
  });
});
