"use client";
import React, { useEffect, useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import DisputeTable from "./components/DisputeTable";

import Filter from "@/app/_components/Filter";
import {
  DisputesInitiatedMetrics,
  DisputesResolvedMetrics,
  ComplaintsState,
  AverageDisputeResolutionTimeMetrics,
} from "@/public/svg";
// import { useSearchParams } from "next/navigation";
// import { useSortedData } from "@/lib/hooks/useSortedData";
import AnalyticCard from "../jobs/components/analytic-card";
import useDisputes from "@/lib/hooks/useDisputes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Index = () => {
  const router = useRouter();
  const pathname = usePathname();
  const param = useSearchParams();
  // Fetch the initial 'sort' parameter from the URL (query)
  const initialString = param.get("filterByAdmin");
  const status = param.get("status");
  const initialSortValue = initialString
    ? initialString.replace(/_/g, " ")
    : "";

  // Set the selected sort value state, initialize with the value from URL
  const [sortValue, setSortValue] = useState(initialSortValue);

  const [itsSingle, setItsSingle] = useState(false);

  // On page load, ensure the sort value in the state is in sync with URL
  useEffect(() => {
    const sortFromParam = param.get("filterByAdmin");
    if (sortFromParam) {
      const updatedSortValue = sortFromParam.replace(/_/g, " ");
      setSortValue(updatedSortValue);
    }

    if (status?.toLowerCase()?.includes("resolved")) {
      const params = new URLSearchParams(window.location.search);

      // Prevent duplicate "status" values
      params.set("status", status);

      if (itsSingle) {
        params.set("filterByAdmin", "true");
      } else {
        params.delete("filterByAdmin");
      }

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }
  }, [param, itsSingle, status]);

  // Function to update the URL params and the state

  const { sortedData } = useDisputes();
  // console.log(initialString);

  const totalDisputes = sortedData?.data.totalItems;
  const stats = sortedData?.data?.stats;

  return (
    <>
      <Header />
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Disputes" />
          {status?.toLowerCase()?.includes("resolved") ? (
            <div className="flex items-center gap-2 w-full justify-center">
              <p className={`${itsSingle ? "text-gray-800" : "text-gray-400"}`}>
                Resolved by me
              </p>
              <button
                className="w-7 px-0.5 flex items-center h-4 rounded-full relative bg-black"
                onClick={() => {
                  setItsSingle((iss) => !iss);
                }}
              >
                <span
                  className={`h-3 w-3 rounded-full bg-white absolute ${
                    itsSingle ? "left-[1px]" : "right-[1px]"
                  } `}
                />
              </button>
              <p className={`${itsSingle ? "text-gray-400" : "text-gray-800"}`}>
                All
              </p>
            </div>
          ) : null}
          <Filter />
        </div>
        <div className="overflow-x-auto mb-6">
          <div className="flex gap-8 min-w-[1200px]">
            <AnalyticCard
              icon={<DisputesInitiatedMetrics />}
              iconColor="bg-[#ac9191]"
              borderColor="border-l-[#2e0505]"
              name="Total Disputes"
              info={totalDisputes?.toLocaleString()}
              tip="Total disputes"
            />
            <AnalyticCard
              icon={<DisputesResolvedMetrics />}
              iconColor="bg-[#dcffde]"
              borderColor="border-l-[#0D8012]"
              name="Total Resolved Disputes"
              info={stats?.totalResolved}
              tip="Total resolved disputes"
            />
            <AnalyticCard
              icon={<AverageDisputeResolutionTimeMetrics />}
              iconColor="bg-[#f8fa99]"
              borderColor="border-l-[#f1d900]"
              name="Total Ongoing Disputes"
              info={stats?.totalOngoing}
              tip="Total disputes still ongoing"
            />

            <AnalyticCard
              icon={<ComplaintsState />}
              iconColor="bg-[#f7a7a7]"
              borderColor="border-l-[#9A0101]"
              name="Total Unresolved Disputes"
              info={stats?.totalOpen}
              tip="Total disputes not resolved"
            />
          </div>
        </div>
        <DisputeTable />
      </PageBody>
    </>
  );
};

export default Index;
