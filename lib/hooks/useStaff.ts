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
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryedList, setQueryedList] = useState<any[]>([]);

  const { mutateAsync: AddStaff } = useMutation(staff.addStaff);
  const { mutateAsync: UpdatePermission } = useMutation(staff.updatePermission);
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

  function handleSearch(query: string) {
    if (!query) return;

    setIsQuerying(true);
    setSearch(query);

    const filteredData = staffData?.data?.filter((value: any) => {
      return (
        value?.email.toLowerCase().includes(query.toLowerCase()) ||
        value?.firstName?.toLowerCase().includes(query.toLowerCase()) ||
        value?.lastName?.toLowerCase().includes(query)
      );
    });

    const updatedFilteredData = {
      ...staffData,
      data: filteredData,
    };

    setQueryedList(updatedFilteredData);
  }

  return {
    staffData,
    loadingStaff,
    refetchStaffData,
    refetchPermissionList,
    permissionList: permissionList?.data,
    AddStaff,
    AddNewPermission,
    UpdatePermission,
    SuspendStaff,
    perPage,
    setPerPage,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    queryedList,
    isQuerying,
    handleSearch,
    setIsQuerying,
  };
};

export default useStaff;
