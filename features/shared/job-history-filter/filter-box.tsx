"use client";
import React, { useRef, useState } from "react";

interface IProps {
  handleFilter: (type: "status" | "types", value: string) => void;
  availableYears?: number[];
}

const FilterBox: React.FC<IProps> = ({ handleFilter, availableYears }) => {
  const [dropDateSelect, setDropDateSelect] = useState(false);
  const [dropRatingSelect, setDropRatingSelect] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleYearChange = (value: string) => {
    handleFilter("types", value);
  };

  const handleMonthChange = (value: string) => {
    handleFilter("status", value);
  };

  const clearFilter = () => {
    handleFilter("types", "");
    handleFilter("status", "");
    setShowFilters(false);
  };

  const status = [
    // "January",
    // "February",
    // "March",
    // "April",
    // "May",
    // "June",
    // "July",
    // "August",
    // "September",
    // "October",
    // "November",
    // "December",
    "CANCELED",
    "COMPLETED_SITE_VISIT",
    "SUBMITTED",
    "ACCEPTED",
    "EXPIRED",
  ];

  const types = ["LISTING", "REQUEST"];

  return (
    <>
      <div className="">
        <button
          type="button"
          className="font-[500] text-[#555] border border-[#555]
           py-1 w-full rounded-md text-center outline-none"
          onClick={() => setDropDateSelect(!dropDateSelect)}
        >
          Status / Types
        </button>

        {dropDateSelect && (
          <div className={`flex flex-col gap-4 mt-4`}>
            <div className="">
              <label className="mb-1 block">Select Year:</label>
              <div className="bg-[#f0f0f0] pl-2 pr-2 py-1 rounded-md">
                <select
                  className="bg-transparent pr-2 outline-none w-full"
                  onChange={(e) => handleYearChange(e.target.value)}
                >
                  <option value="">All </option>
                  {types?.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="">
              <label className="mb-1 block">Select Month:</label>
              <div className="bg-[#f0f0f0] pl-2 pr-2 py-1 rounded-md">
                <select
                  className="bg-transparent pr-2 outline-none w-full"
                  onChange={(e) => handleMonthChange(e.target.value)}
                >
                  <option value="">All </option>
                  {status.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className="font-[500] text-[#fff] border border-[#555]
           py-1 w-full rounded-md text-center outline-none mt-4 bg-[#555]/70"
        onClick={clearFilter}
      >
        Clear
      </button>
    </>
  );
};

export default FilterBox;
