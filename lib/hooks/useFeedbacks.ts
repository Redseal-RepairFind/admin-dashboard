"use client";

import { useMutation, useQuery } from "react-query";
import { feedbacks } from "../api/feedbacks";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { useLoader } from "@/context/LoaderContext";

const useFeedbacks = () => {
  const [status, setStatus] = useState("OPEN");
  const { handleNavigation } = useLoader();
  const searchParams = useSearchParams();

  const router = useRouter();
  const pathname = usePathname();

  const initialString = searchParams.get("feedbackStatus");
  const initialSortValue =
    searchParams.get("feedbackStatus")?.replace(/_/g, " ") || "OPEN";

  const [sortValue, setSortValue] = useState(initialSortValue);

  useEffect(() => {
    const sortFromParam = searchParams.get("feedbackStatus");
    if (sortFromParam) {
      const updatedSortValue = sortFromParam.replace(/_/g, " ");
      setSortValue(updatedSortValue); // Update state based on URL query params
    }
  }, [searchParams]);

  // Function to update the URL params and the state
  function updateUrlParams(value: string) {
    const formattedValue = value.replace(/ /g, "_").toLowerCase(); // Replace spaces with underscores

    // Update the URL query parameters
    if (value === "OPEN") {
      router.replace(`${pathname}`, {
        scroll: false,
      }); // Remove query params if 'All' is selected (default)
    } else {
      const params = new URLSearchParams(window.location.search);
      params.set("feedbackStatus", formattedValue); // Set the selected filter in query params
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }

    // Set the selected value in the state
    setSortValue(value);
    setStatus(value);
  }

  function handleSinglePageRoute(id: string) {
    handleNavigation(`/feedbacks/${id}`);
  }

  const statuse = searchParams.get("feedbackStatus") || "OPEN";
  const { mutateAsync: acceptFeedback, isLoading: acceptingFeedback } =
    useMutation(feedbacks.acceptFeedback);
  const { mutateAsync: replyFeedback, isLoading: replyingFeedback } =
    useMutation(feedbacks.replyFeedback);

  const { feedbackId } = useParams();

  // console.log(feedbackId);
  const { isLoading: loadingFeedbacks, data: feedbackData } = useQuery(
    ["feedbacks"],
    () => feedbacks.getFeedbacks()
  );

  const {
    isLoading: loadingDetails,
    data: singleFeedBack,
    refetch: refetchSingleFeedback,
  } = useQuery(
    ["feedbackDetails", feedbackId],
    () => feedbacks.getFeedbackDetails(feedbackId.toString()),
    {
      enabled: Boolean(feedbackId),
    }
  );

  return {
    loadingFeedbacks,
    feedbackData,
    loadingDetails,
    singleFeedBack,
    acceptFeedback,
    replyFeedback,
    updateUrlParams,
    handleSinglePageRoute,
    sortValue,
    refetchSingleFeedback,
    acceptingFeedback,
    replyingFeedback,
  };
};

export default useFeedbacks;
