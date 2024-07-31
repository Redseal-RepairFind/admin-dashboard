import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
// import { FaCaretLeft, CaretRightIcon } from "@radix-ui/react-icons";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

const perPageOptions = [5, 10, 15, 25, 35, 45];

const Pagination = ({
  pageNo,
  setPageNo,
  data,
  perPage,
  setPerPage,
}: {
  pageNo: number;
  setPageNo: any;
  data: any;
  perPage: any;
  setPerPage: any;
}) => {
  const [currentPageNo, setCurrentPageNo] = useState(0);
  // console.log({ data });
  const length = data?.totalPages || null;

  const pages = Array.from({ length }, (_, index) => index + 1);
  const chunkPages: any[] = [];

  //if size of pages is more than 10, then break pages it sub-arrays of 10 items
  if (pages.length > 10) {
    const pageSize = 10;
    for (let i = 0; i < pages.length; i += pageSize) {
      const chunk = pages.slice(i, i + pageSize);
      chunkPages.push(chunk);
    }
  } else {
    chunkPages.splice(0, chunkPages.length);
  }

  //   console.log({ chunkPages });

  // console.log(chunkPages.length);

  //   console.log({ pages });
  const handlePerPage = (e: any) => {
    setPageNo(1);
    setPerPage(e.target.value);
  };

  if (!data || data?.totalPages === 1) {
    return (
      <div className="mt-6 mb-2 w-full flex items-center gap-4 justify-end">
        {perPage && (
          <select
            value={perPage}
            className="text-xs font-medium border border-gray-400 py-2 px-4 text-slate-500 focus:ring-0 duration-200 outline-none"
            onChange={handlePerPage}
          >
            {perPageOptions.map((perPageOption) => (
              <option key={perPageOption} value={perPageOption}>
                {perPageOption} per page
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }

  //   console.log({ data });

  return (
    <div className="w-full flex items-center gap-4 justify-between">
      <div className="flex items-center justify-center gap-4">
        {/*BACK BUTTON */}
        <button
          className={`text-xl flex items-center justify-center h-10 ${
            chunkPages.length > 0 && currentPageNo !== 0
              ? "text-primary"
              : "text-gray-500"
          }`}
          disabled={chunkPages.length > 0 && currentPageNo !== 0 ? false : true}
          onClick={() => {
            setCurrentPageNo(currentPageNo - 1);
            setPageNo(chunkPages[currentPageNo - 1][0]);
          }}
        >
          {/* <FontAwesomeIcon icon={faCaretLeft} /> */}
          <FaCaretLeft className="w-3" />
        </button>

        {/*PAGINATION BUTTONS */}
        {chunkPages.length < 1 &&
          pages?.map((page) => (
            <button
              className={
                page == data?.currentPage
                  ? "text-sm font-medium text-red-500"
                  : "text-sm font-medium text-primary"
              }
              key={page}
              onClick={() => {
                setPageNo(page);
              }}
            >
              {page}
            </button>
          ))}
        {chunkPages.length > 0 &&
          chunkPages[currentPageNo]?.map((page: any) => (
            <button
              className={
                page == data?.currentPage
                  ? "text-sm font-medium text-red-500"
                  : "text-sm font-medium text-primary"
              }
              key={page}
              onClick={() => {
                setPageNo(page);
              }}
            >
              {page}
            </button>
          ))}
        {chunkPages.length > 0 && chunkPages[currentPageNo] && (
          <div className="flex items-center justify-center gap-1">
            <p>...</p>
            <button
              className={
                pageNo === data?.totalPages ? "text-red-500" : "text-primary"
              }
              onClick={() => {
                setPageNo(data?.totalPages);
              }}
            >
              {data?.totalPages}
            </button>
          </div>
        )}
        {/*FORWARD BUTTON */}
        <button
          className={`text-xl flex items-center justify-center h-10 ${
            chunkPages.length > 0 && currentPageNo !== chunkPages.length - 1
              ? "text-primary"
              : "text-gray-500"
          }`}
          disabled={
            chunkPages.length > 0 && currentPageNo !== chunkPages.length - 1
              ? false
              : true
          }
          onClick={() => {
            setCurrentPageNo(currentPageNo + 1);
            setPageNo(chunkPages[currentPageNo + 1][0]);
          }}
        >
          {/* <FontAwesomeIcon icon={faCaretRight} /> */}
          <FaCaretRight className="w-3" />
        </button>
      </div>
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
