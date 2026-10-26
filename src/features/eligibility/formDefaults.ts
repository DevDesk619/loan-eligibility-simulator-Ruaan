import type { LoanFormValues } from "../../types";

export const initialLoanFormValues: LoanFormValues = {
  age: 32, employmentStatus: "employed", employmentDuration: 36,
  monthlyIncome: 28000, monthlyExpenses: 14500, existingDebt: 2500, creditScore: 680,
  requestedAmount: 120000, loanTerm: 36, loanPurpose: "home_improvement", loanType: "personal_loan",
};
