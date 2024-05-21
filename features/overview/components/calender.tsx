"use client";
import React, { useState } from "react";
import CalendarIcon from "./calender-icon";

const generateDateRange = (startDate: Date, endDate: Date): string => {
  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedEndDate = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${formattedStartDate} - ${formattedEndDate}`;
};

// Default usage:
const startDate = new Date("2023-12-01");
const endDate = new Date("2023-12-30");

const Calender = () => {
  const defaultDateRange = generateDateRange(startDate, endDate);
  // State for seting date
  const [dateRange, setdateRange] = useState<string>(defaultDateRange);
  return (
    <div className="flex bg-white p-3 items-center gap-2 rounded-md">
      <CalendarIcon />
      <p className="text-[rgb(119,119,119)] text-[13px] mt-[2px]">
        {dateRange}
      </p>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        className="cursor-pointer"
      >
        <path
          d="M20 3H19V1H17V3H7V1H5V3H4C2.9 3 2 3.9 2 5V21C2 22.1 2.9 23 4 23H20C21.1 23 22 22.1 22 21V5C22 3.9 21.1 3 20 3ZM20 21H4V10H20V21ZM20 8H4V5H20V8Z"
          fill="#555555"
        />
      </svg>
    </div>
  );
};

export default Calender;
