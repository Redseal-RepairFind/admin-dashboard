"use client";
import React, { useEffect, useState, useRef } from "react";
import TableCard from "@/features/shared/table/components/table-card";
import Paginator from "@/features/shared/table/components/paginator";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import { RatingStar, PendingState, SuspendedState } from "@/public/svg";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import useGst from "@/lib/hooks/useGst";
import useEmergency from "@/lib/hooks/useEmergency";
import LoadingTemplate from "../../layout/loading";
import SettleEmergency from "./SettleEmergency";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useRouter } from "next/navigation";
import Pagination from "@/components/shared/pagination";
import useAdminPermissions from "@/lib/hooks/useAdminPermissions";
import toast from "react-hot-toast";

const table_headings = [
  "ID",
  "Initiated by",
  "Description",
  "Priority",
  // "Status",
  "Action",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const types = [
  { id: 1, value: "Pending", slug: "PENDING" },
  { id: 2, value: "In Progress", slug: "IN_PROGRESS" },
  { id: 3, value: "Resolved", slug: "RESOLVED" },
];

const EmergencyTable: React.FC<IProps> = ({ setLoading }) => {
  const [open, setOpen] = useState(false);

  const [emergencyID, setEmergencyID] = useState<any>("");

  const { adminPermissions } = useAdminPermissions();

  const modalRef = useRef(null);

  const router = useRouter();

  const {
    type: currentType,
    setType,
    loadingEmergencies,
    handleAccept,
    sortData,
    refetch,
  } = useEmergency();

  // console.log(emergencyData, "d");

  const handleAction = async (id: string) => {
    if (!adminPermissions?.data?.includes("manage_emergencies")) {
      toast.remove();

      toast.error("You don't have permission to resolve emergency");
      return;
    } else if (currentType === "PENDING") {
      await handleAccept(id);
      setEmergencyID(id);

      setTimeout(() => {
        // setOpen(true);
        router.push(`/emergency/${id}`);
      }, 100);
    }
  };

  const pageProps = {
    data: sortData?.data,
  };

  // console.log(currentType);

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <SettleEmergency setOpen={setOpen} emergencyID={emergencyID} />
      </Modal>
      <TableCard>
        <div className="flex items-center justify-start gap-5 w-full">
          {types.map((type: any, index: number) => (
            <button
              className={
                currentType === type?.slug ? "font-semibold" : "text-gray-400"
              }
              onClick={() => {
                sessionStorage.setItem("session_emergency_status", type.slug);
                setType(type.slug);
              }}
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
                {sortData?.sortedArr?.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100">
                    <Td>{index + 1}</Td>
                    <Td>{item?.triggeredBy || "-"}</Td>
                    <Td>{item?.description}</Td>
                    <Td>
                      <span className="flex items-center justify-center gap-1">
                        {item?.priority?.toLowerCase() === "low" ? (
                          <PendingState />
                        ) : (
                          <SuspendedState />
                        )}
                        {item?.priority}
                      </span>
                    </Td>
                    {/* <Td>{item?.status}</Td> */}
                    <Td>
                      <button
                        disabled={currentType === "RESOLVED"}
                        onClick={() => handleAction(item?._id)}
                        className={`text-white px-5 py-3 rounded-md text-sm ${
                          currentType === "RESOLVED"
                            ? "cursor-not-allowed bg-gray-500"
                            : "bg-black "
                        }`}
                      >
                        {currentType === "PENDING"
                          ? "Accept"
                          : currentType === "RESOLVED"
                          ? "View"
                          : "Resolve"}
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableOverflow>
        )}
        {/* <Pagination {...pageProps} /> */}
      </TableCard>
    </>
  );
};

export default EmergencyTable;
