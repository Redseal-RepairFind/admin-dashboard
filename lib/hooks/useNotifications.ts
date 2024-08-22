"use client";

import { notifications } from "../api/notifications";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useNotifications = () => {
  const {
    data,
    isLoading: loadingNotifications,
    refetch,
  } = useQuery(
    ["Notifications"],
    () => {
      return notifications.getNotifications();
    },
    {
      cacheTime: 30000,
      staleTime: 30000,
      select: (data) => data?.data,
      refetchOnWindowFocus: true,
    }
  );

  const { mutateAsync: MarkAllAsRead } = useMutation(
    notifications.markAllAsRead
  );

  // console.log(data);

  return {
    data,
    loadingNotifications,
    refetch,
    MarkAllAsRead,
  };
};

export default useNotifications;
