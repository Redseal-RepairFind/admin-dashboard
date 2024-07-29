"use client";

import { dispute } from "../api/dispute";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

const useDisputes = () => {
  const [status, setStatus] = useState("OPEN");

  const { mutateAsync: AcceptDispute } = useMutation(dispute.acceptDispute);
  const { mutateAsync: SettleDispute } = useMutation(dispute.settleDispute);
  const { mutateAsync: SendMessage } = useMutation(dispute.sendMessage);

  const { id } = useParams();

  const {
    data: disputes,
    isLoading: loadingDisputes,
    refetch,
  } = useQuery(
    ["Dispute List", status],
    () => {
      return dispute.getDisputes({ status });
    },
    { cacheTime: 10000, staleTime: 10000, refetchOnWindowFocus: true }
  );

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
          singleDispute?.data?.conversations?.customerContractorConversation?.id
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
    setStatus,
    disputes,
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
  };
};

export default useDisputes;
