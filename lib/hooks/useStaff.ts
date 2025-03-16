"use client";

import React, { useState } from "react";
import { staff } from "../api/staff";
import { permissions } from "../api/permissions";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

const useStaff = () => {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page") || 1;
  const perPage = searchParams.get("perPage") || 10;
  const [search, setSearch] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryedList, setQueryedList] = useState<any[]>([]);

  const { mutateAsync: AddStaff } = useMutation(staff.addStaff);
  const { mutateAsync: UpdatePermission } = useMutation(staff.updatePermission);
  const { mutateAsync: SuspendStaff } = useMutation(staff.suspendStaff);
  const { mutateAsync: AddNewPermission } = useMutation(
    permissions.addPermission
  );

  // teams mutation
  const { mutateAsync: createTeam } = useMutation(staff.createTeam);
  const { mutateAsync: editTeamInfo } = useMutation(staff.updateTeamDetails);
  const { mutateAsync: editTeamPermission } = useMutation(
    staff.updateTeamPermissions
  );
  const { mutateAsync: deleteTeam } = useMutation(staff.deleteTeam);

  const { mutateAsync: addStaffToTeam } = useMutation(staff.addStaffToTeam);

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
    data: teamsData,
    isLoading: isLoadingTeams,
    refetch: refetchTeams,
  } = useQuery(
    ["teams"],
    () => {
      return staff.getTeams();
    },
    {
      cacheTime: 3000,
      staleTime: 3000,
      refetchOnWindowFocus: true,
      select: (data) => data?.data,
    }
  );

  // const { data: teamData, isLoading: isLoadingTeam } = useQuery(
  //   ["team", id],
  //   () => {
  //     return staff.getTeamDetails(id);
  //   },
  //   {
  //     cacheTime: 30000,
  //     staleTime: 30000,
  //     refetchOnWindowFocus: true,
  //     select: (data) => data?.data,
  //     enabled: Boolean(id),
  //   }
  // );

  const {
    data: permissionList,
    refetch: refetchPermissionList,
    isLoading: loadingPermissions,
  } = useQuery(
    ["Permissions"],
    () => {
      return permissions.getPermissions(Number(perPage), Number(currentPage));
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
    currentPage,
    search,
    setSearch,
    queryedList,
    isQuerying,
    handleSearch,
    setIsQuerying,
    teamsData,
    isLoadingTeams,
    createTeam,
    editTeamInfo,
    editTeamPermission,
    deleteTeam,
    addStaffToTeam,
    refetchTeams,

    // teamData,
    // isLoadingTeam,
  };
};

export default useStaff;
