"use client";
import React, { useEffect, useState } from "react";
import TableCard from "@/features/shared/table/components/table-card";
import Td from "@/features/shared/table/components/td";
import Heading from "@/features/shared/table/components/table-heading";
import Searchbar from "@/features/shared/table/components/searchbar";
import Filter from "@/features/shared/table/components/filter";
import Paginator from "@/features/shared/table/components/paginator";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import { trimString } from "@/lib/utils/trim-string";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import FilterBox from "@/features/customers/components/filter-box";
import { useTransaction } from "../hooks/table";

// Since the table data is dynamic a table component will replace by this template
// This Template defines how you can implement any table on your page

const table_headings = [
  "Contractor’s Name",
  "Invoice ID",
  "Customer name",
  "Job address",
  "Payment date",
  "Amount",
  "Status",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const TransactionsDetailsTable: React.FC<IProps> = ({ setLoading }) => {
  const {
    handleQuery,
    notFound,
    showFilters,
    setShowFilters,
    handleRatingFiltering,
    handleMonthFiltering,
    handleYearFiltering,
    availableYears,
    currentTransactionsDetails,
    handleViewATransaction,
    currentPage,
    setCurrentPage,
    totalTransaction,
  } = useTransaction({ setLoading });
  return (
    <TableCard>
      <div className="flex items-center justify-between w-full">
        <Heading name="Transactions List" />
        <div className="flex gap-8">
          <Searchbar
            placeholder="Search for a name"
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
            {currentTransactionsDetails?.transactionDetail?.map(
              (item, index) => (
                <tr
                  key={item.transaction._id}
                  onClick={() => handleViewATransaction(item)}
                  className="cursor-pointer"
                >
                  <Td>
                    {item.contractor.firstName} {item.contractor.lastName}
                  </Td>
                  <Td>{item.transaction.invoiceId}</Td>
                  <Td>{trimString(item.customer.fullName, 15)}</Td>
                  <Td>{trimString(item.job.address, 20)}</Td>
                  <Td>{formatDateToDDMMYY(item.transaction.createdAt)}</Td>
                  <Td>${item.transaction.amount}</Td>
                  <Td>{trimString(item.job.status, 15)}</Td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </TableOverflow>
      <Paginator
        max={totalTransaction}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </TableCard>
  );
};

export default TransactionsDetailsTable;
