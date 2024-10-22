"use client";

import React, { useState, useEffect } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// Available options for items per page
const perPageOptions = [5, 10, 15, 25, 35, 45];

type dData = {
  data: { lastPage: number }; // Ensure lastPage is of type number
};

const Pagination = ({ data }: dData) => {
  const [currentPageNo, setCurrentPageNo] = useState<number>(1); // Active page
  const [perPage, setPerPage] = useState<number>(10); // Items per page

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Sync pageNo and perPage with URL query params on component mount
  useEffect(() => {
    const currentPageFromURL = searchParams.get("page");
    const perPageFromURL = searchParams.get("perPage");

    if (currentPageFromURL) {
      setCurrentPageNo(parseInt(currentPageFromURL) || 1); // Default to 1 if NaN
    }
    if (perPageFromURL) {
      setPerPage(parseInt(perPageFromURL) || 10); // Default to 10 if NaN
    }
  }, [searchParams]);

  // Update URL with pagination information
  const updateUrlParams = (newPage: number, newPerPage: number) => {
    const params = new URLSearchParams(window.location.search);

    params.set("page", newPage.toString());
    params.set("perPage", newPerPage.toString());

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle changing per page value
  const handlePerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(e.target.value);
    setCurrentPageNo(1); // Reset to first page on per page change
    setPerPage(newPerPage);
    updateUrlParams(1, newPerPage);
  };

  const totalPages = data?.lastPage || 1; // Default to 1 if lastPage is undefined or NaN

  // Determine visible pages with ellipses and handling
  const getVisiblePages = () => {
    let pages: (number | string)[] = [];

    if (totalPages <= 15) {
      pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    } else {
      if (currentPageNo <= 2) {
        pages = Array.from({ length: 15 }, (_, index) => index + 1);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPageNo > 15 && currentPageNo < totalPages - 3) {
        pages.push(1);
        pages.push("...");
        pages.push(currentPageNo - 1, currentPageNo, currentPageNo + 1);
        pages.push("...");
        pages.push(totalPages);
      } else {
        pages.push(1);
        pages.push("...");
        pages = pages.concat(
          Array.from({ length: 15 }, (_, index) => totalPages - 14 + index)
        );
      }
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="w-full flex items-center gap-4 justify-between">
      <div className="flex items-center justify-center gap-4">
        {/* BACK BUTTON */}
        <button
          className={`text-xl flex items-center justify-center h-10 ${
            currentPageNo > 1 ? "text-primary" : "text-gray-500"
          }`}
          disabled={currentPageNo === 1}
          onClick={() => {
            const newPageNo = currentPageNo - 1;
            setCurrentPageNo(newPageNo);
            updateUrlParams(newPageNo, perPage);
          }}
        >
          <FaCaretLeft className="w-3" />
        </button>

        {/* PAGINATION BUTTONS */}
        {visiblePages?.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="text-sm font-medium text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              className={
                page === currentPageNo
                  ? "text-sm font-medium text-white bg-black p-1 rounded-sm"
                  : "text-sm font-medium text-primary"
              }
              key={`page-${page}`} // Ensure keys are unique
              onClick={() => {
                setCurrentPageNo(page as number); // Type assertion since page can be string
                updateUrlParams(page as number, perPage);
              }}
            >
              {page}
            </button>
          )
        )}

        {/* FORWARD BUTTON */}
        <button
          className={`text-xl flex items-center justify-center h-10 ${
            currentPageNo < totalPages ? "text-primary" : "text-gray-500"
          }`}
          disabled={currentPageNo === totalPages}
          onClick={() => {
            const newPageNo = currentPageNo + 1;
            setCurrentPageNo(newPageNo);
            updateUrlParams(newPageNo, perPage);
          }}
        >
          <FaCaretRight className="w-3" />
        </button>
      </div>

      {/* PER PAGE SELECTOR */}
      <select
        value={perPage}
        className="text-xs font-medium border border-gray-400 rounded-sm py-2 px-4 focus:ring-0 duration-200 outline-none"
        onChange={handlePerPage}
      >
        {perPageOptions.map((perPageOption) => (
          <option key={`perPage-${perPageOption}`} value={perPageOption}>
            {perPageOption} Per Page
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;
