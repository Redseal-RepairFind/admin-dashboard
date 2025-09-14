"use client";

import React, { useEffect, useState } from "react";
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
import {
  formatTimeDDMMYY as convertDate,
  formatDateToDDMMYY,
} from "@/lib/utils/format-date";
import { useCustomerHistoryTable } from "../hooks/jobhistory";
import FilterBox from "@/features/shared/job-history-filter/filter-box";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { customers } from "../../../lib/api/customers";
import { useJobInfo } from "./useJobInfo";

const table_headings = [
  "Contractor’s Name",
  "Title",
  "Date",
  "Job Address",
  "Type",
  "Status",
];

interface IProps {
  jobHistory: IJobHistory[];
}

export const JobsHistory: React.FC<IProps> = ({ jobHistory }) => {
  const {
    // handleQuery,
    notFound,
    showFilters,
    setShowFilters,
    handleMonthFiltering,
    handleYearFiltering,
    availableYears,
    handleViewJob,
    currentCustomerHistory,
  } = useCustomerHistoryTable({ jobHistory });

  const params = useParams();

  const id = params?.slug;
  const {
    isLoading,
    filterData: jobInfo,
    isQuerying,
    queryedList,
    handleQuery,
    handleFilter,
  } = useJobInfo(id);
  const [dataToRender, setDataToRender] = useState<any>();

  // console.log(id);

  useEffect(() => {
    isQuerying ? setDataToRender(queryedList) : setDataToRender(jobInfo);
  }, [isQuerying, queryedList, setDataToRender, jobInfo]);

  // console.log(jobInfo);

  // const columns = ["Customer's Name", "Date Joined", "Email", "Phone Number"];
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
            <FilterBox handleFilter={handleFilter} />
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
            {dataToRender?.jobs?.map((item: any, index: any) => (
              <tr
                key={index}
                // onClick={() => handleViewJob(item)}
                // className="cursor-pointer"
              >
                <Td>{item.contractor?.name}</Td>
                <Td>{item?.title}</Td>
                <Td>{convertDate(item?.time)}</Td>
                <Td>{item?.location?.address}</Td>
                <Td>{item?.type}</Td>
                <Td>{item?.status}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableOverflow>
    </BorderedTableCard>
  );
};

export default JobsHistory;
