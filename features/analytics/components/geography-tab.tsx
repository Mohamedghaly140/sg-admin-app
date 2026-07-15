import { handleAuthError } from "@/lib/api/handle-auth-error";

import type { AnalyticsParams } from "../hooks/use-analytics-params";
import { getGeographyAnalytics } from "../queries/get-geography-analytics";
import { GeographyChart } from "./geography-chart";

type GeographyTabProps = {
  params: Pick<AnalyticsParams, "from" | "to">;
};

export async function GeographyTab({ params }: GeographyTabProps) {
  let response: Awaited<ReturnType<typeof getGeographyAnalytics>>;

  try {
    response = await getGeographyAnalytics(params);
  } catch (error) {
    handleAuthError(error);
  }

  return <GeographyChart data={response.data.rows} />;
}
