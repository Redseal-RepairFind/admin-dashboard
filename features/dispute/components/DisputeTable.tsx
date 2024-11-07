"use client";
import React, { useEffect, useState, useRef } from "react";
import TableCard from "@/features/shared/table/components/table-card";
import Paginator from "@/features/shared/table/components/paginator";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import { useRouter } from "next/navigation";
import useGst from "@/lib/hooks/useGst";
import useEmergency from "@/lib/hooks/useEmergency";
import useDisputes from "@/lib/hooks/useDisputes";
import LoadingTemplate from "../../layout/loading";
// import SettleEmergency from "./SettleEmergency";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Pagination from "@/components/shared/pagination";
import { trimString } from "@/lib/utils/trim-string";
import Search from "@/components/shared/search";
import { useSortedData } from "@/lib/hooks/useSortedData";

const table_headings = [
  "ID",
  "Disputer",
  "Description",
  "Dispute date",
  "Action",
];

const types = [
  { id: 1, value: "Open", slug: "OPEN" },
  { id: 2, value: "In Progress", slug: "ONGOING" },
  { id: 3, value: "Resolved", slug: "RESOLVED" },
  { id: 4, value: "Revisit", slug: "REVISIT" },
];

const DisputeTable = () => {
  const {
    status,
    setStatus,
    loadingDisputes,
    handleAccept,
    search,
    setSearch,
    dataToRender,
    handleQuery,
    setIsQuerying,
    isQuerying,
    queryedList,
  } = useDisputes();

  // const { sortedData, loadingSortedData } = useSortedData("disputes");

  const router = useRouter();

  const handleAction = async (id: any, status: string) => {
    // console.log(id);
    if (status === "OPEN") return handleAccept(id);

    router.push(`/dispute/${id}`);
    // console.log("d");
  };

  const pageProps = {
    data: dataToRender?.data,
  };

  return (
    <TableCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-5">
          {types.map((type: any, index: number) => (
            <button
              className={
                status === type?.slug ? "font-semibold" : "text-gray-400"
              }
              onClick={() => {
                sessionStorage.setItem("session_dispute_status", type.slug);
                setStatus(type.slug);
              }}
              key={index}
            >
              {type.value}
            </button>
          ))}
        </div>
        <Search
          search={search}
          setSearch={handleQuery}
          placeholder="Search..."
          setIsQuerying={setIsQuerying}
        />
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
              {dataToRender?.data?.data?.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-100">
                  <Td>{index + 1}</Td>
                  <Td>{item?.disputer?.name || "-"}</Td>
                  <Td>
                    <span className="max-w-[300px]">
                      {trimString(item?.description, 25)}
                    </span>
                  </Td>
                  <Td>{formatDateToDDMMYY(item?.createdAt)}</Td>
                  <Td>
                    <button
                      disabled={status === "RESOLVED" || status === "REVISIT"}
                      onClick={() => handleAction(item?._id, item?.status)}
                      className={`text-white px-5 py-3 rounded-md text-sm ${
                        status === "RESOLVED" || status === "REVISIT"
                          ? "cursor-not-allowed bg-gray-500"
                          : "bg-black "
                      }`}
                    >
                      {status === "OPEN"
                        ? "Accept"
                        : status === "RESOLVED"
                        ? "Resolved"
                        : "Resolve"}
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableOverflow>
      )}
      <div className="w-full mt-2">
        <Pagination {...pageProps} />
      </div>
    </TableCard>
  );
};

export default DisputeTable;
