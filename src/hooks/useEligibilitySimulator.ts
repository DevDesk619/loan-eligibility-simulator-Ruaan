import { useMemo, useState, type FormEvent } from "react";
import { initialLoanFormValues } from "../features/eligibility/formDefaults";
import { checkEligibility } from "../services/loanService";
import { validateLoanForm, type LoanFormErrors } from "../utils/validation";
import type { EligibilityResponse, LoanFormValues } from "../types";

export function useEligibilitySimulator() {
  const [values, setValues] = useState<LoanFormValues>(initialLoanFormValues);
  const [result, setResult] = useState<EligibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<LoanFormErrors>({});

  const disposableIncome = useMemo(
  () => Number(values.monthlyIncome || 0) - Number(values.monthlyExpenses || 0) - Number(values.existingDebt || 0), 
  [values.monthlyIncome,values.monthlyExpenses,values.existingDebt,],);

  function updateField<K extends keyof LoanFormValues>(key: K, value: LoanFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setValidationErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setError(null);
    setResult(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const nextErrors = validateLoanForm(values);
    setValidationErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setResult(null);
      setError("Some details need your attention before we can calculate an estimate.");
      return;
    }

    if (disposableIncome < 0) {
      setResult(null);
      setError("We can't generate an estimate while your monthly expenses and existing debt exceed your income. Please review your figures first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setResult(await checkEligibility(values));
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setValues(initialLoanFormValues);
    setResult(null);
    setError(null);
    setValidationErrors({});
  }

  return { values, result, loading, error, validationErrors, disposableIncome, updateField, submit, reset };
}
