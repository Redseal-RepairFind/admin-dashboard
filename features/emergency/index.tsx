"use client";
import React, { useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import EmergencyTable from "./components/EmergencyTable";

import Filter from "@/app/_components/Filter";
import {
  DisputesInitiatedMetrics,
  DisputesResolvedMetrics,
  ComplaintsState,
  AverageDisputeResolutionTimeMetrics,
  EmergencyCallMetrics,
} from "@/public/svg";
import { useSearchParams } from "next/navigation";
import { useSortedData } from "@/lib/hooks/useSortedData";
import useAnalyticData from "@/lib/hooks/useCustomersData";
import AnalyticCard from "../jobs/components/analytic-card";

const Index = () => {
  const [loading, setLoading] = useState(false);

  const { sortedData, loadingSortedData } = useSortedData("emergencies");

  const totalDisputes = sortedData?.data.totalItems;
  const stats = sortedData?.data?.stats;

  console.log(stats);

  return (
    <>
      <Header />
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Disputes" />
          <Filter />
        </div>
        <div className="overflow-x-auto mb-6">
          <div className="flex gap-8 min-w-[1200px]">
            <AnalyticCard
              icon={<EmergencyCallMetrics />}
              iconColor="bg-[#dfacaa]"
              borderColor="border-l-[#b42b08]"
              name="Total Emergencies"
              info={totalDisputes?.toLocaleString()}
            />
            <AnalyticCard
              icon={<DisputesResolvedMetrics />}
              iconColor="bg-[#dcffde]"
              borderColor="border-l-[#0D8012]"
              name="Total Resolved Disputes"
              info={stats?.totalResolved}
            />
            <AnalyticCard
              icon={<AverageDisputeResolutionTimeMetrics />}
              iconColor="bg-[#f8fa99]"
              borderColor="border-l-[#f1d900]"
              name="Total Ongoing Disputes"
              info={stats?.totalInProgress}
            />

            <AnalyticCard
              icon={<ComplaintsState />}
              iconColor="bg-[#f7a7a7]"
              borderColor="border-l-[#9A0101]"
              name="Total Pending Disputes"
              info={stats?.totalPending}
            />
          </div>
        </div>
        <EmergencyTable setLoading={setLoading} />
      </PageBody>
    </>
  );
};

export default Index;
