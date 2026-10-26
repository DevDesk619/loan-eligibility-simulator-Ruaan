/** Standard amortising-loan payment formula. Rates are annual percentages, terms are months. */
export function calculateMonthlyPayment(principal: number, annualRate: number, months: number): number {
  if (![principal, annualRate, months].every(Number.isFinite) || principal <= 0 || months <= 0 || annualRate < 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  const factor = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
