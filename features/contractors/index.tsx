"use client";
import React, { useState, useEffect } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import ContractorsTable from "./components/table";
import useContractors from "@/lib/hooks/useContractors";

import Filter from "@/app/_components/Filter";
import {
  Contractors as CustomerIcon,
  CompletedState,
  ComplaintsState,
  JobIcon,
  CancelIconRed,
} from "@/public/svg";
import { useSearchParams } from "next/navigation";
import { useSortedData } from "@/lib/hooks/useSortedData";
import AnalyticCard from "../jobs/components/analytic-card";
import { downloadPDF } from "@/lib/utils/downloadPdf";

const Contractors = () => {
  const [loading, setLoading] = useState(true);

  const {
    sortedData,
    loadingSortedData,
    handleQuery,
    setIsQuerying,
    isQuerying,
    queryedList,
  } = useSortedData("contractors");
  const [dataToRender, setDataToRender] = useState<any>();

  const totalContractors = sortedData?.data.totalItems;

  // const { loadingContractors } = useContractors();

  const stats = sortedData?.data?.stats;

  // console.log(sortedData);

  useEffect(() => {
    isQuerying ? setDataToRender(queryedList) : setDataToRender(sortedData);
  }, [isQuerying, queryedList, setDataToRender, sortedData]);

  const columns = [
    "Contractor's Name",
    "Skill",
    "Status",
    "Email",
    "Stage",
    "Ratings",
  ];

  const rows = sortedData?.data?.data?.map((item: any) => [
    item?.name,
    item?.profile?.skill === undefined ? "Not Submitted" : item?.profile?.skill,
    item?.accountStatus,
    item?.email,
    item?.onboarding?.stage?.label,
    item?.rating,
  ]);

  function handleDownloadPdf() {
    downloadPDF(columns, rows, "Contractors.pdf", "Contractor's List");
  }

  return (
    <>
      <Header />
      {loadingSortedData ? (
        <LoadingTemplate />
      ) : (
        <PageBody>
          <div className="flex justify-between mb-6 items-center">
            <PageHeading page_title="Contractors" />
            <Filter />
            <DownloadButton
              text="Download Contractor’S LIST"
              onClick={handleDownloadPdf}
            />
          </div>
          <div className="overflow-x-auto mb-6">
            <div className="flex gap-8 min-w-[1200px]">
              <AnalyticCard
                icon={<CustomerIcon />}
                iconColor="bg-[#C398C7]"
                borderColor="border-l-[#721279]"
                name="Total Contractors"
                info={stats?.total?.toLocaleString()}
              />

              <AnalyticCard
                icon={<CompletedState />}
                iconColor="bg-[#dcffde]"
                borderColor="border-l-[#0D8012]"
                name="Approved Contractors"
                info={stats?.approved?.toLocaleString()}
              />
              <AnalyticCard
                icon={<CancelIconRed />}
                iconColor="bg-[#f7a7a7]"
                borderColor="border-l-[#9A0101]"
                name="Suspended Contractors"
                info={stats?.suspended?.toLocaleString()}
              />

              <AnalyticCard
                icon={<JobIcon />}
                iconColor="bg-[#edf793]"
                borderColor="border-l-[#d1be12]"
                name="Contractors under Review"
                info={stats?.reviewing?.toLocaleString()}
              />

              <AnalyticCard
                icon={<ComplaintsState />}
                iconColor="bg-[#493b3b]"
                borderColor="border-l-[#5a5555]"
                name="Blacklisted Contractors"
                info={stats?.blacklisted?.toLocaleString()}
              />
            </div>
          </div>
          <ContractorsTable
            setLoading={setLoading}
            contractorData={dataToRender}
            handleSearch={handleQuery}
            setIsQuerying={setIsQuerying}
          />
        </PageBody>
      )}
    </>
  );
};

export default Contractors;
