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
  SignUpMetrics,
} from "@/public/svg";

import useAnalytics from "@/lib/hooks/useAnalytics";
import LoadingTemplate from "../layout/loading";
import { dynaMetrycs } from "@/features/overview/components/dummyMetrics";
import { useSortedData } from "@/lib/hooks/useSortedData";

const Overview = () => {
  const { data, isLoading, dummyMetrics, loadingMetrics, getMetric } =
    useAnalytics();

  // const { jobs, currentPage, setCurrentPage, perPage, setPerPage } =
  //   useAnalytics();
  const {
    sortedData: jobs,
    queryedList,
    isQuerying,
    loadingSortedData,
  } = useSortedData("jobs");

  // Initialize with the correct default data
  const [dataToRender, setDataToRender] = useState<any>(
    isQuerying ? queryedList : jobs
  );

  useEffect(() => {
    // Update data based on `isQuerying` state
    setDataToRender(isQuerying ? queryedList : jobs);
  }, [isQuerying, queryedList, jobs]);

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      if (Notification?.permission !== "granted") {
        Notification?.requestPermission();
      }
    } else {
      console.warn("Browser does not support notifications.");
    }
  }, []);

  const loading = isLoading || loadingMetrics || loadingSortedData;
  const [metricText, setMetricText] = useState("");

  const { metryc, metrycSTotal } = getMetric(metricText);

  const combinedMetrics = [
    {
      svg: <TotalCustomers />,
      svgColor: "bg-[#C398C7]",
      name: "Total Customers",
      numbers: data?.totalCustomers?.toLocaleString(),
      percent: 3.6,
      route: "/customers",
    },

    {
      svg: <TotalContractors />,
      svgColor: "bg-[#AAB2D4]",
      name: "Total Contractors",
      numbers: data?.totalContractors?.toLocaleString(),
      percent: 3.6,
      route: "/contractors",
    },

    {
      svg: <TotalRevenue />,
      svgColor: "bg-[#E3C87C]",
      name: "Total Revenue",
      numbers: data?.totalRevenue?.toLocaleString(),
      percent: 3.6,
      route: "/transactions",
    },

    {
      svg: <TotalJobs />,
      svgColor: "bg-[#bbbbbbbb]",
      name: "Total Jobs",
      numbers: data?.totalJob?.toLocaleString(),
      percent: -3.6,
      route: "/jobs",
    },
  ];

  return (
    <>
      <Header />

      {loading && <LoadingTemplate />}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Overview" />
          {/* <Calender /> */}
        </div>
        {/* Analytic Cards */}
        {/* Negative value on percent props will be red */}
        <div className="overflow-x-auto mb-6">
          <div className="grid grid-cols-4 gap-5 min-w-[1200px]">
            {/* <AnalyticCard
              svg={<TotalCustomers />}
              svgColor="bg-[#C398C7]"
              name="Total Customers"
              numbers={data?.totalCustomers?.toLocaleString()}
              percent={3.6}
              route="/customers"
            />
            <AnalyticCard
              svg={<TotalContractors />}
              svgColor="bg-[#AAB2D4]"
              name="Total Contractors"
              numbers={data?.totalContractors?.toLocaleString()}
              percent={3.6}
              route="/contractors"
            />
            <AnalyticCard
              svg={<TotalRevenue />}
              svgColor="bg-[#E3C87C]"
              name="Total Revenue"
              numbers={data?.totalRevenue?.toLocaleString()}
              percent={3.6}
              route="/transactions"
            />
            <AnalyticCard
              svg={<TotalJobs />}
              svgColor="bg-[#BBBBBB]"
              name="Total Jobs"
              numbers={data?.totalJob?.toLocaleString()}
              percent={-3.6}
              route="/jobs"
            /> */}

            {combinedMetrics.map((item) => (
              <AnalyticCard
                key={item.name}
                svg={item.svg}
                svgColor={item.svgColor}
                name={item.name}
                numbers={item.numbers}
                percent={item.percent}
                route={item.route}
              />
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="flex gap-6 justify-between w-full mb-6 overflow-x-auto">
          <Metrics />
          <JobStatus />
        </div>
        <OverviewTable dataToRender={dataToRender} />
      </PageBody>
    </>
  );
};

export default Overview;
