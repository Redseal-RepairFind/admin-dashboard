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
import useGst from "@/lib/hooks/useGst";
import useEmergency from "@/lib/hooks/useEmergency";
import LoadingTemplate from "../../layout/loading";
import SettleEmergency from "./SettleEmergency";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const table_headings = [
  "ID",
  "Initiated by",
  "Description",
  "Priority",
  "Status",
  "Action",
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
  const [open, setOpen] = useState(false);

  const [emergencyID, setEmergencyID] = useState<any>("");

  const modalRef = useRef(null);

  const {
    emergencyData,
    type: currentType,
    setType,
    loadingEmergencies,
    handleAccept,
  } = useEmergency();

  // console.log(emergencyData, "d");

  const handleAction = (id: string) => {
    return () => {
      console.log("d");
      if (currentType === "new") return handleAccept({ emergencyId: id });

      console.log("e");
      setEmergencyID(id);
      setTimeout(() => {
        setOpen(true);
      }, 100);
    };
  };

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
                      <Td>
                        <button
                          disabled={currentType === "resolve"}
                          onClick={handleAction(item?._id)}
                          className={`text-white px-5 py-3 rounded-md text-sm ${
                            currentType === "resolve"
                              ? "cursor-not-allowed bg-gray-500"
                              : "bg-black "
                          }`}
                        >
                          {currentType === "new" ? "Accept" : "Resolve"}
                        </button>
                      </Td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </TableOverflow>
        )}
        {/* <Paginator /> */}
      </TableCard>
    </>
  );
};

export default EmergencyTable;
