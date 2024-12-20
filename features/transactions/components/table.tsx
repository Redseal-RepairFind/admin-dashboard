"use client";
import React, { useEffect, useState } from "react";
import TableCard from "@/features/shared/table/components/table-card";
import Td from "@/features/shared/table/components/td";
import Heading from "@/features/shared/table/components/table-heading";
// import Searchbar from "@/features/shared/table/components/searchbar";
import Filter from "@/features/shared/table/components/filter";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import { trimString } from "@/lib/utils/trim-string";
import { formatTimeDDMMYY } from "@/lib/utils/format-date";
import FilterBox from "@/features/customers/components/filter-box";
import { useTransaction } from "../hooks/table";
import Pagination from "@/components/shared/pagination";
import { usePathname, useRouter } from "next/navigation";
import Search from "@/components/shared/search";
import CheckBox from "@/app/_components/Check-box";

import { useCheckedList } from "@/context/checked-context";

// Since the table data is dynamic a table component will replace by this template
// This Template defines how you can implement any table on your page

const table_headings = [
  "Select All",
  "Payment Initiator",
  "Receiver",
  "Type",
  "Description",
  "Payment date",
  "Amount",
  "Status",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
  handleSearch: any;
  setIsQuerying: any;
}

const TransactionsDetailsTable: React.FC<IProps> = ({
  setLoading,
  data,
  handleSearch,
  setIsQuerying,
}) => {
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

  const pageProps = {
    data: data?.data,
  };

  const router = useRouter();
  const pathname = usePathname();

  const { checkedList, handleCheck, handleSelectAll } = useCheckedList();

  // console.log(data);

  return (
    <TableCard>
      <div className="flex items-center justify-between w-full">
        <Heading name="Transactions List" />
        <div className="flex gap-8">
          <Search
            search={""}
            setIsQuerying={setIsQuerying}
            setSearch={handleSearch}
          />
          <Filter showFilters={showFilters} setShowFilters={setShowFilters}>
            <FilterBox
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
              {table_headings?.map((heading, index) =>
                heading === "Select All" ? (
                  <th
                    key={"Select"}
                    className="flex items-center justify-center gap-2 h-12 pl-2 w-8"
                  >
                    <CheckBox
                      onClick={(event: any) => {
                        event.stopPropagation(); // Prevents event from bubbling to parent elements
                        handleSelectAll(data);
                      }}
                      isChecked={
                        checkedList?.length === data?.data?.data?.length
                      }
                    />
                  </th>
                ) : (
                  <Th key={index}>{heading}</Th>
                )
              )}
            </tr>
          </Thead>

          <tbody>
            {data?.data?.data?.map((item: any, index: number) => (
              <tr
                key={item?._id}
                // onClick={() => router.push(`${pathname}/${item?._id}`)}
                className="cursor-pointer"
              >
                <td className="flex items-center justify-center gap-2 h-12 pl-2 w-8">
                  <CheckBox
                    onClick={(event: any) => {
                      event.stopPropagation(); // Prevents event from bubbling to parent elements
                      handleCheck(item);
                    }}
                    isChecked={checkedList?.some((data: any) => data === item)}
                  />
                </td>
                <Td>
                  {item?.fromUser?.name || "User not found "}

                  {/* {item.contractor.lastName} */}
                </Td>
                <Td>{item?.toUser?.name || "User Not found"}</Td>
                <Td>{trimString(item?.type, 15)}</Td>
                <Td>{trimString(item?.description, 22)}</Td>
                <Td>{formatTimeDDMMYY(item?.createdAt)}</Td>
                <Td>${item?.amount}</Td>
                <Td>{trimString(item?.status, 15)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableOverflow>

      <Pagination {...pageProps} />
    </TableCard>
  );
};

export default TransactionsDetailsTable;
