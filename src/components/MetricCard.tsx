interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
  icon?: string;
}

export default function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        {icon ? <span className="metric-icon" aria-hidden="true">{icon}</span> : null}
      </div>
      <strong className="metric-value">{value}</strong>
      {detail ? <span className="metric-detail">{detail}</span> : null}
    </div>
  );
}
