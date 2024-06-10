import React, { useState } from "react";
import { staff } from "../api/staff";
import { permissions } from "../api/permissions";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useStaff = () => {
  const { mutateAsync: AddStaff } = useMutation(staff.addStaff);
  const { mutateAsync: AddPermission } = useMutation(staff.addStaffPermission);
  const { mutateAsync: RemovePermission } = useMutation(
    staff.removeStaffPermission
  );
  const { mutateAsync: SuspendStaff } = useMutation(staff.suspendStaff);

  const { data: staffData, isLoading: loadingStaff } = useQuery(
    ["Staff"],
    () => {
      return staff.getStaff();
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  const { data: permissionList, isLoading: loadingPermissions } = useQuery(
    ["Permissions"],
    () => {
      return permissions.getPermissions();
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  const router = useRouter();

  return {
    staffData,
    loadingStaff,
    permissionList: permissionList?.permissions,
    AddStaff,
    AddPermission,
    RemovePermission,
    SuspendStaff,
  };
};

export default useStaff;
