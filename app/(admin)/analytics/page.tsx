import AnalyticsFeature from "@/features/analytics";
import { loadAnalyticsParams } from "@/features/analytics/hooks/use-analytics-params";

type AnalyticsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const params = await loadAnalyticsParams.parse(searchParams);

  return <AnalyticsFeature params={params} />;
}
