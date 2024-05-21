"use client";
import React from "react";
import { DoughnutChart, HalfDoughnutChart } from "./doughnut-chart";
import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";

const JobStatus = () => {
  const { details } = useAppSelector((state: RootState) => state.overviewTotal);
  const calculatePercentage = (number: number) => {
    return Math.floor((number / details.totalJob) * 100);
  };
  return (
    <div className="w-[40%] bg-white px-8 pt-6 pb-3 rounded-md min-w-[450px]">
      <p className="font-[600] uppercase">JOB STATUS</p>
      <div className="-mt-10">
        <HalfDoughnutChart
          name="Total Jobs"
          color="#333333"
          percent={details.totalJob}
        />
      </div>
      <div className="grid grid-cols-4">
        <DoughnutChart
          color="#024E82"
          percent={calculatePercentage(details.totalPendingJob)}
          name="Pending"
          detail={details.totalPendingJob}
        />
        <DoughnutChart
          color="#0D8012"
          percent={calculatePercentage(details.totalCompletedJob)}
          name="Successful"
          detail={details.totalCompletedJob}
        />
        <DoughnutChart
          color="#9A0101"
          percent={calculatePercentage(details.totalComplainedJob)}
          name="Complaints"
          detail={details.totalComplainedJob}
        />
        <DoughnutChart
          color="#E9D502"
          percent={calculatePercentage(details.totalProgressJob)}
          name="In Progress"
          detail={details.totalProgressJob}
        />
      </div>
    </div>
  );
};

export default JobStatus;
