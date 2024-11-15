"use client";
import React, { useEffect, useState, useMemo } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { filterData } from "../hooks/filterByDate";
import SortLists from "@/app/_components/Sort";
import { sortContractors } from "@/lib/utils/sortData";
import CheckBox from "@/app/_components/Check-box";
import { useCheckedList } from "@/context/checked-context";

const table_headings = [
  "Select All",
  "Customer’s Name",
  "Date Joined",
  "Email Address",
  "Phone Number",
  "Action",
];

type Checked = {
  isChecked: boolean;
  items: any;
};

type CheckedObj = {
  [key: string]: Checked;
};

const headings = [
  {
    header: "",
    options: "",
  },
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  filteredData: any;
  handleSearch: any;
  setIsQuerying: any;
}

const CustomersTable: React.FC<IProps> = ({
  setLoading,
  filteredData,
  handleSearch,
  setIsQuerying,
}) => {
  const { handleViewACustomer } = useCustomersTable({ setLoading });
  // const [dataToRender, setDataToRender] = useState<any[]>();
  // filteredData?.data?.data
  const {
    customerData,
    loadingCustomers,
    perPage,
    currentPage,
    search,
    setSearch,
  } = useCustomers();

  let rowOptions = [
    {
      name: "View Customer",
      action: async (item: any) => handleViewACustomer(item),
    },
  ];

  let rowPendingOptions = [
    {
      name: "Cancel Invite",
      action: async (item: any) => {},
    },
  ];

  const searchParams = useSearchParams();

  const pageProps = {
    data: filteredData?.data,
  };

  // useEffect(() => {
  //   const rightFullString = params?.replaceAll("_", " ");
  //   const array = sortContractors(filteredData?.data?.data, rightFullString);

  //   setDataToRender(array);
  // }, [filteredData?.data?.data, params]);

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

  const { checkedList, setCheckedList, handleCheck, handleSelectAll } =
    useCheckedList();

  return (
    <TableCard>
      <div className="flex items-center justify-between w-full  ">
        <Heading name="Customers’ list" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold ">Sort List</h1>
          <SortLists sortProps={sortProps} initialState="Name (A-Z)" />
        </div>
        <Search
          search={search}
          setSearch={handleSearch}
          placeholder="Search..."
          setIsQuerying={setIsQuerying}
        />
      </div>

      <TableOverflow>
        <Table>
          <Thead>
            <tr>
              {table_headings?.map((heading, index) =>
                heading === "Select All" ? (
                  <th
                    key={"Select"}
                    className="flex items-center gap-2 py-4 px-2"
                  >
                    {/* <span className=" font-[500] px-5 py-3">{heading}</span> */}
                    <CheckBox
                      onClick={(event: any) => handleSelectAll(filteredData)}
                      isChecked={
                        checkedList.length === filteredData?.data?.data?.length
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
            {filteredData?.data?.data?.map((item: any, index: number) => (
              <tr
                key={item?._id}
                // onClick={() => handleViewACustomer(item)}
                className="cursor-pointer border-b border-gray-200"
              >
                <td className="flex items-center px-2 py-4 h-full">
                  <CheckBox
                    onClick={(event: any) => handleCheck(item)}
                    isChecked={checkedList.some((data: any) => data === item)}
                  />
                </td>
                <Td>{item?.name}</Td>
                <Td>{formatDateToDDMMYY(item?.createdAt)}</Td>
                <Td>{item?.email}</Td>
                <Td>
                  {item?.phoneNumber?.code}
                  {item?.phoneNumber?.number}
                </Td>
                {/* <Td>
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
                </Td> */}
                <Td>
                  <div onClick={(e) => e.stopPropagation()} className="w-fit">
                    <VerticalMenu top="-20px" isBackground={true}>
                      {item?.status === "in-review" ? (
                        <div>
                          {rowPendingOptions?.map((option, index) => (
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
                      ) : (
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
                      )}
                    </VerticalMenu>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableOverflow>
      <div className="w-full mt-2">
        <Pagination {...pageProps} />
      </div>
    </TableCard>
  );
};

export default CustomersTable;
