"use client";

import React from "react";
import TableCard, {
  BorderedTableCard,
} from "@/features/shared/table/components/table-card";
import Heading from "@/features/shared/table/components/table-heading";
import Searchbar from "@/features/shared/table/components/searchbar";
import Filter from "@/features/shared/table/components/filter";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import { IJobHistory } from "@/lib/types";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import { trimString } from "@/lib/utils/trim-string";
import { useCustomerHistoryTable } from "../hooks/jobhistory";
import FilterBox from "@/features/shared/job-history-filter/filter-box";

const table_headings = [
  "Contractor’s Name",
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
    handleViewJob,
    currentCustomerHistory,
  } = useCustomerHistoryTable({ jobHistory });

  return (
    <BorderedTableCard>
      <div className="flex items-center justify-between w-full">
        <Heading name="Job History" />
        <div className="flex gap-8">
          <Searchbar
            placeholder="Search by name, address or job id"
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
            {currentCustomerHistory?.map((item, index) => (
              <tr
                key={item.job._id}
                onClick={() => handleViewJob(item)}
                className="cursor-pointer"
              >
                <Td>
                  {item.contractor?.firstName} {item.contractor?.lastName}
                </Td>
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
