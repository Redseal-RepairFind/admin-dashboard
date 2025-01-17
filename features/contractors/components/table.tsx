"use client";
import React from "react";
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
import {
  CompletedState,
  PendingState,
  RatingStar,
  YellowStar,
} from "@/public/svg";
import Action from "./action";
import { filledArrayFromNumber } from "@/lib/utils/array-from-number";
import { trimString } from "@/lib/utils/trim-string";
import { useContractorTable } from "../hooks/table";
import Ratings from "@/components/shared/ratings";
import Pagination from "@/components/shared/pagination";
import SortLists from "@/app/_components/Sort";

import Search from "@/components/shared/search";
import CheckBox from "@/app/_components/Check-box";
import { useCheckedList } from "@/context/checked-context";

const table_headings = [
  "Select All",
  "Contractor’s Name",
  "Skill",
  "Status",
  "Email Address",
  // "No of Jobs",
  "Sign-up Stage",
  "Ratings",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  contractorData: any;
  handleSearch: any;
  setIsQuerying: any;
}

const ContractorsTable: React.FC<IProps> = ({
  setLoading,
  contractorData,
  handleSearch,
  setIsQuerying,
}) => {
  const { handleViewAContractors } = useContractorTable({ setLoading });

  const mainData = contractorData?.data;

  // console.log(contractorData);

  const pageProps = {
    data: mainData,
  };
  const sortProps = [
    {
      url: "firstName",
      render: "Name (A-Z)",
    },
    {
      url: "-firstName",
      render: "Name (Z-A)",
    },
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

  return (
    <TableCard>
      <div className="flex items-center justify-between w-full">
        <Heading name="Contractors’ list" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold ">Sort List</h1>
          <SortLists sortProps={sortProps} initialState="Name (A-Z)" />
        </div>
        <div className="flex gap-8">
          <Search
            placeholder="Search by name or email"
            setSearch={handleSearch}
            setIsQuerying={setIsQuerying}
            search=""
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
                        handleSelectAll(contractorData);
                      }}
                      isChecked={
                        checkedList?.length ===
                        contractorData?.data?.data?.length
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
            {mainData?.data?.map((item: any, index: number) => (
              <tr
                key={index}
                className="cursor-pointer border-b border-gray-200"
                onClick={() => {
                  sessionStorage.setItem(
                    "current_contractor_jobs",
                    JSON.stringify(item?.job)
                  );
                  handleViewAContractors(item);
                }}
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
                  <span className="capitalize">{item?.name}</span>
                </Td>
                <Td>
                  <span className="capitalize">
                    {item?.profile?.skill ||
                      item?.profile?.skills?.map(
                        (skill: string, index: number) => (
                          <span key={skill} className="text-sm">
                            {skill}
                            {index < item?.profile?.skills.length - 1 && " || "}
                          </span>
                        )
                      ) ||
                      "No Skills"}
                  </span>
                </Td>
                <Td>{item?.accountStatus}</Td>

                <Td>{item?.email}</Td>

                <Td>{item?.onboarding?.stage?.label}</Td>

                <Td>
                  <Ratings rating={item?.rating} />
                </Td>

                {/* Actions */}
                {/* <Td>
                  <Action setLoading={setLoading} id={item?._id} />
                </Td> */}
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

export default ContractorsTable;
