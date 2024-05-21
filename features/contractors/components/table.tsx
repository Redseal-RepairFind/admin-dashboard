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

// Since the table data is dynamic a table component will replace by this template
// This Template defines how you can implement any table on your page

const table_headings = [
  "Contractor’s Name",
  "Skill",
  "Status",
  "Email Address",
  "No of Jobs",
  "Ratings",
  "Action",
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
          <Filter showFilters={showFilters} setShowFilters={setShowFilters}>
            <FilterBox
              handleRatingFiltering={handleRatingFiltering}
              availableYears={availableYears}
              setShowFilters={setShowFilters}
              handleMonthFiltering={handleMonthFiltering}
              handleYearFiltering={handleYearFiltering}
            />
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
            {currentContractors?.artisans.map((item, index) => (
              <tr
                key={index}
                className="cursor-pointer"
                onClick={() => handleViewAContractors(item)}
              >
                <Td>
                  <span className="capitalize">
                    {trimString(item.contractorProfile.firstName, 10)}
                  </span>

                  <span className="capitalize">
                    {" "}
                    {trimString(item.contractorProfile.lastName, 5)}
                  </span>
                </Td>
                <Td>
                  <span className="capitalize">
                    {item?.document?.skill === undefined
                      ? "Not Submitted"
                      : item?.document?.skill}
                  </span>
                </Td>
                <Td>
                  {item.document !== null ? (
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

                <Td>{trimString(item.contractorProfile.email, 16)}</Td>

                <Td>None</Td>

                <Td>
                  <div className="flex gap-1">
                    {filledArrayFromNumber(5).map((item, index) => (
                      <RatingStar key={index} />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {filledArrayFromNumber(5 - 5).map((item, index) => (
                      <YellowStar key={index} />
                    ))}
                  </div>
                </Td>

                {/* Actions */}
                <Td>
                  <Action
                    setLoading={setLoading}
                    id={item.contractorProfile._id}
                  />
                </Td>
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
