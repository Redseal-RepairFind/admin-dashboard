"use client";
import React, { useEffect, useState } from "react";
import TableCard from "@/features/shared/table/components/table-card";
import Heading from "@/features/shared/table/components/table-heading";
import Searchbar from "@/features/shared/table/components/searchbar";
import Filter from "@/features/shared/table/components/filter";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import { trimString } from "@/lib/utils/trim-string";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import FilterBox from "@/features/customers/components/filter-box";
import { useJobTable } from "../hooks/table";
import Paginator from "@/features/shared/table/components/paginator";

// Since the table data is dynamic a table component will replace by this template
// This Template defines how you can implement any table on your page

const table_headings = [
  "Customer’s Name",
  "Job ID",
  "Contractors’s Name",
  "Job Address",
  "Date",
  "Inspection",
  "Status",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const JobsTable: React.FC<IProps> = ({ setLoading }) => {
  const {
    handleQuery,
    notFound,
    showFilters,
    setShowFilters,
    handleRatingFiltering,
    handleMonthFiltering,
    handleYearFiltering,
    availableYears,
    currentJobsList,
    handleViewInvoice,
    totalJob,
    currentPage,
    setCurrentPage,
  } = useJobTable({ setLoading });

  return (
    <TableCard>
      <div className="flex items-center justify-between w-full">
        <Heading name="Job List" />
        <div className="flex gap-8">
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
            {currentJobsList?.jobs.map((item, index) => (
              <tr
                className="cursor-pointer"
                key={index}
                onClick={() => handleViewInvoice(item)}
              >
                <Td>{item?.customer.fullName}</Td>
                <Td>{trimString(item?.job._id, 8)}</Td>
                <Td>
                  {item.contractor.firstName} {item.contractor.lastName}
                </Td>
                <Td>{trimString(item.job.address, 22)}</Td>
                <Td>{formatDateToDDMMYY(item.job.createdAt)}</Td>
                <Td>{item.job.inspection.status ? "True" : "False"}</Td>
                <Td>{trimString(item.job.status, 22)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableOverflow>
      <Paginator
        max={totalJob}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </TableCard>
  );
};

export default JobsTable;
