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
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import FilterBox from "./filter-box";
import { useCustomersTable } from "../hooks/table";
import useCustomers from "@/lib/hooks/useCustomers";
import VerticalMenu from "@/components/shared/vertical-menu";
import Pagination from "@/components/shared/pagination";
import {
  CompletedState,
  PendingState,
  RatingStar,
  YellowStar,
} from "@/public/svg";
import Search from "@/components/shared/search";

const table_headings = [
  "Customer’s Name",
  "Date Joined",
  "Email Address",
  "Phone Number",
  "Status",
  "Action",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomersTable: React.FC<IProps> = ({ setLoading }) => {
  const {
    handleQuery,
    notFound,
    showFilters,
    setShowFilters,
    handleRatingFiltering,
    handleMonthFiltering,
    handleYearFiltering,
    availableYears,
    currentCustomers,
    handleViewACustomer,
  } = useCustomersTable({ setLoading });

  const {
    customerData,
    loadingCustomers,
    perPage,
    setPerPage,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
  } = useCustomers();

  let rowOptions = [
    // {
    //   name: "Restrict",
    //   action: (item: any) => {},
    // },
    {
      name: "Suspend",
      action: async (item: any) => {},
    },
  ];

  // console.log(customerData);

  const pageProps = {
    data: customerData,
    perPage,
    setPerPage,
    pageNo: currentPage,
    setPageNo: setCurrentPage,
  };

  return (
    <TableCard>
      <div className="flex items-center justify-between w-full">
        <Heading name="Customers’ list" />
        <div className="flex w-full items-center justify-end">
          {/* <Searchbar
            placeholder="Search by name or email"
            handleQuery={handleQuery}
            notFound={notFound}
          /> */}
          <Search
            search={search}
            setSearch={setSearch}
            placeholder="Search..."
          />
          {/* <Filter showFilters={showFilters} setShowFilters={setShowFilters}>
            <FilterBox
              handleRatingFiltering={handleRatingFiltering}
              handleMonthFiltering={handleMonthFiltering}
              handleYearFiltering={handleYearFiltering}
              availableYears={availableYears}
              setShowFilters={setShowFilters}
            />
          </Filter> */}
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
            {customerData?.customers?.map((item: any, index: number) => (
              <tr
                key={item?._id}
                onClick={() => handleViewACustomer(item)}
                className="cursor-pointer border-b border-gray-200"
              >
                <Td>{item?.name}</Td>
                <Td>{formatDateToDDMMYY(item?.createdAt)}</Td>
                <Td>{item?.email}</Td>
                <Td>
                  {item?.phoneNumber?.code}
                  {item?.phoneNumber?.number}
                </Td>
                {/* Rating */}
                <Td>
                  <div className="flex gap-[6px] items-center">
                    {item?.status === "active" ? (
                      <CompletedState />
                    ) : (
                      <PendingState />
                    )}
                    <span
                      className={`capitalize font-medium ${
                        item?.status === "active" ? "text-green-500" : ""
                      }`}
                    >
                      {item?.status}
                    </span>
                  </div>
                </Td>
                <Td>
                  <div onClick={(e) => e.stopPropagation()} className="w-fit">
                    <VerticalMenu isBackground={true}>
                      <div>
                        {rowOptions?.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              option?.action(item);
                            }}
                            className="block w-full border border-slate-100 px-4 py-2 text-left bg-white duration-200 text-baseFont text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                          >
                            {option?.name}
                          </button>
                        ))}
                      </div>
                    </VerticalMenu>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableOverflow>
      {/* <Paginator /> */}
      <div className="w-full mt-2">
        <Pagination {...pageProps} />
      </div>
    </TableCard>
  );
};

export default CustomersTable;
