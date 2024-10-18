"use client";
import React, { useState } from "react";
import Header from "../layout/header/header";
import Searchbar from "../layout/header/components/searchbar";
import PageBody from "../shared/page-body/page-body";
import JobsTable from "./components/table";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import Calender from "../overview/components/calender";
import AnalyticCard from "./components/analytic-card";
import {
  CancelIconBlue,
  CancelIconRed,
  JobIcon,
  CompletedState,
  QuotesGivenMetrics,
  DisputesInitiatedMetrics,
  DisputesResolvedMetrics,
  ComplaintsState,
  AverageDisputeResolutionTimeMetrics,
  EmergencyCallMetrics,
} from "@/public/svg";
import userPic from "@/public/admin-pic.png";
import LoadingTemplate from "../layout/loading";

import Filter from "@/app/_components/Filter";
import { useSearchParams } from "next/navigation";
import { useSortedData } from "@/lib/hooks/useSortedData";
import useAnalyticData from "@/lib/hooks/useCustomersData";
const Jobs = () => {
  const [loading, setLoading] = useState(true);

  const { customerData: jobData, loadingCustomers } = useAnalyticData("jobs");

  const totalJobs = jobData?.data?.totalItems;
  const stats = jobData?.data?.stats;

  const isLoading = loadingCustomers || loading;

  return (
    <>
      <Header />
      {/* Page Body - Use for side padding on the top and sides */}
      {isLoading && <LoadingTemplate />}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Jobs" />
        </div>
        {/* Analytic Cards */}
        <div className="overflow-x-auto mb-6">
          <div className="flex flex-wrap gap-8 min-w-[1200px]">
            <AnalyticCard
              icon={<JobIcon />}
              iconColor="bg-[#C398C7]"
              borderColor="border-l-[#721279]"
              name="Total jobs"
              info={totalJobs}
            />

            <AnalyticCard
              icon={<CompletedState />}
              borderColor="border-l-[#326602]"
              name="Total completed Jobs"
              info={stats?.totalCompleted?.toLocaleString()}
              iconColor="bg-[#bdecc6]"
            />

            <AnalyticCard
              icon={<QuotesGivenMetrics />}
              borderColor="border-l-[#d8cb12]"
              name="Total Booked Jobs"
              info={stats?.totalBooked?.toLocaleString()}
              iconColor="bg-[#ebf375]"
            />
            <AnalyticCard
              icon={<CancelIconBlue />}
              iconColor="bg-[#AAB2D4]"
              borderColor="border-l-[#00235B]"
              name="Total Disputed Jobs"
              info={stats?.totalDisputed?.toLocaleString()}
            />
            <AnalyticCard
              icon={<CancelIconRed />}
              iconColor="bg-[#F6B7B7]"
              borderColor="border-l-[#9A0101]"
              name="Total Cancelled Jobs"
              info={stats?.totalCanceled?.toLocaleString()}
            />

            <AnalyticCard
              icon={<DisputesInitiatedMetrics />}
              iconColor="bg-[#bbc0cf]"
              borderColor="border-l-[#0c062e]"
              name="Total Pending Jobs"
              info={stats?.totalPending?.toLocaleString()}
            />

            <AnalyticCard
              icon={<ComplaintsState />}
              iconColor="bg-[#d6e2e6]"
              borderColor="border-l-[#015043]"
              name="Total Expired Jobs"
              info={stats?.totalExpired?.toLocaleString()}
            />

            <AnalyticCard
              icon={<AverageDisputeResolutionTimeMetrics />}
              iconColor="bg-[#f3f5d4]"
              borderColor="border-l-[#e7cb2c]"
              name="Total Jobs in Progress"
              info={stats?.totalOngoing?.toLocaleString()}
            />

            <AnalyticCard
              icon={<EmergencyCallMetrics />}
              iconColor="bg-[#d48bc4]"
              borderColor="border-l-[#e72c99]"
              name="Total Jobs Open"
              info={stats?.totalNotStarted?.toLocaleString()}
            />
          </div>
        </div>
        {/* Job Table */}
        <div className="my-10 flex flex-col">
          <div className="self-end mb-7">
            <DownloadButton text="Download JOB LIST" />
          </div>

          <JobsTable setLoading={setLoading} />
        </div>
      </PageBody>
    </>
  );
};

export default Jobs;
