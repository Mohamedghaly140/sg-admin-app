"use client";

import { Area, AreaChart } from "recharts";

import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";

type KpiSparklineProps = {
  values: number[];
};

const chartConfig = {
  value: {
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function KpiSparkline({ values }: KpiSparklineProps) {
  const data = values.map((value, index) => ({ index, value }));

  return (
    <ChartContainer
      config={chartConfig}
      className="h-10 w-full min-w-0 aspect-auto"
      initialDimension={{ width: 160, height: 40 }}
      aria-hidden="true"
    >
      <AreaChart
        accessibilityLayer={false}
        data={data}
        margin={{ top: 2, right: 1, bottom: 2, left: 1 }}
      >
        <Area
          dataKey="value"
          type="monotone"
          fill="var(--color-value)"
          fillOpacity={0.15}
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={values.length === 1}
          activeDot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
