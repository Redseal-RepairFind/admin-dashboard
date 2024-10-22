"use client";
import React, { useEffect, useMemo, useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import CustomersTable from "./components/table";
import PageHeading from "../shared/page-body/page-heading";
import LoadingTemplate from "../layout/loading";
import useCustomers from "@/lib/hooks/useCustomers";

import Filter from "@/app/_components/Filter";
import AnalyticCard from "../jobs/components/analytic-card";
import { Customers as CustomerIcon, QuotesGivenMetrics } from "@/public/svg";
import { useSearchParams } from "next/navigation";
import { filterData } from "./hooks/filterByDate";
import { useSortedData } from "@/lib/hooks/useSortedData";
import DownloadButton from "../shared/page-body/download-button";
import { downloadPDF } from "@/lib/utils/downloadPdf";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";

type FilterData = {
  customers: any[];
  totalCustomer: number; // Assuming totalCustomer is a number
};
const Customers = () => {
  // Fetching customers data

  const [dataToRender, setDataToRender] = useState<any>();

  const {
    sortedData,
    loadingSortedData,
    handleQuery,
    setIsQuerying,
    isQuerying,
    queryedList,
  } = useSortedData("customers");

  useEffect(() => {
    isQuerying ? setDataToRender(queryedList) : setDataToRender(sortedData);
  }, [isQuerying, queryedList, setDataToRender, sortedData]);

  const [loading, setLoading] = useState(true);

  // Getting filter params from URL
  const params = useSearchParams();
  const filterString = params.get("sort");

  const mainData = sortedData?.data;

  const totalCustumers = mainData?.totalItems;
  const customersWithBookings = mainData?.stats?.customersWithBooking;

  // console.log(sortedData);

  const columns = ["Customer's Name", "Date Joined", "Email", "Phone Number"];

  const rows = sortedData?.data?.data?.map((item: any) => [
    item?.name,
    formatDateToDDMMYY(item.createdAt),
    item?.email,
    `${item?.phoneNumber?.code} ${item?.phoneNumber?.number}`,
  ]);

  function handleDownloadPdf() {
    downloadPDF(columns, rows, "customers.pdf", "Customer's List");
  }

  // console.log()

  return (
    <>
      <Header />
      {loadingSortedData ? (
        <LoadingTemplate />
      ) : (
        <PageBody>
          <div className="flex justify-between mb-6 items-center">
            <PageHeading page_title="Customers" />
            <Filter />
            <DownloadButton
              text="Download Customer's LIST"
              onClick={handleDownloadPdf}
            />
          </div>

          <div className="overflow-x-auto mb-6">
            <div className="flex gap-8 min-w-[1200px]">
              <AnalyticCard
                icon={<CustomerIcon />}
                iconColor="bg-[#C398C7]"
                borderColor="border-l-[#721279]"
                name="Total Customers"
                info={totalCustumers?.toLocaleString()}
              />
              <AnalyticCard
                icon={<QuotesGivenMetrics />}
                iconColor="bg-[#d0f7d0]"
                borderColor="border-l-[#0D8012]"
                name="Total Customers with bookings"
                info={customersWithBookings?.toLocaleString()}
              />
            </div>
          </div>

          <CustomersTable
            filteredData={dataToRender}
            setLoading={setLoading}
            handleSearch={handleQuery}
            setIsQuerying={setIsQuerying}
          />
        </PageBody>
      )}
    </>
  );
};

export default Customers;
