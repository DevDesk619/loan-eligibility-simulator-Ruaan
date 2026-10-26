import type {
  EligibilityRequest, EligibilityResponse, LoanFormValues, LoanProductsResponse,
  RateCalculationRequest, RateCalculationResponse, ValidationRulesResponse,
} from "../types";
import { apiClient } from "../api/client";

// Importing this module registers the local Axios mock routes when mock mode is enabled.
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== "false";

async function initialiseMockApi(): Promise<void> {
  if (USE_MOCK_API) {
    // Await registration so the first request cannot race the mock setup.
    await import("../api/mockAdapter");
  }
}

export function toEligibilityRequest(values: LoanFormValues): EligibilityRequest {
  return {
    personalInfo: { age: values.age, employmentStatus: values.employmentStatus, employmentDuration: values.employmentDuration },
    financialInfo: { monthlyIncome: values.monthlyIncome, monthlyExpenses: values.monthlyExpenses, existingDebt: values.existingDebt, creditScore: values.creditScore },
    loanDetails: { requestedAmount: values.requestedAmount, loanTerm: values.loanTerm, loanPurpose: values.loanPurpose, loanType: values.loanType },
  };
}

/** All UI-facing service functions use the same typed HTTP client. */
export async function checkEligibility(values: LoanFormValues): Promise<EligibilityResponse> {
  await initialiseMockApi();
  const response = await apiClient.post<EligibilityResponse>("/api/loans/eligibility", toEligibilityRequest(values));
  return response.data;
}

export async function getLoanProducts(): Promise<LoanProductsResponse> {
  await initialiseMockApi();
  const response = await apiClient.get<LoanProductsResponse>("/api/loans/products");
  return response.data;
}

export async function calculateLoanRate(request: RateCalculationRequest): Promise<RateCalculationResponse> {
  await initialiseMockApi();
  const response = await apiClient.post<RateCalculationResponse>("/api/loans/calculate-rate", request);
  return response.data;
}

export async function getValidationRules(): Promise<ValidationRulesResponse> {
  await initialiseMockApi();
  const response = await apiClient.get<ValidationRulesResponse>("/api/loans/validation-rules");
  return response.data;
}
