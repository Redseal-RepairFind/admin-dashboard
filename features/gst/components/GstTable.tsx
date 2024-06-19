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
import LoadingTemplate from "../../layout/loading";

const table_headings = [
  "ID",
  "Business Name",
  "GST Number",
  //   "Certificate of Incorporation",
  "Action",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomersTable: React.FC<IProps> = ({ setLoading }) => {
  const { contractorData, loadingContractors } = useGst();

  console.log(contractorData, "d");

  return (
    <TableCard>
      <div className="flex items-center justify-start gap-4 w-full">
        <div className="flex">All</div>
        <div className="flex">Approved</div>
        <div className="flex">Declined</div>
        <div className="flex">Reviewing</div>
      </div>

      {loadingContractors ? (
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
              {contractorData?.contractor?.map((item: any, index: number) => (
                <tr
                  key={item?._id}
                  className="cursor-pointer border-b border-gray-100"
                >
                  <Td>{index + 1}</Td>
                  <Td>{item?.companyName || "-"}</Td>
                  <Td>{item?.gstDetails?.gstNumber}</Td>
                  {/* <Td>{item?.}</Td> */}
                  <Td>Add</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableOverflow>
      )}
      {/* <Paginator /> */}
    </TableCard>
  );
};

export default CustomersTable;
