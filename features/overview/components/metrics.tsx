"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CalendarIcon from "./calender-icon";
import { getRevenueAnalysis } from "@/lib/api/api";
type PageDataType = {
  day: string;
  revenue: number;
  job: number;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Metrics = () => {
  const defaultData: PageDataType[] = [
    {
      day: "1 Nov",
      revenue: 590,
      job: 80,
    },
    {
      day: "2 Nov",
      revenue: 600,
      job: 80,
    },
    {
      day: "3 Nov",
      revenue: 808,
      job: 60,
    },
    {
      day: "4 Nov",
      revenue: 1107,
      job: 8,
    },
    {
      day: "5 Nov",
      revenue: 1280,
      job: 80,
    },
    {
      day: "6 Nov",
      revenue: 1320,
      job: 88,
    },
    {
      day: "7 Nov",
      revenue: 1200,
      job: 80,
    },
    {
      day: "8 Nov",
      revenue: 890,
      job: 80,
    },
    {
      day: "9 Nov",
      revenue: 700,
      job: 80,
    },
    {
      day: "10 Nov",
      revenue: 808,
      job: 82,
    },
  ];

  const [dropDateSelect, setDropDateSelect] = useState(false);
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(2);
  const [data, setData] = useState<PageDataType[]>(defaultData);

  const handleGetMetrics = () => {
    getRevenueAnalysis({ month: month, year: year }).then((res) => {
      if (res) {
        console.log(res.response.revenueJob);
        setData(res.response.revenueJob);
      }
    });
  };

  useEffect(() => {
    handleGetMetrics();
  }, []);

  return (
    <div className="w-[60%] bg-white px-8 pt-6 pb-3 rounded-md min-w-[750px]">
      <div className="flex justify-between">
        <p className="font-[600] pb-4">Performance Metrics</p>
        <div className="flex flex-col relative">
          <button
            className="self-end"
            onClick={() => setDropDateSelect(!dropDateSelect)}
          >
            <CalendarIcon />
          </button>
          {dropDateSelect && (
            <div
              className="flex flex-col gap-4 mt-1 bg-[#f0f1f0]
            absolute top-10 right-0 z-10 p-3"
            >
              <div className="">
                <label className="mb-1 block">Select Year:</label>
                <div className="bg-[#fff] rounded-md">
                  <input
                    onChange={(e) => setYear(+e.target.value)}
                    type="text"
                    className="bg-transparent outline-none rounded-md
                    focus:border focus:border-[#333]/30 px-2 py-0.5"
                  />
                </div>
              </div>

              <div className="">
                <label className="mb-1 block">Select Month:</label>
                <div className="bg-[#fff] pl-2 pr-2 py-1 rounded-md">
                  <select
                    className="bg-transparent pr-2 outline-none w-full"
                    onChange={(e) => setMonth(+e.target.value)}
                  >
                    <option value="">All Months</option>
                    {months.map((month, index) => (
                      <option key={month} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleGetMetrics}
                className="bg-[#444] text-white rounded-md p-1"
              >
                Generate
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-10 pb-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-[8px] bg-[#333]"></div>
          <p className="text-sm">Revenue</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-[8px] bg-[#BBBBBB]"></div>
          <p className="text-sm">Jobs</p>
        </div>
      </div>
      <div className="-ml-5">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="1 0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#333"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              strokeWidth={2}
              dataKey="job"
              dot={false}
              stroke="#BBBBBB"
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Metrics;
