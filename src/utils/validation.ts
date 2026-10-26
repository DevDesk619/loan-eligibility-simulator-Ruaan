import type { LoanFormValues } from "../types";
import { LOAN_CONFIG } from "../features/eligibility/loanConfiguration";

export type LoanFormErrors = Partial<Record<keyof LoanFormValues, string>>;

/** Client-side validation for the demo form. The backend remains authoritative in a real integration. */
export function validateLoanForm(values: LoanFormValues): LoanFormErrors {
  const errors: LoanFormErrors = {};
  const config = LOAN_CONFIG[values.loanType];
  const isVehicleLoan = values.loanType === "vehicle_loan";
  const minAmount = config.minAmount;
  const maxAmount = config.maxAmount;
  const minTerm = config.minTerm;
  const maxTerm = config.maxTerm;

  if (!Number.isFinite(values.age) || values.age < 18 || values.age > 65) errors.age = "Age must be between 18 and 65.";
  if (!values.employmentStatus) errors.employmentStatus = "Select an employment status.";
  if (!Number.isFinite(values.employmentDuration) || values.employmentDuration < 3) errors.employmentDuration = "Enter at least 3 months in your current work.";
  if (values.monthlyIncome === "" || !Number.isFinite(values.monthlyIncome) || values.monthlyIncome < 5_000) {errors.monthlyIncome = "Monthly income must be at least R5,000.";}
  if (values.monthlyExpenses === "" ||!Number.isFinite(values.monthlyExpenses) ||values.monthlyExpenses < 0) {errors.monthlyExpenses ="Monthly expenses cannot be negative.";}
  if (values.existingDebt === "" || !Number.isFinite(values.existingDebt) || values.existingDebt < 0) {errors.existingDebt = "Existing debt repayments cannot be negative.";}
  if (!Number.isFinite(values.creditScore) || values.creditScore < 300 || values.creditScore > 850) errors.creditScore = "Credit score must be between 300 and 850.";
  if (!Number.isFinite(values.requestedAmount) || values.requestedAmount < minAmount || values.requestedAmount > maxAmount) errors.requestedAmount = `Loan amount must be between ${minAmount.toLocaleString("en-ZA")} and ${maxAmount.toLocaleString("en-ZA")}.`;
  if (!Number.isFinite(values.loanTerm) || values.loanTerm < minTerm || values.loanTerm > maxTerm) errors.loanTerm = `Choose a term between ${minTerm} and ${maxTerm} months.`;
  if (isVehicleLoan && !["new_vehicle", "used_vehicle"].includes(values.loanPurpose)) errors.loanPurpose = "Choose a vehicle-related loan purpose.";
  if (!isVehicleLoan && ["new_vehicle", "used_vehicle"].includes(values.loanPurpose)) errors.loanPurpose = "Choose a purpose available for a personal loan.";
  return errors;
}
