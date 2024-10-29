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
// import { useJobTable } from "../hooks/table";
import Paginator from "@/features/shared/table/components/paginator";
import Pagination from "@/components/shared/pagination";
import Search from "@/components/shared/search";
import SortLists from "@/app/_components/Sort";
import { useJobTable } from "@/features/jobs/hooks/table";

// Since the table data is dynamic a table component will replace by this template
// This Template defines how you can implement any table on your page

const table_headings = [
  "Customer’s Name",
  "Job ID",
  "Contractors’s Name",
  "Job Category",

  "Job Address",
  "Date",
  "Job Status",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  filteredData: any;
  handleSearch: any;
  setIsQuerying: any;
}

const JobsTable: React.FC<IProps> = ({
  setLoading,
  filteredData,
  handleSearch,
  setIsQuerying,
}) => {
  const { handleViewInvoice } = useJobTable({ setLoading });

  const pageProps = {
    data: filteredData?.data,
  };

  const sortProps = [
    // {
    //   url: "firstName",
    //   render: "Name (A-Z)",
    // },
    // {
    //   url: "-firstName",
    //   render: "Name (Z-A)",
    // },
    {
      url: "-createdAt",
      render: "Date Joined (latest)",
    },
    {
      url: "createdAt",
      render: "Date Joined (oldest)",
    },
  ];

  return (
    <TableCard>
      <div className="flex items-center justify-between w-full">
        <Heading name="Job List" />

        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold ">Sort List</h1>
          <SortLists
            sortProps={sortProps}
            initialstate={"createdAt"}
            initialState="All"
          />
        </div>
        <div className="flex gap-8">
          <Search
            search={""}
            setSearch={handleSearch}
            placeholder="Search..."
            setIsQuerying={setIsQuerying}
          />
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
            {filteredData?.data?.data?.map((item: any, index: any) => (
              <tr
                className="cursor-pointer"
                key={index}
                onClick={() => handleViewInvoice(item)}
              >
                <Td>{item?.customer?.name}</Td>
                <Td>{trimString(item?._id, 8)}</Td>
                <Td>
                  {item?.contractor?.firstName || "-"}{" "}
                  {item?.contractor?.lastName || "-"}
                </Td>
                <Td>{trimString(item?.job?.category, 22)}</Td>
                <Td>{trimString(item?.jobLocation?.address, 22)}</Td>

                <Td>{formatDateToDDMMYY(item?.createdAt)}</Td>
                <Td>{trimString(item?.status, 22)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableOverflow>
      {/* <Paginator
        max={totalJobs}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      /> */}

      <Pagination {...pageProps} />
    </TableCard>
  );
};

export default JobsTable;
