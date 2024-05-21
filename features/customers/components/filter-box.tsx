"use client";
import React, { useRef, useState } from "react";

interface IProps {
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  handleRatingFiltering?: (value: number) => void;
  handleYearFiltering: (value: number) => void;
  handleMonthFiltering: (value: number) => void;
  availableYears: number[];
}

const FilterBox: React.FC<IProps> = ({
  setShowFilters,
  handleRatingFiltering,
  handleYearFiltering,
  handleMonthFiltering,
  availableYears,
}) => {
  const [dropDateSelect, setDropDateSelect] = useState(false);
  const [dropRatingSelect, setDropRatingSelect] = useState(false);

  const handleRatingChange = (value: number) => {
    if (handleRatingFiltering) handleRatingFiltering(value);
  };

  const handleYearChange = (value: number) => {
    handleYearFiltering(value);
  };

  const handleMonthChange = (value: number) => {
    handleMonthFiltering(value);
  };

  const clearFilter = () => {
    handleYearFiltering(0);
    handleMonthFiltering(0);
    setShowFilters(false);
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

  return (
    <>
      <div className="">
        <button
          type="button"
          className="font-[500] text-[#555] border border-[#555]
           py-1 w-full rounded-md text-center outline-none"
          onClick={() => setDropDateSelect(!dropDateSelect)}
        >
          Date Joined
        </button>

        {dropDateSelect && (
          <div className={`flex flex-col gap-4 mt-4`}>
            <div className="">
              <label className="mb-1 block">Select Year:</label>
              <div className="bg-[#f0f0f0] pl-2 pr-2 py-1 rounded-md">
                <select
                  className="bg-transparent pr-2 outline-none w-full"
                  onChange={(e) => handleYearChange(+e.target.value)}
                >
                  <option value="">All Years</option>
                  {availableYears?.map((year) => (
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
                  onChange={(e) => handleMonthChange(+e.target.value)}
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
          </div>
        )}
      </div>

      {handleRatingFiltering && (
        <div className="">
          <button
            type="button"
            className="font-[500] text-[#555] border border-[#555]
           py-1 w-full rounded-md text-center outline-none mt-4 mb-1"
            onClick={() => setDropRatingSelect(!dropRatingSelect)}
          >
            Rating
          </button>

          {dropRatingSelect && (
            <div className={`flex flex-col gap-4 mt-3`}>
              <div className="">
                <label className="mb-1 block">Select Rating:</label>
                <div className="bg-[#f0f0f0] pl-2 pr-2 py-1 rounded-md">
                  <select
                    onChange={(e) => handleRatingChange(+e.target.value)}
                    className="bg-transparent pr-2 outline-none w-full"
                  >
                    <option value={0}>No Stars</option>
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
