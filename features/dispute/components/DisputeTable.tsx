"use client";
import React, { useEffect, useState, useRef } from "react";
import TableCard from "@/features/shared/table/components/table-card";
import Paginator from "@/features/shared/table/components/paginator";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import { RatingStar } from "@/public/svg";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import { useRouter } from "next/navigation";
import useGst from "@/lib/hooks/useGst";
import useEmergency from "@/lib/hooks/useEmergency";
import useDisputes from "@/lib/hooks/useDisputes";
import LoadingTemplate from "../../layout/loading";
// import SettleEmergency from "./SettleEmergency";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const table_headings = ["ID", "Disputer", "Dispute date", "Status", "Action"];

const types = [
  { id: 1, value: "Open", slug: "OPEN" },
  { id: 2, value: "In Progress", slug: "ONGOING" },
  { id: 3, value: "Resolved", slug: "RESOLVED" },
  // { id: 4, value: "Closed", slug: "CLOSED" },
];

const DisputeTable = () => {
  const { disputes, status, setStatus, loadingDisputes, handleAccept } =
    useDisputes();

  // console.log(disputes);

  // console.log(status);

  const router = useRouter();

  const handleAction = async (id: any) => {
    // console.log(id);
    if (status === "OPEN") return handleAccept(id);

    router.push(`/dispute/${id}`);
    // console.log("d");
  };
  return (
    <TableCard>
      <div className="flex items-center justify-start gap-5 w-full">
        {types.map((type: any, index: number) => (
          <button
            className={
              status === type?.slug ? "font-semibold" : "text-gray-400"
            }
            onClick={() => setStatus(type.slug)}
            key={index}
          >
            {type.value}
          </button>
        ))}
      </div>
      {loadingDisputes ? (
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
              {disputes?.data?.data?.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-100">
                  <Td>{index + 1}</Td>
                  <Td>{item?.disputer?.name || "-"}</Td>
                  <Td>{formatDateToDDMMYY(item?.createdAt)}</Td>
                  <Td>{item?.status}</Td>
                  <Td>
                    <button
                      disabled={status === "RESOLVED"}
                      onClick={() => handleAction(item?._id)}
                      className={`text-white px-5 py-3 rounded-md text-sm ${
                        status === "RESOLVED"
                          ? "cursor-not-allowed bg-gray-500"
                          : "bg-black "
                      }`}
                    >
                      {status === "OPEN" ? "Accept" : "Resolve"}
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableOverflow>
      )}
    </TableCard>
  );
};

export default DisputeTable;
