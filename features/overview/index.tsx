"use client";
import React, { useEffect, useState } from "react";
import Header from "../layout/header/header";
import Searchbar from "../layout/header/components/searchbar";
import PageBody from "../shared/page-body/page-body";
import OverviewTable from "./components/table";
import PageHeading from "../shared/page-body/page-heading";
import Calender from "./components/calender";
import Metrics from "./components/metrics";
import JobStatus from "./components/job-status";
import AnalyticCard from "./components/analytic-card";
import {
  TotalContractors,
  TotalCustomers,
  TotalJobs,
  TotalRevenue,
} from "@/public/svg";

import LoadingTemplate from "../layout/loading";
import useAnalytics from "@/lib/hooks/useAnalytics";

const Overview = () => {
  const { data, isLoading } = useAnalytics();

  // console.log(data);

  return (
    <>
      <Header />

      {isLoading && <LoadingTemplate />}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Overview" />
          {/* <Calender /> */}
        </div>
        {/* Analytic Cards */}
        {/* Negative value on percent props will be red */}
        <div className="overflow-x-auto mb-6">
          <div className="grid grid-cols-4 gap-5 min-w-[1200px]">
            <AnalyticCard
              svg={<TotalCustomers />}
              svgColor="bg-[#C398C7]"
              name="Total Customers"
              numbers={data?.totalCustomers}
              percent={3.6}
              route="/customers"
            />
            <AnalyticCard
              svg={<TotalContractors />}
              svgColor="bg-[#AAB2D4]"
              name="Total Contractors"
              numbers={data?.totalContractors}
              percent={3.6}
              route="/contractors"
            />
            <AnalyticCard
              svg={<TotalRevenue />}
              svgColor="bg-[#E3C87C]"
              name="Total Revenue"
              numbers={data?.totalRevenue}
              percent={3.6}
              route="/transactions"
            />
            <AnalyticCard
              svg={<TotalJobs />}
              svgColor="bg-[#BBBBBB]"
              name="Total Jobs"
              numbers={data?.totalJob}
              percent={-3.6}
              route="/jobs"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="flex gap-6 justify-between w-full mb-6 overflow-x-auto">
          <Metrics />
          <JobStatus />
        </div>
        <OverviewTable />
      </PageBody>
    </>
  );
};

export default Overview;
