export default function StatsCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: string | number;
  variant?: string;
}) {
  return (
    <div className={`stat-card ${variant || "primary"}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
