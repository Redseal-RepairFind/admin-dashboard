"use client";
import React, { useMemo, useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import CustomersTable from "./components/table";
import PageHeading from "../shared/page-body/page-heading";
import LoadingTemplate from "../layout/loading";
import useCustomers from "@/lib/hooks/useCustomers";
import useAnalyticData from "@/lib/hooks/useCustomersData";

import Filter from "@/app/_components/Filter";
import AnalyticCard from "../jobs/components/analytic-card";
import { Customers as CustomerIcon, QuotesGivenMetrics } from "@/public/svg";
import { useSearchParams } from "next/navigation";
import { filterData } from "./hooks/filterByDate";
import { useSortedData } from "@/lib/hooks/useSortedData";

type FilterData = {
  customers: any[];
  totalCustomer: number; // Assuming totalCustomer is a number
};
const Customers = () => {
  // Fetching customers data

  const { sortedData: data, loadingSortedData } = useSortedData("customers");

  const { customerData: jobData, loadingCustomers } =
    useAnalyticData("customers");

  const [loading, setLoading] = useState(true);

  // Getting filter params from URL
  const params = useSearchParams();
  const filterString = params.get("sort");

  const mainData = data?.data;

  const totalCustumers = mainData?.totalItems;
  const customersWithBookings = mainData?.stats?.customersWithBooking;

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

          <CustomersTable filteredData={data} setLoading={setLoading} />
        </PageBody>
      )}
    </>
  );
};

export default Customers;
