import { useQuery } from "react-query";
import { permissions } from "../api/permissions";
import { fetchPermissionsFromAPI } from "../api/fetchPermissions";

function useAdminPermissions() {
  const { isLoading: loadingPermission, data: adminPermissions } = useQuery(
    ["my-permissions"],
    () => {
      return permissions.getMyPermissions();
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  return {
    loadingPermission,
    adminPermissions,
  };
}

export default useAdminPermissions;
