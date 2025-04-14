"use client";

import { dispute } from "../api/dispute";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSortedData } from "./useSortedData";

const useDisputes = () => {
  // const sessionStatus =
  //   typeof window !== "undefined"
  //     ? sessionStorage.getItem("session_dispute_status")
  //     : null;
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dataToRender, setDataToRender] = useState<any>();

  // const [status, setStatus] = useState("OPEN");

  const { mutateAsync: AcceptDispute } = useMutation(dispute.acceptDispute);
  const { mutateAsync: SettleDispute } = useMutation(dispute.settleDispute);
  const { mutateAsync: SendMessage } = useMutation(dispute.sendMessage);

  const { id } = useParams();
  const params = useSearchParams();

  const status = params.get("disputeStatus")?.toUpperCase() || "OPEN";
  const filterByAdmin = params.get("filterByAdmin") || "";

  const {
    sortedData,
    loadingSortedData: loadingDisputes,
    handleQuery,
    setIsQuerying,
    isQuerying,
    queryedList,
    refetch,
  } = useSortedData("disputes");

  useEffect(() => {
    isQuerying ? setDataToRender(queryedList) : setDataToRender(sortedData);
  }, [isQuerying, queryedList, setDataToRender, sortedData]);

  // useEffect(() => {
  //   // if (sessionStatus === "OPEN") {
  //   //   // If sessionStatus is "OPEN", render the full data array
  //   //   setDataToRender(sortedData?.data);
  //   // } else

  //   if (sortedData?.data?.data) {
  //     // Filter the data based on sessionStatus
  //     const filteredArray = sortedData.data.data.filter(
  //       (item: any) => item.status.toLowerCase() === status.toLowerCase()
  //     );

  //     // console.log(filteredArray, sessionStatus);

  //     // Clone the sortedData structure and replace only the data field
  //     const updatedFilteredData = {
  //       ...sortedData,
  //       data: {
  //         ...sortedData.data, // Retain other properties of sortedData
  //         data: filteredArray, // Replace only the actual data array
  //       },
  //     };

  //     setDataToRender(updatedFilteredData);
  //   }
  // }, [sessionStatus, sortedData]);

  // const {
  //   data: disputes,
  //   isLoading: loadingDisputes,
  //   refetch,
  // } = useQuery(
  //   ["Dispute List", status, currentPage, perPage, search],
  //   () => {
  //     return dispute.getDisputes({
  //       page: currentPage,
  //       limit: perPage,
  //       search,
  //       status,
  //     });
  //   },
  //   { cacheTime: 10000, staleTime: 10000, refetchOnWindowFocus: true }
  // );

  const {
    data: singleDispute,
    isLoading: loadingSingleDispute,

    refetch: refetchDispute,
  } = useQuery(
    ["Current Dispute", id],
    () => {
      return id && dispute.getSingleDispute(id);
    },
    { cacheTime: 100, staleTime: 100, refetchOnWindowFocus: true }
  );

  const {
    data: conversations,
    // isLoading: loadingDisputes,
    // refetch,
  } = useQuery(
    ["Conversations"],
    () => {
      return dispute.getConversation();
    },
    { cacheTime: 100, staleTime: 100, refetchOnWindowFocus: true }
  );

  const {
    data: messages,
    isLoading: loadingMessages,
    refetch: refetchMessages,
  } = useQuery(
    ["Conversation Messages", singleDispute],
    () => {
      return (
        singleDispute &&
        dispute.getConversationMessages(
          singleDispute?.data?.conversations?.customerContractor?._id
        )
      );
    },
    {
      cacheTime: 100,
      staleTime: 100,
      refetchOnWindowFocus: true,
      select: (data) => data?.data,
      enabled: Boolean(singleDispute),
    }
  );

  const handleAccept = async (id: any) => {
    // console.log(id, "accept");
    toast.loading("Processing...");
    try {
      const data = await AcceptDispute(id);
      //   console.log(data);
      toast.remove();
      toast.success(data?.message);
      setTimeout(() => {
        refetch();
      }, 1000);
    } catch (e: any) {
      console.log(e);
      toast.remove();
      toast.error(e?.response?.data?.message);
    }
  };

  return {
    status,
    // disputes,
    loadingDisputes,
    handleAccept,
    singleDispute,
    loadingSingleDispute,
    refetchDispute,
    SettleDispute,
    messages,
    conversations,
    SendMessage,
    loadingMessages,
    refetchMessages,
    perPage,
    setPerPage,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    dataToRender,
    handleQuery,
    setIsQuerying,
    isQuerying,
    queryedList,
  };
};

export default useDisputes;
