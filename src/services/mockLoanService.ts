import { calculateMonthlyPayment, roundCurrency } from "../utils/loanCalculations";
import { LOAN_CONFIG } from "../features/eligibility/loanConfiguration";
import type {
  EligibilityResponse,
  LoanFormValues,
  LoanProductsResponse,
  RateCalculationRequest,
  RateCalculationResponse,
  ValidationRulesResponse,
} from "../types";

function calculateAffordablePrincipal(monthlyBudget: number, annualRate: number, months: number): number {
  if (monthlyBudget <= 0 || months <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return monthlyBudget * months;
  const factor = (1 + monthlyRate) ** months;
  return monthlyBudget * (factor - 1) / (monthlyRate * factor);
}

function getIllustrativeInterestRate(creditScore: number, loanType: LoanFormValues["loanType"]): number {
  const baseRate = creditScore >= 750 ? 10.5 : creditScore >= 650 ? 12.5 : creditScore >= 550 ? 15.5 : 18.5;
  return loanType === "vehicle_loan" ? Math.max(8.5, baseRate - 1.5) : baseRate;
}

export async function checkEligibilityMock(values: LoanFormValues): Promise<EligibilityResponse> {
  const monthlyIncome = Number(values.monthlyIncome);
  const monthlyExpenses = Number(values.monthlyExpenses);
  const existingDebt = Number(values.existingDebt);
   const disposableIncome = monthlyIncome - monthlyExpenses - existingDebt;
  const debtToIncomeRatio = monthlyIncome > 0 ? (existingDebt / monthlyIncome) * 100 : 100;
  const loanToIncomeRatio = monthlyIncome > 0 ? (values.requestedAmount / (monthlyIncome * 12)) * 100 : 100;
  const interestRate = getIllustrativeInterestRate(values.creditScore, values.loanType);
  const monthlyPayment = roundCurrency(calculateMonthlyPayment(values.requestedAmount, interestRate, values.loanTerm));
  const hasMinimumIncome = monthlyIncome >= 5000;
  const hasDisposableIncome = disposableIncome > monthlyPayment * 1.15;
  const { minAmount: minimumAmount, maxAmount: amountLimit } = LOAN_CONFIG[values.loanType];
  const withinLoanLimit = values.requestedAmount >= minimumAmount && values.requestedAmount <= amountLimit;
  const eligible = hasMinimumIncome && hasDisposableIncome && withinLoanLimit && values.age >= 18 && values.age <= 65;
  const approvalLikelihood = Math.max(5, Math.min(96, Math.round(
    (values.creditScore - 300) / 5.5 +
    (disposableIncome > monthlyPayment * 2 ? 18 : hasDisposableIncome ? 8 : -20) -
    debtToIncomeRatio * 0.25,
  )));
  const riskCategory: EligibilityResponse["eligibilityResult"]["riskCategory"] = approvalLikelihood >= 70 ? "low" : approvalLikelihood >= 40 ? "medium" : "high";
  const affordabilityScore: EligibilityResponse["affordabilityAnalysis"]["affordabilityScore"] =
    hasDisposableIncome && debtToIncomeRatio < 30 ? "good" : disposableIncome > 0 ? "fair" : "poor";

  let decisionReason = "Your income and expenses indicate that the requested repayment may be manageable in this simulator.";
  if (!hasMinimumIncome) decisionReason = "The monthly income entered is below the illustrative minimum of R5,000.";
  else if (!withinLoanLimit) decisionReason = `The requested amount is outside the illustrative limits for this ${values.loanType === "vehicle_loan" ? "vehicle" : "personal"} loan.`;
  else if (!hasDisposableIncome) decisionReason = "Your estimated disposable income may not comfortably cover the monthly repayment.";
  else if (riskCategory === "low") decisionReason = "Your income, credit score and existing debt indicate a comparatively strong profile in this simulator.";

  const affordableMonthlyBudget = Math.max(0, disposableIncome / 1.15);
  const maxAmount = Math.max(0, Math.min(amountLimit, Math.round(calculateAffordablePrincipal(affordableMonthlyBudget, interestRate, values.loanTerm))));
  return {
    eligibilityResult: { isEligible: eligible, approvalLikelihood, riskCategory, decisionReason },
    recommendedLoan: {
      maxAmount,
      recommendedAmount: Math.min(values.requestedAmount, maxAmount),
      interestRate,
      monthlyPayment,
      totalRepayment: roundCurrency(monthlyPayment * values.loanTerm),
    },
    affordabilityAnalysis: { disposableIncome, debtToIncomeRatio, loanToIncomeRatio, affordabilityScore },
  };
}

export async function getLoanProductsMock(): Promise<LoanProductsResponse> {
  return { products: [
    { id: "personal_loan", name: "Personal loan", description: "For planned expenses and personal projects.", minAmount: 5_000, maxAmount: 300_000, minTerm: 6, maxTerm: 60, interestRateRange: { min: 10.5, max: 18.5 }, purposes: ["debt_consolidation", "home_improvement", "education", "medical", "other"] },
    { id: "vehicle_loan", name: "Vehicle loan", description: "For a new or used vehicle.", minAmount: 50_000, maxAmount: 1_500_000, minTerm: 12, maxTerm: 72, interestRateRange: { min: 8.5, max: 15 }, purposes: ["new_vehicle", "used_vehicle"] },
  ] };
}

export async function calculateLoanRateMock(request: RateCalculationRequest): Promise<RateCalculationResponse> {
  const interestRate = getIllustrativeInterestRate(request.creditScore, request.loanType);
  const monthlyPayment = roundCurrency(calculateMonthlyPayment(request.loanAmount, interestRate, request.loanTerm));
  const monthlyRate = interestRate / 100 / 12;
  let balance = request.loanAmount;
  const paymentSchedule = Array.from({ length: request.loanTerm }, (_, index) => {
    const interest = roundCurrency(balance * monthlyRate);
    const principal = index === request.loanTerm - 1
      ? balance
      : roundCurrency(Math.min(balance, monthlyPayment - interest));
    balance = roundCurrency(Math.max(0, balance - principal));
    return {
      month: index + 1,
      payment: roundCurrency(principal + interest),
      principal,
      interest,
      balance,
    };
  });
  const totalRepayment = roundCurrency(paymentSchedule.reduce((total, item) => total + item.payment, 0));
  return {
    interestRate,
    monthlyPayment,
    totalRepayment,
    totalInterest: roundCurrency(totalRepayment - request.loanAmount),
    paymentSchedule,
  };
}

export async function getValidationRulesMock(): Promise<ValidationRulesResponse> {
  return { rules: {
    personalInfo: {
      age: { min: 18, max: 65, required: true, errorMessage: "Age must be between 18 and 65." },
      employmentStatus: { required: true, options: ["employed", "self_employed", "retired"], errorMessage: "Select an employment status." },
      employmentDuration: { min: 3, required: true, errorMessage: "Employment duration must be at least 3 months." },
    },
    financialInfo: {
      monthlyIncome: { min: 5000, required: true, errorMessage: "Monthly income must be at least R5,000." },
      monthlyExpenses: { min: 0, required: true, errorMessage: "Monthly expenses cannot be negative." },
      existingDebt: { min: 0, required: true, errorMessage: "Existing debt repayments cannot be negative." },
      creditScore: { min: 300, max: 850, required: false, errorMessage: "Credit score must be between 300 and 850." },
    },
    loanDetails: {
      requestedAmount: { min: 5000, max: 300000, required: true, errorMessage: "Requested amount must be between R5,000 and R300,000." },
      loanTerm: { min: 6, max: 60, required: true, errorMessage: "Loan term must be between 6 and 60 months." },
    },
  } };
}
