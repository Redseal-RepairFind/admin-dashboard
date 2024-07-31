"use client";

import React, { useState } from "react";
import { staff } from "../api/staff";
import { permissions } from "../api/permissions";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useStaff = () => {
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const { mutateAsync: AddStaff } = useMutation(staff.addStaff);
  const { mutateAsync: AddPermission } = useMutation(staff.addStaffPermission);
  const { mutateAsync: RemovePermission } = useMutation(
    staff.removeStaffPermission
  );
  const { mutateAsync: SuspendStaff } = useMutation(staff.suspendStaff);
  const { mutateAsync: AddNewPermission } = useMutation(
    permissions.addPermission
  );

  const {
    data: staffData,
    refetch: refetchStaffData,
    isLoading: loadingStaff,
  } = useQuery(
    ["Staff", currentPage, perPage, search],
    () => {
      return staff.getStaff({
        page: currentPage,
        limit: perPage,
        search,
      });
    },
    {
      cacheTime: 30000,
      staleTime: 30000,
      refetchOnWindowFocus: true,
      select: (data) => data?.data,
    }
  );

  const {
    data: permissionList,
    refetch: refetchPermissionList,
    isLoading: loadingPermissions,
  } = useQuery(
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
    refetchStaffData,
    refetchPermissionList,
    permissionList: permissionList?.data,
    AddStaff,
    AddPermission,
    AddNewPermission,
    RemovePermission,
    SuspendStaff,
    perPage,
    setPerPage,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
  };
};

export default useStaff;
