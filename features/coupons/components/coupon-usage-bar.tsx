type CouponUsageBarProps = {
  usedCount: number;
  maxUsage: number;
};

export function CouponUsageBar({
  usedCount,
  maxUsage,
}: CouponUsageBarProps) {
  if (maxUsage === 0) {
    return <span className="text-sm">∞</span>;
  }

  const percentage = Math.min((usedCount / maxUsage) * 100, 100);

  return (
    <div className="flex min-w-32 items-center gap-2">
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Coupon usage"
        aria-valuemin={0}
        aria-valuemax={maxUsage}
        aria-valuenow={Math.min(usedCount, maxUsage)}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm">
        {usedCount} / {maxUsage}
      </span>
    </div>
  );
}
