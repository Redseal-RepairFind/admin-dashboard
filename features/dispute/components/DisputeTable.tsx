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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import useAdminPermissions from "@/lib/hooks/useAdminPermissions";
import toast from "react-hot-toast";
import { useLoader } from "@/context/LoaderContext";

const table_headings = [
  "ID",
  "Disputer",
  "Description",
  "Dispute date",
  "Dispute Reference ID",
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
    loadingDisputes,
    handleAccept,
    search,
    setSearch,
    sortedData,
    handleQuery,
    setIsQuerying,
    isQuerying,
    queryedList,
    searchTerm, setSearchTerm
  } = useDisputes();

  // const { setSearchTerm, loadingSortedData } = useSortedData("disputes");

  // console.log(dataToRender);

  const router = useRouter();
  const pathname = usePathname();
  const param = useSearchParams();
  const { adminPermissions } = useAdminPermissions();
  const { setLoading } = useLoader();

  const handleAction = async (id: any, status: string) => {
    if (!adminPermissions?.data?.includes("manage_disputes")) {
      toast.remove();

      toast.error("You don't have permission to resolve dispute");
      return;
    }
    // console.log(id);
    if (status === "OPEN") return await handleAccept(id);

    setLoading(true);
    router.push(`/dispute/${id}`);
    // console.log("d");
  };

  const pageProps = {
    data: sortedData?.data,
  };

  // Fetch the initial 'sort' parameter from the URL (query)
  const initialString = param.get("status");
  const initialSortValue = initialString
    ? initialString.replace(/_/g, " ")
    : "OPEN";

  // Set the selected sort value state, initialize with the value from URL
  const [sortValue, setSortValue] = useState(initialSortValue);

  const [isOpen, setIsOpen] = useState(false);

  // On page load, ensure the sort value in the state is in sync with URL
  useEffect(() => {
    const sortFromParam = param.get("status");
    if (sortFromParam) {
      const updatedSortValue = sortFromParam.replace(/_/g, " ");
      setSortValue(updatedSortValue); // Update state based on URL query params
    }
  }, [param]);

  // Function to update the URL params and the state
  function updateUrlParams(value: string) {
    const formattedValue = value.replace(/ /g, "_").toLowerCase(); // Replace spaces with underscores

    // Update the URL query parameters
    if (value === "OPEN") {
      router.replace(`${pathname}`, {
        scroll: false,
      }); // Remove query params if 'All' is selected (default)
    } else {
      const params = new URLSearchParams(window.location.search);
      params.set("status", formattedValue); // Set the selected filter in query params
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }

    // Set the selected value in the state
    setSortValue(value);
  }

  return (
    <TableCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-5">
          {types.map((type: any, index: number) => (
            <button
              className={`${
                sortValue.toLowerCase() === type.slug.toLowerCase()
                  ? "font-semibold"
                  : "text-gray-400"
              }`}
              onClick={() => {
                sessionStorage.setItem("session_dispute_status", type.slug);
                updateUrlParams(type.slug);
              }}
              key={index}
            >
              {type.value}
            </button>
          ))}
        </div>
        <Search
          search={searchTerm}
          setSearch={handleQuery}
          placeholder="Search by Ticked ID..."
          setIsQuerying={setIsQuerying}
          handleEmpty={setSearchTerm}
        />
      </div>
      <TableOverflow>
        {loadingDisputes && isQuerying ? (
          <LoadingTemplate />
        ) : (
          <Table>
            <Thead>
              <tr>
                {table_headings?.map((heading, index) => (
                  <Th key={index}>{heading}</Th>
                ))}
              </tr>
            </Thead>

            <tbody>
              {sortedData?.data?.data?.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-100">
                  <Td>{index + 1}</Td>
                  <Td>
                    {item?.disputer?.name ||
                      `${item?.disputer?.firstName} ${item?.disputer?.lastName}`}
                  </Td>
                  <Td>
                    <span className="max-w-[300px]">
                      {trimString(item?.description, 25)}
                    </span>
                  </Td>
                  <Td>{formatDateToDDMMYY(item?.createdAt)}</Td>
                  <Td>{item?.reference}</Td>
                  <Td>
                    <button
                      // disabled={status === "RESOLVED"}
                      onClick={() => handleAction(item?._id, item?.status)}
                      className={`text-white px-5 py-3 rounded-md text-sm ${
                        item?.status === "RESOLVED"
                          ? " bg-gray-500"
                          : "bg-black "
                      }
                      `}
                    >
                      {item?.status === "OPEN"
                        ? "Accept"
                        : item?.status === "RESOLVED"
                        ? "View Dispute"
                        : item?.status === "REVISIT"
                        ? "View Dispute"
                        : "Resolve"}
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableOverflow>
      <div className="w-full mt-2">
        <Pagination {...pageProps} />
      </div>
    </TableCard>
  );
};

export default DisputeTable;
