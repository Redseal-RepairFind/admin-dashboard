"use client";

import React, { useState, useEffect } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const perPageOptions = [5, 10, 15, 25, 35, 45];

const Pagination = ({
  data,
}: {
  // pageNo: number;
  // setPageNo: any;
  data: any;
  // perPage: any;
  // setPerPage: any;
}) => {
  const [currentPageNo, setCurrentPageNo] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Sync pageNo and perPage with URL query params on component mount
  useEffect(() => {
    const currentPageFromURL = searchParams.get("page");
    const perPageFromURL = searchParams.get("perPage");

    if (currentPageFromURL) {
      setPageNo(parseInt(currentPageFromURL));
    }
    if (perPageFromURL) {
      setPerPage(parseInt(perPageFromURL));
    }
  }, [searchParams, setPageNo, setPerPage]);

  // Update URL with pagination information
  const updateUrlParams = (newPage: number, newPerPage: number) => {
    const params = new URLSearchParams(window.location.search);

    params.set("page", newPage.toString());
    params.set("perPage", newPerPage.toString());

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle changing per page value
  const handlePerPage = (e: any) => {
    const newPerPage = parseInt(e.target.value);
    setPageNo(1); // Reset to first page on per page change
    setPerPage(newPerPage);
    updateUrlParams(1, newPerPage);
  };

  const length = data?.lastPage || 1;
  const pages = Array.from({ length }, (_, index) => index + 1);
  const chunkPages: any[] = [];

  if (pages.length > 10) {
    const pageSize = 10;
    for (let i = 0; i < pages.length; i += pageSize) {
      const chunk = pages.slice(i, i + pageSize);
      chunkPages.push(chunk);
    }
  } else {
    chunkPages.splice(0, chunkPages.length);
  }

  return (
    <div className="w-full flex items-center gap-4 justify-between">
      <div className="flex items-center justify-center gap-4">
        {/* BACK BUTTON */}
        <button
          className={`text-xl flex items-center justify-center h-10 ${
            chunkPages.length > 0 && currentPageNo !== 0
              ? "text-primary"
              : "text-gray-500"
          }`}
          disabled={currentPageNo === 0}
          onClick={() => {
            const newPageNo = chunkPages[currentPageNo - 1][0];
            setCurrentPageNo(currentPageNo - 1);
            setPageNo(newPageNo);
            updateUrlParams(newPageNo, perPage);
          }}
        >
          <FaCaretLeft className="w-3" />
        </button>

        {/* PAGINATION BUTTONS */}
        {chunkPages.length < 1 &&
          pages?.map((page) => (
            <button
              className={
                page === pageNo
                  ? "text-sm font-medium text-red-500"
                  : "text-sm font-medium text-primary"
              }
              key={page}
              onClick={() => {
                setPageNo(page);
                updateUrlParams(page, perPage);
              }}
            >
              {page}
            </button>
          ))}

        {chunkPages.length > 0 &&
          chunkPages[currentPageNo]?.map((page: any) => (
            <button
              className={
                page === pageNo
                  ? "text-sm font-medium text-red-500"
                  : "text-sm font-medium text-primary"
              }
              key={page}
              onClick={() => {
                setPageNo(page);
                updateUrlParams(page, perPage);
              }}
            >
              {page}
            </button>
          ))}

        {/* FORWARD BUTTON */}
        <button
          className={`text-xl flex items-center justify-center h-10 ${
            chunkPages.length > 0 && currentPageNo !== chunkPages.length - 1
              ? "text-primary"
              : "text-gray-500"
          }`}
          disabled={currentPageNo === chunkPages.length - 1}
          onClick={() => {
            if (chunkPages[currentPageNo + 1]) {
              const newPageNo = chunkPages[currentPageNo + 1][0];
              setCurrentPageNo(currentPageNo + 1);
              setPageNo(newPageNo);
              updateUrlParams(newPageNo, perPage);
            }
          }}
        >
          <FaCaretRight className="w-3" />
        </button>
      </div>

      {/* PER PAGE SELECTOR */}
      {perPage && (
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
      )}
    </div>
  );
};

export default Pagination;
