"use client";

import React from "react";
import TableCard, {
  BorderedTableCard,
} from "@/features/shared/table/components/table-card";
import Heading from "@/features/shared/table/components/table-heading";
import Searchbar from "@/features/shared/table/components/searchbar";
import Filter from "@/features/shared/table/components/filter";
import Paginator from "@/features/shared/table/components/paginator";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import { ComplaintsState, CompletedState, PendingState } from "@/public/svg";
import { usePathname, useRouter } from "next/navigation";
import { useContractorHistoryTable } from "../hooks/jobhistory";
import FilterBox from "@/features/shared/job-history-filter/filter-box";
import { trimString } from "@/lib/utils/trim-string";
import { formatDateToDDMMYY, convertDate } from "@/lib/utils/format-date";
import { IJobHistory } from "@/lib/types";

// Since the table data is dynamic a table component will replace by this template
// This Template defines how you can implement any table on your page

const table_headings = [
  "Customer’s Name",
  "Phone Number",
  "Category",
  "Date & Time",
  "Job Address",
  "Status",
];

interface IProps {
  jobHistory: IJobHistory[];
}

export const JobsHistory = ({ jobHistory }: { jobHistory: any }) => {
  return (
    <BorderedTableCard>
      <div className="flex items-center justify-between w-full">
        <Heading name="Job History" />
        <div className="flex gap-8">
          {/* <Searchbar
            placeholder="Search by name or job id"
            handleQuery={handleQuery}
            notFound={notFound}
          /> */}
          {/* <Filter showFilters={showFilters} setShowFilters={setShowFilters}>
            <FilterBox
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
            {jobHistory?.map((item: any, index: number) => (
              <tr
                key={index}
                // onClick={() => handleViewJob(item)}
                // className="cursor-pointer"
              >
                <Td>{item?.customer?.name}</Td>
                <Td>
                  {item?.customer?.phoneNumber
                    ? `${item?.customer?.phoneNumber?.code}${item?.customer?.phoneNumber?.number}`
                    : "-"}{" "}
                </Td>
                <Td>{item?.category}</Td>
                <Td>{convertDate(item?.time)}</Td>
                <Td>{trimString(item?.location?.address, 25)}</Td>
                {/* <Td>{item.job.inspection.status ? "True" : "False"}</Td> */}
                <Td>{item?.status?.replace(/_/g, " ")}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableOverflow>
    </BorderedTableCard>
  );
};

export default JobsHistory;
