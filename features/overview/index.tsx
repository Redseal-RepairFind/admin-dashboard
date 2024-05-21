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
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import LoadingTemplate from "../layout/loading";

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const { details } = useAppSelector((state: RootState) => state.overviewTotal);

  return (
    <>
      <Header />
      {/* Page Body - Use for side padding on the top and sides */}
      {loading && <LoadingTemplate />}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Overview" />
          {/* <Calender /> */}
        </div>
        {/* Analytic Cards */}
        {/* Negative value on percent props will be red */}
        <div className="overflow-x-auto mb-6">
          <div className="flex gap-8 min-w-[1200px]">
            <AnalyticCard
              svg={<TotalCustomers />}
              svgColor="bg-[#C398C7]"
              name="Total Customers"
              numbers={details.totalCustomer}
              percent={3.6}
              route="/customers"
            />
            <AnalyticCard
              svg={<TotalContractors />}
              svgColor="bg-[#AAB2D4]"
              name="Total Contractors"
              numbers={details.totalContractor}
              percent={3.6}
              route="/contractors"
            />
            <AnalyticCard
              svg={<TotalRevenue />}
              svgColor="bg-[#E3C87C]"
              name="Total Revenue"
              numbers={details.totalRevenue}
              percent={3.6}
              route="/transactions"
            />
            <AnalyticCard
              svg={<TotalJobs />}
              svgColor="bg-[#BBBBBB]"
              name="Total Jobs"
              numbers={details.totalJob}
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
        <OverviewTable setLoading={setLoading} />
      </PageBody>
    </>
  );
};

export default Overview;
