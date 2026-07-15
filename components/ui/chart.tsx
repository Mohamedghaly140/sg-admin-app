"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

const THEMES = { light: "", dark: ".dark" } as const
const INITIAL_DIMENSION = { width: 320, height: 200 } as const

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>

type ChartContextValue = {
  config: ChartConfig
}

type ChartTooltipPayload = {
  color?: string
  dataKey?: number | string
  name?: number | string
  value?: number | string
}

type ChartTooltipContentProps = {
  active?: boolean
  label?: React.ReactNode
  labelFormatter?: (label: React.ReactNode) => React.ReactNode
  payload?: readonly ChartTooltipPayload[]
  valueFormatter?: (value: number | string) => React.ReactNode
  className?: string
}

const ChartContext = React.createContext<ChartContextValue | null>(null)

function useChart(): ChartContextValue {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
  initialDimension?: {
    width: number
    height: number
  }
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-layer]:outline-hidden [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme ?? itemConfig.color,
  )

  if (colorConfig.length === 0) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
      itemConfig.color

    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  className,
}: ChartTooltipContentProps) {
  const { config } = useChart()

  if (!active || !payload?.length) {
    return null
  }

  const formattedLabel = labelFormatter ? labelFormatter(label) : label

  return (
    <div
      className={cn(
        "grid min-w-32 gap-1.5 rounded-lg border bg-background px-2.5 py-2 text-xs shadow-xl",
        className,
      )}
    >
      {formattedLabel ? <p className="font-medium">{formattedLabel}</p> : null}
      <div className="grid gap-1.5">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name ?? "value")
          const itemConfig = config[key]
          const value = item.value ?? 0

          return (
            <div key={key} className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-xs"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="text-muted-foreground">
                {itemConfig?.label ?? item.name ?? key}
              </span>
              <span className="ml-auto font-mono font-medium tabular-nums">
                {valueFormatter ? valueFormatter(value) : value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }
