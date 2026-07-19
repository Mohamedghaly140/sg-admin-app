type LeaderboardBarProps = {
  value: number;
  max: number;
};

export function LeaderboardBar({ value, max }: LeaderboardBarProps) {
  const percentage =
    max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      className="h-1.5 w-24 overflow-hidden rounded-full bg-muted"
      aria-hidden="true"
    >
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
