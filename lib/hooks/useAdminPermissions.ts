import { useQuery } from "react-query";
import { permissions } from "../api/permissions";
import { fetchPermissionsFromAPI } from "../api/fetchPermissions";
import { useSearchParams } from "next/navigation";

function useAdminPermissions() {
  const params = useSearchParams();
  const page = params.get("page") || 1;
  const perPage = params.get("perPage") || 10;
  const { isLoading: loadingPermission, data: adminPermissions } = useQuery(
    ["my-permissions"],
    () => {
      return permissions.getMyPermissions(Number(perPage), Number(page));
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  return {
    loadingPermission,
    adminPermissions,
  };
}

export default useAdminPermissions;
