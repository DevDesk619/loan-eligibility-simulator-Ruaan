import type { LoanPurpose, LoanType } from "../../types";

export interface LoanTypeConfiguration {
  label: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  terms: readonly number[];
  purposes: readonly { value: LoanPurpose; label: string }[];
}

export const LOAN_CONFIG: Record<LoanType, LoanTypeConfiguration> = {
  personal_loan: {
    label: "Personal loan",
    minAmount: 5_000,
    maxAmount: 300_000,
    minTerm: 6,
    maxTerm: 60,
    terms: [6, 12, 18, 24, 36, 48, 60],
    purposes: [
      { value: "home_improvement", label: "Home improvement" },
      { value: "debt_consolidation", label: "Debt consolidation" },
      { value: "education", label: "Education" },
      { value: "medical", label: "Medical expenses" },
      { value: "other", label: "Something else" },
    ],
  },
  vehicle_loan: {
    label: "Vehicle loan",
    minAmount: 50_000,
    maxAmount: 1_500_000,
    minTerm: 12,
    maxTerm: 72,
    terms: [12, 18, 24, 36, 48, 60, 72],
    purposes: [
      { value: "new_vehicle", label: "New vehicle" },
      { value: "used_vehicle", label: "Used vehicle" },
    ],
  },
};
