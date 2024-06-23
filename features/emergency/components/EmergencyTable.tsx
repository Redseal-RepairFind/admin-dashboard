"use client";
import React, { useEffect, useState } from "react";
import TableCard from "@/features/shared/table/components/table-card";
import Paginator from "@/features/shared/table/components/paginator";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import { RatingStar } from "@/public/svg";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import useGst from "@/lib/hooks/useGst";
import useEmergency from "@/lib/hooks/useEmergency";
import LoadingTemplate from "../../layout/loading";

const table_headings = [
  "ID",
  "Initiated by",
  "Description",
  "Priority",
  "Status",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const types = [
  { id: 1, value: "New", slug: "new" },
  { id: 2, value: "Active", slug: "active" },
  { id: 3, value: "Resolved", slug: "resolve" },
];

const EmergencyTable: React.FC<IProps> = ({ setLoading }) => {
  const {
    emergencyData,
    type: currentType,
    setType,
    loadingEmergencies,
  } = useEmergency();

  console.log(emergencyData, "d");

  return (
    <TableCard>
      <div className="flex items-center justify-start gap-5 w-full">
        {types.map((type: any, index: number) => (
          <button
            className={
              currentType === type?.slug ? "font-semibold" : "text-gray-400"
            }
            onClick={() => setType(type.slug)}
            key={index}
          >
            {type.value}
          </button>
        ))}
      </div>

      {loadingEmergencies ? (
        <LoadingTemplate />
      ) : (
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
              {emergencyData?.jobEmergencies?.map(
                (item: any, index: number) => (
                  <tr
                    key={index}
                    className="cursor-pointer border-b border-gray-100"
                  >
                    <Td>{index + 1}</Td>
                    <Td>{item?.triggeredBy || "-"}</Td>
                    <Td>{item?.description}</Td>
                    <Td>{item?.priority}</Td>
                    <Td>{item?.status}</Td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </TableOverflow>
      )}
      {/* <Paginator /> */}
    </TableCard>
  );
};

export default EmergencyTable;
