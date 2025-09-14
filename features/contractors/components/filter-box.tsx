"use client";
import React, { useRef, useState } from "react";

interface IProps {
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  handleRatingFiltering?: (value: number) => void;
  handleStatusFiltering: (value: number) => void;
  availableYears: number[];
}

const FilterBox: React.FC<IProps> = ({
  handleRatingFiltering,
  handleStatusFiltering,
  availableYears,
}) => {
  const [dropStatusSelect, setDropStatusSelect] = useState(false);
  const [dropRatingSelect, setDropRatingSelect] = useState(false);

  const handleRatingChange = (value: number) => {
    if (handleRatingFiltering) handleRatingFiltering(value);
  };

  const handleStatusChange = (value: number) => {
    handleStatusFiltering(value);
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
                    <option value="none">All Stars</option>
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

      <div className="">
        <button
          type="button"
          className="font-[500] text-[#555] border border-[#555]
           py-1 w-full rounded-md text-center outline-none mt-4 mb-1"
          onClick={() => setDropStatusSelect(!dropStatusSelect)}
        >
          Status
        </button>

        {dropStatusSelect && (
          <div className={`flex flex-col gap-4 mt-3`}>
            <div className="">
              <label className="mb-1 block">Select Rating:</label>
              <div className="bg-[#f0f0f0] pl-2 pr-2 py-1 rounded-md">
                <select
                  onChange={(e) => handleRatingChange(+e.target.value)}
                  className="bg-transparent pr-2 outline-none w-full"
                >
                  <option value="none">All Status</option>
                  <option value="in-view">In Review</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FilterBox;
