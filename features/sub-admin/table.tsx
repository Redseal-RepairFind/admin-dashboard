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
import { usePathname, useRouter } from "next/navigation";
import { getSubAdmins } from "@/lib/api/api";
import { ISubAdmins } from "@/lib/types";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import { AnimatePresence } from "framer-motion";
import Options from "../shared/actions/option";
import Action from "./action";
import {
  findLargestYear,
  findSmallestYear,
} from "@/lib/utils/get-min-or-max-date";
import FilterBox from "../customers/components/filter-box";
import { generateRange } from "@/lib/utils/generate-range";

// Since the table data is dynamic a table component will replace by this template
// This Template defines how you can implement any table on your page

const table_headings = [
  "Sub Admin Name",
  "Date Joined",
  "Email Address",
  "Action",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubAdminTable: React.FC<IProps> = ({ setLoading }) => {
  const [subAdmins, setSubAdmins] = useState<ISubAdmins>();
  const [currentSubAdmins, setCurrentSubAdmins] = useState<ISubAdmins>();
  const [queryedSubAdmins, setQueryedSubAdmins] = useState<ISubAdmins>();
  const [isQuerying, setIsQuerying] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getSubAdmins().then((response) => {
      console.log(response);
      setLoading(false);
      setSubAdmins(response);
    });
  }, []);

  useEffect(() => {
    if (!isQuerying) {
      setCurrentSubAdmins(subAdmins);
    } else {
      setCurrentSubAdmins(queryedSubAdmins);
    }
  }, [isQuerying, subAdmins, queryedSubAdmins]);

  const handleQuery = (value: string) => {
    value === "" ? setIsQuerying(false) : setIsQuerying(true);
    console.log("");
    if (subAdmins) {
      const filterArray = subAdmins.admins.filter(
        (item) =>
          item.email.toLowerCase().includes(value.toLowerCase()) ||
          item.firstName.includes(value.toLowerCase()) ||
          item.lastName.toLowerCase().includes(value.toLowerCase())
      );

      setQueryedSubAdmins({ admins: filterArray });

      filterArray.length === 0 ? setNotFound(true) : setNotFound(false);
    }
  };

  const [showFilters, setShowFilters] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([0]);

  useEffect(() => {
    if (subAdmins) {
      const smallestDate = findSmallestYear(subAdmins.admins);
      const largestDate = findLargestYear(subAdmins.admins);
      setAvailableYears(generateRange(smallestDate, largestDate));
    }
  }, [currentSubAdmins]);

  const [filterYear, setFilterYear] = useState(0);
  const [filterMonth, setFilterMonth] = useState(0);

  const handleYearFiltering = (value: number) => {
    console.log(value);
    setFilterYear(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterMonth !== 0) {
      if (subAdmins) {
        const SubAdminsMatchingYear = subAdmins.admins.filter((admin) => {
          const createdAtDate = new Date(admin.createdAt);
          const createdAtYear = createdAtDate.getFullYear();
          const createdAtMonth = createdAtDate.getMonth() + 1;
          return createdAtYear === value && createdAtMonth === filterMonth;
        });
        setQueryedSubAdmins({ admins: SubAdminsMatchingYear });
      }
    } else {
      if (subAdmins) {
        const SubAdminsMatchingYear = subAdmins.admins.filter((admin) => {
          const createdAtDate = new Date(admin.createdAt);
          const createdAtYear = createdAtDate.getFullYear();
          return createdAtYear === value;
        });
        setQueryedSubAdmins({ admins: SubAdminsMatchingYear });
      }
    }
  };

  const handleMonthFiltering = (value: number) => {
    console.log(value);
    setFilterMonth(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterYear !== 0) {
      if (subAdmins) {
        const subAdminsMatchingMonth = subAdmins.admins.filter((admin) => {
          const createdAtDate = new Date(admin.createdAt);
          const createdAtYear = createdAtDate.getFullYear();
          const createdAtMonth = createdAtDate.getMonth() + 1;
          console.log(createdAtMonth);
          return createdAtMonth === value && createdAtYear === filterYear;
        });
        setQueryedSubAdmins({ admins: subAdminsMatchingMonth });
      }
    } else {
      if (subAdmins) {
        const SubAdminsMatchingMonth = subAdmins.admins.filter((admin) => {
          const createdAtDate = new Date(admin.createdAt);
          const createdAtMonth = createdAtDate.getMonth() + 1;
          console.log(createdAtMonth);
          return createdAtMonth === value;
        });
        setQueryedSubAdmins({ admins: SubAdminsMatchingMonth });
      }
    }
  };

  return (
    <TableCard>
      <div className="flex items-center justify-between w-full">
        <Heading name="Sub Admins list" />
        <div className="flex gap-8">
          <Searchbar
            placeholder="Search by name or email"
            handleQuery={handleQuery}
            notFound={notFound}
          />

          <Filter showFilters={showFilters} setShowFilters={setShowFilters}>
            <FilterBox
              handleMonthFiltering={handleMonthFiltering}
              handleYearFiltering={handleYearFiltering}
              availableYears={availableYears}
              setShowFilters={setShowFilters}
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
            {currentSubAdmins?.admins.map((item, index) => (
              <tr key={index} className="cursor-pointer">
                <Td>{item.firstName + " " + item.lastName}</Td>
                <Td>{formatDateToDDMMYY(item.createdAt)}</Td>
                <Td>{item.email}</Td>

                {/* Actions */}
                <Td>
                  <Action setLoading={setLoading} id={item._id} />
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

export default SubAdminTable;
