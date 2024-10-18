"use client";
import React, { useEffect, useState } from "react";
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
} from "@/public/svg";
import { useSearchParams } from "next/navigation";
import { useSortedData } from "@/lib/hooks/useSortedData";
import useAnalyticData from "@/lib/hooks/useCustomersData";
import AnalyticCard from "../jobs/components/analytic-card";

const Contractors = () => {
  const {
    sortedData,
    loadingSortedData,
    isQuerying,
    queryedList,
    handleQuery,
    setIsQuerying,
  } = useSortedData("contractors");

  const [loading, setLoading] = useState(true);
  const [dataToRender, setDataToRender] = useState<any>();

  const totalContractors = sortedData?.data.totalItems;

  // const { loadingContractors } = useContractors();

  const stats = sortedData?.data?.stats;

  useEffect(() => {
    isQuerying ? setDataToRender(queryedList) : setDataToRender(sortedData);
  }, [isQuerying, queryedList, setDataToRender, sortedData]);

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
            <DownloadButton text="Download Contractor’S LIST" />
          </div>
          <div className="overflow-x-auto mb-6">
            <div className="flex gap-8 min-w-[1200px]">
              <AnalyticCard
                icon={<CustomerIcon />}
                iconColor="bg-[#C398C7]"
                borderColor="border-l-[#721279]"
                name="Total Contractors"
                info={totalContractors?.toLocaleString()}
              />

              <AnalyticCard
                icon={<CompletedState />}
                iconColor="bg-[#dcffde]"
                borderColor="border-l-[#0D8012]"
                name="Verifed Contractors"
                info={stats?.verifiedContractors?.toLocaleString()}
              />
              <AnalyticCard
                icon={<ComplaintsState />}
                iconColor="bg-[#f7a7a7]"
                borderColor="border-l-[#9A0101]"
                name="Unverified Contractors"
                info={stats?.unVerifiedContractors?.toLocaleString()}
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
