"use client";
import React, { useState, useEffect } from "react";
import Header from "../layout/header/header";
import Searchbar from "../layout/header/components/searchbar";
import PageBody from "../shared/page-body/page-body";
// import JobsTable from "./components/table";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import {
  JobIcon,
  CompletedState,
  QuotesGivenMetrics,
  AverageDisputeResolutionTimeMetrics,
} from "@/public/svg";
import userPic from "@/public/admin-pic.png";
import LoadingTemplate from "../layout/loading";

import Filter from "@/app/_components/Filter";
import { useSearchParams } from "next/navigation";
import { useSortedData } from "@/lib/hooks/useSortedData";
import { downloadPDF } from "@/lib/utils/downloadPdf";
import { trimString } from "@/lib/utils/trim-string";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import JobsTable from "./components/table";
import AnalyticCard from "../jobs/components/analytic-card";
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
  } = useSortedData("jobdays");

  // console.log(sortedData);

  useEffect(() => {
    isQuerying ? setDataToRender(queryedList) : setDataToRender(sortedData);
  }, [isQuerying, queryedList, setDataToRender, sortedData]);

  const totalJobs = sortedData?.data?.totalItems;
  const stats = sortedData?.data?.stats;

  const isLoading = loadingSortedData || loading;

  const columns = [
    "Customer’s Name",
    "Job ID",
    "Contractors’s Name",
    "Job Category",

    "Job Address",
    "Date",
    "Job Status",
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
    trimString(item?.job?.category, 22),

    trimString(item?.jobLocation?.address, 22),
    formatDateToDDMMYY(item?.createdAt),
    trimString(item?.status, 22),
  ]);

  function handleDownloadPdf() {
    downloadPDF(columns, rows, "JobDays.pdf", "Job Days List");
  }

  const analyticCards = [
    {
      icon: <JobIcon />,
      iconColor: "bg-[#C398C7]",
      borderColor: "border-l-[#721279]",
      name: "Total Booked Jobs",
      info: stats?.allJobdays,
      tip: "The total contractor trips started",
    },
    {
      icon: <QuotesGivenMetrics />, // Placeholder icon for submitted jobs
      iconColor: "bg-[#bdecc6]",
      borderColor: "border-l-[#04ddae]",
      name: "Total Arrivals",
      info: stats?.totalArrived?.toLocaleString(),
      quotes: "Total Quotes",
      tip: "The total contractor trips waiting confirmation",
    },
    {
      icon: <AverageDisputeResolutionTimeMetrics />,
      iconColor: "bg-[#f3f5d4]",
      borderColor: "border-l-[#e7cb2c]",
      name: "Total Jobs Started",
      info: stats?.totalStarted?.toLocaleString(),
      tip: "The total number of jobs started",
    },
    {
      icon: <CompletedState />,
      borderColor: "border-l-[#326602]",
      name: "Total confirmed Arrivals",
      info: stats?.totalConfirmed?.toLocaleString(),
      iconColor: "bg-[#bdecc6]",
      tip: "The total contractor trips confirmed by Customer",
    },
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
                tip={card?.tip}
              />
            ))}
          </div>
        </div>
        {/* Job Table */}
        <div className="my-10 flex flex-col">
          <div className="self-end mb-7">
            <DownloadButton
              text="Download JOB DAYS LIST"
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
