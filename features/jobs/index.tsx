"use client";
import React, { useState, useEffect } from "react";
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
  JobsStartedMetrics,
} from "@/public/svg";
import userPic from "@/public/admin-pic.png";
import LoadingTemplate from "../layout/loading";

import Filter from "@/app/_components/Filter";
import { useSearchParams } from "next/navigation";
import { useSortedData } from "@/lib/hooks/useSortedData";
import { downloadPDF } from "@/lib/utils/downloadPdf";
import { trimString } from "@/lib/utils/trim-string";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
const Jobs = () => {
  const [loading, setLoading] = useState(true);
  const [dataToRender, setDataToRender] = useState<any>();

  const {
    sortedData,
    loadingSortedData,
    handleQuery,
    setIsQuerying,
    isQuerying,
    queryedList,
  } = useSortedData("jobs");

  useEffect(() => {
    isQuerying ? setDataToRender(queryedList) : setDataToRender(sortedData);
  }, [isQuerying, queryedList, setDataToRender, sortedData]);

  const totalJobs = sortedData?.data?.totalItems;
  const stats = sortedData?.data?.stats;

  const isLoading = loadingSortedData || loading;

  const columns = [
    "Customer's Name",
    "Job ID",
    "Contractor's Name",
    "Job Address",
    "Date",
    "status",
  ];

  // console.log(sortedData);

  function contName(item: any) {
    const contractorName = `${item?.contractor?.firstName || "--"}  ${
      item?.contractor?.lastName || "--"
    }`;

    return contractorName;
  }

  const rows = sortedData?.data?.data?.map((item: any) => [
    item?.customer?.name,
    trimString(item?._id, 12),
    contName(item),
    trimString(item?.location?.address, 22),
    formatDateToDDMMYY(item?.createdAt),
    trimString(item?.status, 22),
  ]);

  function handleDownloadPdf() {
    downloadPDF(columns, rows, "Job's.pdf", "Job's List");
  }

  const analyticCards = [
    {
      icon: <JobIcon />,
      iconColor: "bg-[#C398C7]",
      borderColor: "border-l-[#721279]",
      name: "Total Jobs",
      info: stats?.allJobs,
    },
    {
      icon: <QuotesGivenMetrics />, // Placeholder icon for submitted jobs
      iconColor: "bg-[#bdecc6]",
      borderColor: "border-l-[#04ddae]",
      name: "Total Job Listings",
      info: stats?.totalJobListing.toLocaleString(),
      mostReq: stats?.totalQuotationsForListings,
      quotes: "Total Quotes",
    },
    {
      icon: <AverageDisputeResolutionTimeMetrics />,
      iconColor: "bg-[#f3f5d4]",
      borderColor: "border-l-[#e7cb2c]",
      name: "Total Job Requests",
      info: stats?.totalJobRequest?.toLocaleString(),
      mostReq: stats?.totalQuotationsForRequests,
      quotes: "Total Quotes",
    },
    {
      icon: <CompletedState />,
      borderColor: "border-l-[#326602]",
      name: "Total Completed Jobs",
      info: stats?.totalCompleted?.total?.toLocaleString(),
      iconColor: "bg-[#bdecc6]",
      percentage: stats?.totalCompleted?.percentage,
    },
    {
      icon: <QuotesGivenMetrics />,
      borderColor: "border-l-[#d8cb12]",
      name: "Total Booked Jobs",
      info: stats?.totalBooked?.total?.toLocaleString(),
      iconColor: "bg-[#ebf375]",
      percentage: stats?.totalBooked?.percentage,
    },
    {
      icon: <CancelIconBlue />,
      iconColor: "bg-[#AAB2D4]",
      borderColor: "border-l-[#00235B]",
      name: "Total Disputed Jobs",
      percentage: stats?.totalDisputed?.percentage,
      info: stats?.totalDisputed?.total?.toLocaleString(),
    },
    {
      icon: <CancelIconRed />,
      iconColor: "bg-[#F6B7B7]",
      borderColor: "border-l-[#9A0101]",
      name: "Total Cancelled Jobs",
      percentage: stats?.totalCanceled?.percentage,
      info: stats?.totalCanceled?.total?.toLocaleString(),
    },
    {
      icon: <DisputesInitiatedMetrics />,
      iconColor: "bg-[#bbc0cf]",
      borderColor: "border-l-[#0c062e]",
      name: "Total Pending Jobs",
      percentage: stats?.totalPending?.percentage,
      info: stats?.totalPending?.total?.toLocaleString(),
    },
    {
      icon: <ComplaintsState />,
      iconColor: "bg-[#d6e2e6]",
      borderColor: "border-l-[#015043]",
      name: "Total Expired Jobs",
      percentage: stats?.totalExpired?.percentage,
      info: stats?.totalExpired?.total?.toLocaleString(),
    },
    {
      icon: <AverageDisputeResolutionTimeMetrics />,
      iconColor: "bg-[#f3f5d4]",
      borderColor: "border-l-[#e7cb2c]",
      name: "Total Jobs in Progress",
      percentage: stats?.totalOngoing?.percentage,
      info: stats?.totalOngoing?.total?.toLocaleString(),
    },
    {
      icon: <EmergencyCallMetrics />,
      iconColor: "bg-[#d48bc4]",
      borderColor: "border-l-[#e72c99]",
      name: "Total Jobs Not Started",
      percentage: stats?.totalNotStarted?.percentage,
      info: stats?.totalNotStarted?.total?.toLocaleString(),
    },
    {
      icon: <QuotesGivenMetrics />, // Placeholder icon for submitted jobs
      iconColor: "bg-[#bdecc6]",
      borderColor: "border-l-[#32a8a8]",
      name: "Total Submitted Jobs",
      info: stats?.totalSubmitted?.total?.toLocaleString(),
      percentage: stats?.totalSubmitted?.percentage,
    },
    {
      icon: <DisputesResolvedMetrics />, // Placeholder icon for accepted jobs
      iconColor: "bg-[#b3d9e2]",
      borderColor: "border-l-[#003366]",
      name: "Total Accepted Jobs",
      info: stats?.totalAccepted?.total?.toLocaleString(),
      percentage: stats?.totalAccepted?.percentage,
    },
    {
      icon: <JobsStartedMetrics />, // Placeholder icon for most requested category
      iconColor: "bg-[#dfb25e]",
      borderColor: "border-l-[#d9882c]",
      name: "Most Requested Category",
      info: stats?.mostRequestedCategory?._id,
      mostReq: stats?.mostRequestedCategory?.count,
      // percentage: stats?.totalAccepted?.percentage,
    },
    // {
    //   icon:  <div>
    //       <img
    //         src={stats.topRatedContractor.profilePhoto.url}
    //         alt="Top Rated Contractor"
    //         className="w-12 h-12 rounded-full"
    //       />
    //     </div>, // Save this as the new icon for top-rated contractor
    //   iconColor: "bg-[#d4e4f3]",
    //   borderColor: "border-l-[#005bb5]",
    //   name: "Top Rated Contractor",
    //   info: (

    //   ),
    // },
  ];

  return (
    <>
      <Header />
      {/* Page Body - Use for side padding on the top and sides */}
      {isLoading && <LoadingTemplate />}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Jobs" />
          <Filter />
        </div>
        {/* Analytic Cards */}
        <div className="overflow-x-auto mb-6">
          <div className="flex flex-wrap gap-8 min-w-[1200px]">
            {analyticCards.map((card, index) => (
              <AnalyticCard
                icon={card?.icon}
                iconColor={card?.iconColor}
                borderColor={card?.borderColor}
                name={card?.name}
                info={card?.info}
                key={index}
                percentage={card?.percentage}
                mostReq={card?.mostReq}
                quotes={card?.quotes}
              />
            ))}
          </div>
        </div>
        {/* Job Table */}
        <div className="my-10 flex flex-col">
          <div className="self-end mb-7">
            <DownloadButton
              text="Download JOB LIST"
              onClick={handleDownloadPdf}
            />
          </div>

          <JobsTable
            setLoading={setLoading}
            filteredData={dataToRender}
            handleSearch={handleQuery}
            setIsQuerying={setIsQuerying}
          />
        </div>
      </PageBody>
    </>
  );
};

export default Jobs;
