import { ArrowRight, CircleHelp, ShieldCheck } from "lucide-react";
import type { FormEvent } from "react";
import FormField from "./FormField";
import type { LoanFormErrors } from "../utils/validation";
import type { EmploymentStatus, LoanFormValues, LoanPurpose, LoanType } from "../types";
import { formatMoney } from "../utils/formatters";
import { LOAN_CONFIG } from "../features/eligibility/loanConfiguration";

interface LoanApplicationFormProps {
  values: LoanFormValues;
  errors: LoanFormErrors;
  error: string | null;
  loading: boolean;
  disposableIncome: number;
  onChange: <K extends keyof LoanFormValues>(key: K, value: LoanFormValues[K]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}

export default function LoanApplicationForm({ values, errors, error, loading, disposableIncome, onChange, onSubmit, onReset }: LoanApplicationFormProps) {
  const config = LOAN_CONFIG[values.loanType];
  const loanMin = config.minAmount;
  const loanMax = config.maxAmount;
  const terms = config.terms;

  function changeLoanType(nextType: LoanType) {
    onChange("loanType", nextType);
    if (nextType === "vehicle_loan") {
      if (values.requestedAmount < 50_000) onChange("requestedAmount", 50_000);
      if (values.loanTerm < 12) onChange("loanTerm", 12);
      if (!["new_vehicle", "used_vehicle"].includes(values.loanPurpose)) onChange("loanPurpose", "new_vehicle");
    } else {
      if (values.requestedAmount > 300_000) onChange("requestedAmount", 300_000);
      if (values.loanTerm > 60) onChange("loanTerm", 60);
      if (["new_vehicle", "used_vehicle"].includes(values.loanPurpose)) onChange("loanPurpose", "home_improvement");
    }
  }

  return (
    <div className="form-panel">
      <div className="section-heading">
        <div><span className="section-kicker">YOUR DETAILS</span><h2>Let’s see what’s possible</h2><p>Enter a few details to create your personalised estimate.</p></div>
      </div>
      {error ? <div className="form-error" role="alert">{error}</div> : null}
      <form onSubmit={onSubmit} noValidate>
        <section className="form-section" aria-labelledby="about-heading">
          <div className="form-section-title"><span className="section-icon"><span>01</span></span><div><h3 id="about-heading">About you</h3><p>A little about your current situation.</p></div></div>
          <div className="field-grid">
            <FormField label="Your age" id="age" error={errors.age}><input id="age" type="number" min="18" max="65" required value={values.age} aria-invalid={Boolean(errors.age)} onChange={(event) => onChange("age", Number(event.target.value))} /></FormField>
            <FormField label="Employment status" id="employment-status" error={errors.employmentStatus}><select id="employment-status" value={values.employmentStatus} onChange={(event) => onChange("employmentStatus", event.target.value as EmploymentStatus)}><option value="employed">Employed</option><option value="self_employed">Self-employed</option><option value="retired">Retired</option></select></FormField>
            <FormField label="Time in current work (months)" id="employment-duration" hint="Enter 3 or more months where applicable." error={errors.employmentDuration}><input id="employment-duration" type="number" min="0" max="600" required value={values.employmentDuration} aria-invalid={Boolean(errors.employmentDuration)} onChange={(event) => onChange("employmentDuration", Number(event.target.value))} /></FormField>
            <FormField label="Credit score (estimate)" id="credit-score" hint="Typical range: 300–850." error={errors.creditScore}><input id="credit-score" type="number" min="300" max="850" required value={values.creditScore} aria-invalid={Boolean(errors.creditScore)} onChange={(event) => onChange("creditScore", Number(event.target.value))} /></FormField>
          </div>
        </section>

        <section className="form-section" aria-labelledby="finances-heading">
          <div className="form-section-title"><span className="section-icon"><span>02</span></span><div><h3 id="finances-heading">Your monthly finances</h3><p>Use your monthly take-home amounts.</p></div></div>
          <div className="field-grid finances-grid">
            <FormField label="Monthly income (R)" id="monthly-income" error={errors.monthlyIncome}><div className="input-with-prefix"><span aria-hidden="true">R</span><input id="monthly-income" type="number" min="5000" step="100" required value={values.monthlyIncome} aria-invalid={Boolean(errors.monthlyIncome)} onChange={(event) => onChange("monthlyIncome", event.target.value === "" ? "" : Number(event.target.value))} /></div></FormField>
            <FormField label="Monthly expenses (R)" id="monthly-expenses" error={errors.monthlyExpenses}><div className="input-with-prefix"><span aria-hidden="true">R</span><input id="monthly-expenses" type="number" min="0" step="100" required value={values.monthlyExpenses} aria-invalid={Boolean(errors.monthlyExpenses)} onChange={(event) => onChange("monthlyExpenses", event.target.value === "" ? "" : Number(event.target.value))} /></div></FormField>
            <FormField label="Existing debt repayments (R)" id="existing-debt" hint="Total monthly repayments on current debt." error={errors.existingDebt}><div className="input-with-prefix"><span aria-hidden="true">R</span><input id="existing-debt" type="number" min="0" step="100" required value={values.existingDebt === 0 ? "" : values.existingDebt} aria-invalid={Boolean(errors.existingDebt)} onChange={(event) => onChange("existingDebt", event.target.value === "" ? 0 : Number(event.target.value))} /></div></FormField>
            <div className="disposable-preview"><span className="field-label">Estimated money left each month</span><strong className={disposableIncome < 0 ? "negative" : ""}>{formatMoney(disposableIncome)}</strong>{disposableIncome < 0 ? <p className="affordability-warning" role="status">Your monthly expenses and debt repayments exceed your income.</p> : null}</div>
          </div>
        </section>

        <section className="form-section" aria-labelledby="loan-heading">
          <div className="form-section-title"><span className="section-icon"><span>03</span></span><div><h3 id="loan-heading">Loan you have in mind</h3><p>Shape the estimate around your needs.</p></div></div>
          <div className="field-grid">
            <FormField label="Loan type" id="loan-type"><select id="loan-type" value={values.loanType} onChange={(event) => changeLoanType(event.target.value as LoanType)}><option value="personal_loan">Personal loan</option><option value="vehicle_loan">Vehicle loan</option></select></FormField>
            <FormField label="What is it for?" id="loan-purpose" error={errors.loanPurpose}><select id="loan-purpose" value={values.loanPurpose} onChange={(event) => onChange("loanPurpose", event.target.value as LoanPurpose)}>{config.purposes.map((purpose) => <option key={purpose.value} value={purpose.value}>{purpose.label}</option>)}</select></FormField>
          </div>
          <div className="range-heading"><label htmlFor="loan-amount">How much would you like to borrow?</label><strong>{formatMoney(values.requestedAmount)}</strong></div>
          <input id="loan-amount" className="range-input" type="range" min={loanMin} max={loanMax} step="5000" value={Math.min(loanMax, Math.max(loanMin, values.requestedAmount))} aria-describedby="loan-amount-limits" onChange={(event) => onChange("requestedAmount", Number(event.target.value))} />
          <div className="range-limits" id="loan-amount-limits"><span>{formatMoney(loanMin)}</span><span>{formatMoney(loanMax)}</span></div>
          {errors.requestedAmount ? <p className="field-error" role="alert">{errors.requestedAmount}</p> : null}
          <div className="field-grid loan-bottom-grid">
            <FormField label="Repayment period" id="loan-term" error={errors.loanTerm}><select id="loan-term" value={values.loanTerm} onChange={(event) => onChange("loanTerm", Number(event.target.value))}>{terms.map((term) => <option key={term} value={term}>{term} months{term >= 12 ? ` (${term / 12} ${term === 12 ? "year" : "years"})` : ""}</option>)}</select></FormField>
            <div className="loan-tip"><CircleHelp size={17} /><p>Longer terms can lower monthly repayments, but may increase the total interest you pay.</p></div>
          </div>
        </section>

        <div className="form-actions"><button type="button" className="button-secondary" onClick={onReset} disabled={loading}>Reset form</button><button type="submit" className="button-primary" disabled={loading || disposableIncome < 0}>{loading ? "Calculating…" : "Check my eligibility"}<ArrowRight size={17} /></button></div>
        <p className="form-disclaimer"><ShieldCheck size={14} /> Your information stays in this demo and is not saved by the app.</p>
      </form>
    </div>
  );
}
