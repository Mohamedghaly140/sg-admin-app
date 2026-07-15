import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type AnalyticsKpi = {
  label: string;
  value: number;
  formatter?: (value: number) => string;
};

type AnalyticsKpiCardsProps = {
  items: AnalyticsKpi[];
};

export function AnalyticsKpiCards({ items }: AnalyticsKpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader>
            <CardTitle>
              <h2>{item.label}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold tabular-nums">
              {item.formatter
                ? item.formatter(item.value)
                : item.value.toLocaleString("en-EG")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
