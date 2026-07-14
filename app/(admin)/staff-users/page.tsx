import StaffUsersFeature from "@/features/staff-users";
import { loadStaffUsersParams } from "@/features/staff-users/hooks/use-staff-users-params";

type StaffUsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function StaffUsersPage({
  searchParams,
}: StaffUsersPageProps) {
  const params = await loadStaffUsersParams.parse(searchParams);

  return <StaffUsersFeature searchParams={params} />;
}
