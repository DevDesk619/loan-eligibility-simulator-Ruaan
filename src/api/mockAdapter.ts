import AxiosMockAdapter from "axios-mock-adapter";
import {
  calculateLoanRateMock,
  checkEligibilityMock,
  getLoanProductsMock,
  getValidationRulesMock,
} from "../services/mockLoanService";
import type { EligibilityRequest, LoanFormValues, RateCalculationRequest } from "../types";
import { apiClient } from "./client";

/**
 * Registers deterministic mock endpoints on the shared Axios instance.
 * Keep route handlers thin: domain calculations belong in mockLoanService.
 */
export const mockAdapter = new AxiosMockAdapter(apiClient, { delayResponse: 350 });

mockAdapter.onGet("/api/loans/products").reply(async () => [200, await getLoanProductsMock()]);
mockAdapter.onGet("/api/loans/validation-rules").reply(async () => [200, await getValidationRulesMock()]);

mockAdapter.onPost("/api/loans/eligibility").reply(async (config) => {
  try {
    const request = JSON.parse(config.data ?? "{}") as EligibilityRequest;
    const formValues: LoanFormValues = {
      age: request.personalInfo.age,
      employmentStatus: request.personalInfo.employmentStatus,
      employmentDuration: request.personalInfo.employmentDuration,
      monthlyIncome: request.financialInfo.monthlyIncome,
      monthlyExpenses: request.financialInfo.monthlyExpenses,
      existingDebt: request.financialInfo.existingDebt,
      creditScore: request.financialInfo.creditScore,
      requestedAmount: request.loanDetails.requestedAmount,
      loanTerm: request.loanDetails.loanTerm,
      loanPurpose: request.loanDetails.loanPurpose,
      loanType: request.loanDetails.loanType ?? "personal_loan",
    };
    return [200, await checkEligibilityMock(formValues)];
  } catch {
    return [400, { message: "Invalid eligibility request payload." }];
  }
});

mockAdapter.onPost("/api/loans/calculate-rate").reply(async (config) => {
  try {
    const request = JSON.parse(config.data ?? "{}") as RateCalculationRequest;
    return [200, await calculateLoanRateMock(request)];
  } catch {
    return [400, { message: "Invalid rate calculation request payload." }];
  }
});
