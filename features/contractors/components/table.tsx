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
import FilterBox from "@/features/customers/components/filter-box";
import useContractors from "@/lib/hooks/useContractors";
import Ratings from "@/components/shared/ratings";

// Since the table data is dynamic a table component will replace by this template
// This Template defines how you can implement any table on your page

const table_headings = [
  "Contractor’s Name",
  "Skill",
  "Status",
  "Email Address",
  "No of Jobs",
  "Ratings",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContractorsTable: React.FC<IProps> = ({ setLoading }) => {
  const {
    handleQuery,
    notFound,
    showFilters,
    setShowFilters,
    handleRatingFiltering,
    handleMonthFiltering,
    handleYearFiltering,
    availableYears,
    currentContractors,
    handleViewAContractors,
  } = useContractorTable({ setLoading });

  const { contractorData } = useContractors();

  console.log(contractorData);

  return (
    <TableCard>
      <div className="flex items-center justify-between w-full">
        <Heading name="Contractors’ list" />
        <div className="flex gap-8">
          <Searchbar
            placeholder="Search by name or email"
            handleQuery={handleQuery}
            notFound={notFound}
          />
          {/* <Filter showFilters={showFilters} setShowFilters={setShowFilters}>
            <FilterBox
              handleRatingFiltering={handleRatingFiltering}
              availableYears={availableYears}
              setShowFilters={setShowFilters}
              handleMonthFiltering={handleMonthFiltering}
              handleYearFiltering={handleYearFiltering}
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
            {contractorData?.contractors.map((item: any, index: number) => (
              <tr
                key={index}
                className="cursor-pointer"
                onClick={() => {
                  sessionStorage.setItem(
                    "current_contractor_jobs",
                    JSON.stringify(item?.job)
                  );
                  handleViewAContractors(item?.contractor);
                }}
              >
                <Td>
                  <span className="capitalize">{item?.contractor?.name}</span>
                </Td>
                <Td>
                  <span className="capitalize">
                    {item?.contractor?.profile?.skill === undefined
                      ? "Not Submitted"
                      : item?.contractor?.profile?.skill}
                  </span>
                </Td>
                <Td>
                  {item?.contractor?.accountStatus?.toLowerCase() ===
                  "approved" ? (
                    <div className="flex gap-[6px] items-center">
                      <CompletedState />
                      <span className="capitalize">Verified</span>
                    </div>
                  ) : (
                    <div className="flex gap-[6px] items-center">
                      <PendingState />
                      <span className="capitalize">Pending</span>
                    </div>
                  )}
                </Td>

                <Td>{item?.contractor?.email}</Td>

                <Td>{item?.job?.length}</Td>

                <Td>
                  <Ratings rating={item?.contractor?.rating} />
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
    </TableCard>
  );
};

export default ContractorsTable;
