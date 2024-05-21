"use client";

import React from "react";
import TableCard, {
  BorderedTableCard,
} from "@/features/shared/table/components/table-card";
import Heading from "@/features/shared/table/components/table-heading";
import Searchbar from "@/features/shared/table/components/searchbar";
import Filter from "@/features/shared/table/components/filter";
import Paginator from "@/features/shared/table/components/paginator";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import { ComplaintsState, CompletedState, PendingState } from "@/public/svg";
import { usePathname, useRouter } from "next/navigation";
import { useContractorHistoryTable } from "../hooks/jobhistory";
import FilterBox from "@/features/shared/job-history-filter/filter-box";
import { trimString } from "@/lib/utils/trim-string";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import { IJobHistory } from "@/lib/types";

// Since the table data is dynamic a table component will replace by this template
// This Template defines how you can implement any table on your page

const table_headings = [
  "Customers’s Name",
  "Phone Number",
  "Job ID",
  "Date",
  "Job Address",
  "Inspection",
  "Status",
];

interface IProps {
  jobHistory: IJobHistory[];
}

export const JobsHistory: React.FC<IProps> = ({ jobHistory }) => {
  const {
    handleQuery,
    notFound,
    showFilters,
    setShowFilters,
    handleMonthFiltering,
    handleYearFiltering,
    availableYears,
    currentContractorHistory,
    handleViewJob,
  } = useContractorHistoryTable({ jobHistory });

  return (
    <BorderedTableCard>
      <div className="flex items-center justify-between w-full">
        <Heading name="Job History" />
        <div className="flex gap-8">
          <Searchbar
            placeholder="Search by name or job id"
            handleQuery={handleQuery}
            notFound={notFound}
          />
          <Filter showFilters={showFilters} setShowFilters={setShowFilters}>
            <FilterBox
              handleMonthFiltering={handleMonthFiltering}
              handleYearFiltering={handleYearFiltering}
              availableYears={availableYears}
              setShowFilters={setShowFilters}
            />
          </Filter>
        </div>
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
            {currentContractorHistory?.map((item, index) => (
              <tr
                key={index}
                onClick={() => handleViewJob(item)}
                className="cursor-pointer"
              >
                <Td>{item?.customer?.fullName}</Td>
                <Td>{item?.customer?.phoneNumber} </Td>

                <Td>{trimString(item.job._id, 8)}</Td>
                <Td>{formatDateToDDMMYY(item.job.createdAt)}</Td>
                <Td>{trimString(item.job.address, 25)}</Td>
                <Td>{item.job.inspection.status ? "True" : "False"}</Td>
                <Td>{trimString(item.job.status, 12)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableOverflow>
    </BorderedTableCard>
  );
};

export default JobsHistory;
