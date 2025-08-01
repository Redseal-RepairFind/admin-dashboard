"use client";
import React from "react";
import TableCard from "@/features/shared/table/components/table-card";
import Heading from "@/features/shared/table/components/table-heading";

import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import { trimString } from "@/lib/utils/trim-string";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import { useJobTable } from "../hooks/table";
import Pagination from "@/components/shared/pagination";
import Search from "@/components/shared/search";
import SortLists from "@/app/_components/Sort";

import CheckBox from "@/app/_components/Check-box";

import { useCheckedList } from "@/context/checked-context";

// Since the table data is dynamic a table component will replace by this template
// This Template defines how you can implement any table on your page

const table_headings = [
  "Select All",
  "Job creation date",
  "Requester's FullName",
  "Requester's email",
  "Requester's phone",
  "Requester has used app",
  "Last Login Date",
  "Number of estimates submitted",
  "No. of site vistis requested",
  "Was site visit booked",
  "Was Site visit completed",
  "Has booked Job",
  "Is Job completed",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  filteredData: any;
  handleSearch: any;
  setIsQuerying: any;
}

const WebJobsTable: React.FC<IProps> = ({
  setLoading,
  filteredData,
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
    currentJobsList,
    handleViewInvoice,
    totalJobs,
  } = useJobTable({ setLoading });

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

  const { checkedList, handleCheck, handleSelectAll } = useCheckedList();
  // console.log(filteredData);

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
              {table_headings?.map((heading, index) =>
                heading === "Select All" ? (
                  <th
                    key={"Select"}
                    className="flex items-center justify-center gap-2 h-12 pl-2 w-8"
                  >
                    <CheckBox
                      onClick={(event: any) => {
                        event.stopPropagation(); // Prevents event from bubbling to parent elements
                        handleSelectAll(filteredData);
                      }}
                      isChecked={
                        checkedList?.length === filteredData?.data?.data?.length
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
            {filteredData?.data?.jobs?.map((item: any, index: any) => (
              <tr
                className="cursor-pointer"
                key={index}
                // onClick={() => handleViewInvoice(item)}
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
                <Td>{formatDateToDDMMYY(item?.createdAt)}</Td>
                <Td>{`${item?.requesterFirstName} ${item?.requesterLastName}`}</Td>
                <Td>{`${item?.requesterEmail}`}</Td>
                <Td>{`${item?.requesterPhone || "__"}`}</Td>
                <Td>{`${item?.hasLoggedIn ? "Yes" : "No"}`}</Td>
                <Td>
                  {item?.lastLogin
                    ? formatDateToDDMMYY(item?.lastLogin)
                    : " Not logged in yet"}
                </Td>

                <Td>{item?.estimatesCount}</Td>
                <Td>{item?.siteVisitsCount}</Td>
                <Td>{item?.wasSiteVisitBooked ? "Yes" : "No"}</Td>
                <Td>{item?.wasSiteVisitCompleted ? "Yes" : "No"}</Td>
                <Td>{item?.jobScheduled ? "Yes" : "No"}</Td>
                <Td>{item?.jobCompleted ? "Yes" : "No"}</Td>
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

export default WebJobsTable;
