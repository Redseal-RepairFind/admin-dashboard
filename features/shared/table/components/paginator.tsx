"use client";
import React from "react";

interface PaginatorProps {
  max: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const roundUpToTen = (max: number) => Math.ceil(max / 10);

const Paginator: React.FC<PaginatorProps> = ({
  max,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = roundUpToTen(max);

  const handleChangePage = (value: number) => {
    if (value >= 1 && value <= totalPages) {
      setCurrentPage(value);
    }
  };

  return (
    <div className="flex w-full justify-end mt-7 cursor-pointer">
      <div className="flex items-center gap-6 whitespace-nowrap">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          onClick={() => handleChangePage(currentPage - 1)}
        >
          <path
            d="M10 2.66669L4.66669 8.00002L10 13.3334"
            stroke={currentPage > 1 ? "#333333" : "#999999"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-200"
          />
        </svg>

        <p className="text-sm">
          <span className="font-[600]">{currentPage} </span>
          of {totalPages}
        </p>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          onClick={() => handleChangePage(currentPage + 1)}
        >
          <path
            d="M5.99998 2.66669L11.3333 8.00002L5.99998 13.3334"
            stroke={currentPage < totalPages ? "#333333" : "#999999"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-200"
          />
        </svg>
      </div>
    </div>
  );
};

export default Paginator;
