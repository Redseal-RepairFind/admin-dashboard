"use client";

import React, { useState, useEffect } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// Available options for items per page
const perPageOptions = [5, 10, 15, 25, 35, 45];

const Pagination = ({
  data, // Pass the full dataset here
}: any) => {
  const [currentPageNo, setCurrentPageNo] = useState(1); // Active page
  const [perPage, setPerPage] = useState(10); // Items per page

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Sync pageNo and perPage with URL query params on component mount
  useEffect(() => {
    const currentPageFromURL = searchParams.get("page");
    const perPageFromURL = searchParams.get("perPage");

    if (currentPageFromURL) {
      setCurrentPageNo(parseInt(currentPageFromURL));
    }
    if (perPageFromURL) {
      setPerPage(parseInt(perPageFromURL));
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

  const totalPages = Math.ceil(data?.data?.lastPage); // Total number of pages

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
        {Array.from({ length: totalPages }, (_, index) => index + 1)?.map(
          (page) => (
            <button
              className={
                page === currentPageNo
                  ? "text-sm font-medium text-white bg-black p-1 rounded-sm"
                  : "text-sm font-medium text-primary"
              }
              key={page}
              onClick={() => {
                setCurrentPageNo(page);
                updateUrlParams(page, perPage);
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
          <option key={perPageOption} value={perPageOption}>
            {perPageOption} Per Page
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;
