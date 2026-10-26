import { CheckCircle2, CircleHelp, Clock3, Sparkles, WalletCards } from "lucide-react";
import MetricCard from "./MetricCard";
import { formatMoney, formatPercent } from "../utils/formatters";
import type { EligibilityResponse } from "../types";

interface EligibilityResultsProps {
  result: EligibilityResponse | null;
  loanTerm: number;
}

export default function EligibilityResults({ result, loanTerm }: EligibilityResultsProps) {
  const eligible = result?.eligibilityResult.isEligible ?? false;

  return (
    <aside className="results-column" aria-live="polite" aria-atomic="true">
      <div className="results-panel">
        <div className="results-topline"><span className="results-icon"><Sparkles size={17} /></span><span>YOUR ESTIMATE</span><span className="live-dot" /></div>
        {!result ? (
          <div className="empty-results">
            <div className="empty-illustration"><div className="empty-circle"><WalletCards size={34} /></div><span className="empty-star star-one">✦</span><span className="empty-star star-two">✳</span></div>
            <h2>Your next step,<br />made clearer.</h2>
            <p>Complete your details and check eligibility to see your estimated results right here.</p>
            <div className="preview-list"><div><span className="preview-check"><CheckCircle2 size={15} /></span><span>Eligibility likelihood</span><span className="preview-placeholder" /></div><div><span className="preview-check"><CheckCircle2 size={15} /></span><span>Estimated monthly payment</span><span className="preview-placeholder" /></div><div><span className="preview-check"><CheckCircle2 size={15} /></span><span>Affordability snapshot</span><span className="preview-placeholder" /></div></div>
          </div>
        ) : (
          <div className="result-content">
            <div className={`eligibility-status ${eligible ? "status-good" : "status-review"}`}><span className="status-symbol">{eligible ? <CheckCircle2 size={18} /> : <CircleHelp size={18} />}</span><span>{eligible ? "Looks promising" : "Needs a closer look"}</span></div>
            <p className="result-explainer">{result.eligibilityResult.decisionReason}</p>
            <div className="likelihood-row"><div><span>Estimated approval likelihood</span><strong>{result.eligibilityResult.approvalLikelihood}%</strong></div><div className="likelihood-track" role="progressbar" aria-label="Estimated approval likelihood" aria-valuemin={0} aria-valuemax={100} aria-valuenow={result.eligibilityResult.approvalLikelihood}><span style={{ width: `${result.eligibilityResult.approvalLikelihood}%` }} /></div></div>
            <div className="payment-highlight"><span>Estimated monthly repayment</span><strong>{formatMoney(result.recommendedLoan.monthlyPayment)}</strong><small>For {loanTerm} months · {formatPercent(result.recommendedLoan.interestRate)} estimated annual interest</small></div>
            <div className="result-metrics"><MetricCard label="Possible loan amount" value={formatMoney(result.recommendedLoan.maxAmount)} icon="↗" /><MetricCard label="Total repayment" value={formatMoney(result.recommendedLoan.totalRepayment)} icon="⌁" /></div>
            <div className="affordability-box"><div><span className="affordability-label">AFFORDABILITY SNAPSHOT</span><span className={`score-pill score-${result.affordabilityAnalysis.affordabilityScore}`}>{result.affordabilityAnalysis.affordabilityScore}</span></div><div className="affordability-stat"><span>Disposable income</span><strong>{formatMoney(result.affordabilityAnalysis.disposableIncome)}</strong></div><div className="affordability-stat"><span>Debt-to-income ratio</span><strong>{formatPercent(result.affordabilityAnalysis.debtToIncomeRatio)}</strong></div><div className="affordability-stat"><span>Risk category</span><strong className="capitalize">{result.eligibilityResult.riskCategory}</strong></div></div>
            <p className="result-footnote">Illustrative demo only — not a lending decision or guarantee of approval.</p>
          </div>
        )}
      </div>
      <div className="help-card"><div className="help-icon"><Clock3 size={19} /></div><div><strong>Good decisions take a little clarity.</strong><p>Try adjusting your loan amount or term to compare estimates.</p></div></div>
    </aside>
  );
}
