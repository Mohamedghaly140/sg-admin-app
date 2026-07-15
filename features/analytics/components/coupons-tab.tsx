import { handleAuthError } from "@/lib/api/handle-auth-error";
import { formatEGP } from "@/lib/format";

import type { AnalyticsParams } from "../hooks/use-analytics-params";
import { getCouponsAnalytics } from "../queries/get-coupons-analytics";
import { AnalyticsKpiCards } from "./analytics-kpi-cards";
import { CouponsTable } from "./coupons-table";

type CouponsTabProps = {
  params: Pick<AnalyticsParams, "from" | "to">;
};

export async function CouponsTab({ params }: CouponsTabProps) {
  let response: Awaited<ReturnType<typeof getCouponsAnalytics>>;

  try {
    response = await getCouponsAnalytics(params);
  } catch (error) {
    handleAuthError(error);
  }

  const { data } = response;

  return (
    <div className="flex flex-col gap-4">
      <AnalyticsKpiCards
        items={[
          { label: "Total coupons (all time)", value: data.totalCoupons },
          {
            label: "Redemptions (all statuses)",
            value: data.totalRedemptions,
          },
          {
            label: "Discount given (all statuses)",
            value: data.totalDiscountGiven,
            formatter: formatEGP,
          },
        ]}
      />
      <CouponsTable coupons={data.coupons} />
    </div>
  );
}
