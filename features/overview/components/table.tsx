"use client";
import React, { useEffect, useState } from "react";
import TableCard from "@/features/shared/table/components/table-card";
import Heading from "@/features/shared/table/components/table-heading";
import Searchbar from "@/features/shared/table/components/searchbar";
import Filter from "@/features/shared/table/components/filter";
import Paginator from "@/features/shared/table/components/paginator";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import { usePathname, useRouter } from "next/navigation";
import { getJobs } from "@/lib/api/api";
import { IJobs, IJobsList } from "@/lib/types";
import { trimString } from "@/lib/utils/trim-string";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import { getRandomNumber } from "@/lib/utils/get-random-numbers";
import {
  findJobListSmallestYear,
  findJoblistLargestYear,
} from "@/lib/utils/get-min-or-max-date";
import { generateRange } from "@/lib/utils/generate-range";
import FilterBox from "@/features/customers/components/filter-box";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setsingleJobDetail } from "@/lib/redux/slices/single-job-detail";
import useAnalytics from "@/lib/hooks/useAnalytics";
import Pagination from "@/components/shared/pagination";

// Since the table data is dynamic a table component will replace by this template
// This Template defines how you can implement any table on your page

const table_headings = [
  "Customer’s Name",
  // "Job ID",
  "Contractors’s Name",
  "Job Address",
  "Date",
  // "Inspection",
  "Status",
];

const OverviewTable = () => {
  const [currentJobsList, setCurrentJobsList] = useState<IJobsList>();

  const { jobs, currentPage, setCurrentPage, perPage, setPerPage } =
    useAnalytics();

  // console.log(jobs);

  function replaceUnderscoreWithSpace(str: string) {
    if (!str || typeof str !== "string") return null;
    return str.replace(/_/g, " ");
  }

  const pageProps = {
    data: jobs,
    perPage,
    setPerPage,
    pageNo: currentPage,
    setPageNo: setCurrentPage,
  };

  return (
    <TableCard>
      <div className="flex items-center justify-between w-full">
        <Heading name="Job List" />
        {/* <div className="flex gap-8">
          <Searchbar
            placeholder="Search by name or job id"
            handleQuery={handleQuery}
            notFound={notFound}
          />
          <Filter showFilters={showFilters} setShowFilters={setShowFilters}>
            <FilterBox
              handleRatingFiltering={handleRatingFiltering}
              handleMonthFiltering={handleMonthFiltering}
              handleYearFiltering={handleYearFiltering}
              availableYears={availableYears}
              setShowFilters={setShowFilters}
            />
          </Filter>
        </div> */}
      </div>

      <TableOverflow>
        <Table>
          <Thead>
            <tr>
              {table_headings?.map((heading, index) => (
                <Th key={index}>{heading}</Th>
              ))}
            </tr>
          </Thead>

          <tbody>
            {jobs?.data?.map((item: any, index: number) => (
              <tr
                className="border-b border-gray-200"
                key={index}
                // onClick={() => handleViewInvoice(item)}
              >
                <Td>{item?.customer?.name}</Td>
                {/* <Td>{trimString(item?.job._id, 8)}</Td> */}
                <Td>{item.contractor?.name}</Td>
                <Td>{trimString(item?.location?.address, 22)}</Td>
                <Td>{formatDateToDDMMYY(item?.createdAt)}</Td>
                {/* <Td>{item.job.inspection.status ? "True" : "False"}</Td> */}
                <Td>{replaceUnderscoreWithSpace(item?.status)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableOverflow>
      <div className="mt-4 w-full">
        <Pagination {...pageProps} />
      </div>
    </TableCard>
  );
};

export default OverviewTable;
