"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type DistributionBarSegment = {
  label: string;
  value: number;
};

type DistributionBarProps = {
  labelledBy: string;
  segments: DistributionBarSegment[];
};

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
] as const;

const percentFormatter = new Intl.NumberFormat("en-EG", {
  style: "percent",
  maximumFractionDigits: 1,
});

export function DistributionBar({
  labelledBy,
  segments,
}: DistributionBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  if (total <= 0) {
    return null;
  }

  const keyedSegments = segments.map((segment, index) => ({
    ...segment,
    color: chartColors[index % chartColors.length],
    key: `segment${index}`,
  }));
  const chartConfig: ChartConfig = Object.fromEntries(
    keyedSegments.map((segment) => [
      segment.key,
      { label: segment.label, color: segment.color },
    ]),
  );
  const chartData = [
    Object.fromEntries([
      ["name", "Distribution"],
      ...keyedSegments.map((segment) => [segment.key, segment.value]),
    ]),
  ];

  function formatValue(value: number | string): string {
    const count = Number(value);
    return `${count.toLocaleString("en-EG")} (${formatPercent(count / total)})`;
  }

  return (
    <div className="flex flex-col gap-4">
      <ChartContainer
        config={chartConfig}
        className="h-12 w-full min-w-0 aspect-auto"
        initialDimension={{ width: 320, height: 48 }}
        role="group"
        aria-labelledby={labelledBy}
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          stackOffset="expand"
          barSize={28}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis type="number" domain={[0, 1]} hide />
          <YAxis type="category" dataKey="name" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent valueFormatter={formatValue} />}
          />
          {keyedSegments.map((segment, index) => (
            <Bar
              key={segment.key}
              dataKey={segment.key}
              stackId="distribution"
              fill={`var(--color-${segment.key})`}
              radius={getSegmentRadius(index, keyedSegments.length)}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ChartContainer>

      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
        {keyedSegments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-xs"
              style={{ backgroundColor: segment.color }}
              aria-hidden="true"
            />
            <span className="text-muted-foreground">{segment.label}</span>
            <span className="font-mono font-medium tabular-nums">
              {formatPercent(segment.value / total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatPercent(value: number): string {
  return percentFormatter.format(value);
}

function getSegmentRadius(
  index: number,
  segmentCount: number,
): [number, number, number, number] {
  if (segmentCount === 1) {
    return [4, 4, 4, 4];
  }
  if (index === 0) {
    return [4, 0, 0, 4];
  }
  if (index === segmentCount - 1) {
    return [0, 4, 4, 0];
  }
  return [0, 0, 0, 0];
}
