export type EmploymentStatus =
  | "employed"
  | "self_employed"
  | "retired";

export type LoanPurpose =
  | "debt_consolidation"
  | "home_improvement"
  | "education"
  | "medical"
  | "new_vehicle"
  | "used_vehicle"
  | "other";

export type LoanType = "personal_loan" | "vehicle_loan";

export interface LoanFormValues {
  age: number;
  employmentStatus: EmploymentStatus;
  employmentDuration: number;
  monthlyIncome: number | "";
  monthlyExpenses: number| "";
  existingDebt: number| "";
  creditScore: number;
  requestedAmount: number;
  loanTerm: number;
  loanPurpose: LoanPurpose;
  loanType: LoanType;
}

export interface EligibilityRequest {
  personalInfo: {
    age: number;
    employmentStatus: EmploymentStatus;
    employmentDuration: number;
  };
  financialInfo: {
    monthlyIncome: number ;
    monthlyExpenses: number ;
    existingDebt: number ;
    creditScore: number;
  };
  loanDetails: {
    requestedAmount: number;
    loanTerm: number;
    loanPurpose: LoanPurpose;
    loanType?: LoanType;
  };
}

export interface EligibilityResponse {
  eligibilityResult: {
    isEligible: boolean;
    approvalLikelihood: number;
    riskCategory: "low" | "medium" | "high";
    decisionReason: string;
  };
  recommendedLoan: {
    maxAmount: number;
    recommendedAmount: number;
    interestRate: number;
    monthlyPayment: number;
    totalRepayment: number;
  };
  affordabilityAnalysis: {
    disposableIncome: number;
    debtToIncomeRatio: number;
    loanToIncomeRatio: number;
    affordabilityScore: "good" | "fair" | "poor";
  };
}

export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  interestRateRange: {
    min: number;
    max: number;
  };
  purposes: LoanPurpose[];
}

export interface LoanProductsResponse {
  products: LoanProduct[];
}

export interface RateCalculationRequest {
  loanAmount: number;
  loanTerm: number;
  creditScore: number;
  loanType: LoanType;
}

export interface PaymentScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface RateCalculationResponse {
  interestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  paymentSchedule: PaymentScheduleItem[];
}

export interface ValidationRule {
  min?: number;
  max?: number;
  required?: boolean;
  options?: string[];
  errorMessage?: string;
}

export interface ValidationRulesResponse {
  rules: {
    personalInfo: Record<string, ValidationRule>;
    financialInfo: Record<string, ValidationRule>;
    loanDetails: Record<string, ValidationRule>;
  };
}
