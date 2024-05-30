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
import { RatingStar } from "@/public/svg";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
// import FilterBox from "./filter-box";
import { useCustomersTable } from "../../customers/hooks/table";
import useStaff from "@/lib/hooks/useStaff";

const table_headings = ["Staff Name", "Date Joined", "Email Address", "Status"];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomersTable: React.FC<IProps> = ({ setLoading }) => {
  const { staffData, loadingStaff } = useStaff();

  console.log(staffData);

  return (
    <TableCard>
      <div className="flex items-center justify-between w-full">
        {/* <Heading name="Staff list" /> */}
        <div className="flex gap-8">
          <Searchbar
            placeholder="Search by name or email"
            // handleQuery={handleQuery}
            // notFound={notFound}
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
            {/* {staffData?.map((item:any, index:number) => (
              <tr
                key={item.customer._id}
                className="cursor-pointer"
              >
                <Td>{item?.firstName}{' '}{item?.lastName}</Td>
                <Td>{formatDateToDDMMYY(item?.createdAt)}</Td>
                <Td>{item?.email}</Td>
                <Td>{item?.status}</Td>
              </tr>
            ))} */}
          </tbody>
        </Table>
      </TableOverflow>
      {/* <Paginator /> */}
    </TableCard>
  );
};

export default CustomersTable;
