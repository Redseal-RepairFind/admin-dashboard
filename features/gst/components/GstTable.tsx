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
import toast from "react-hot-toast";
import useGst from "@/lib/hooks/useGst";
import LoadingTemplate from "../../layout/loading";
import VerticalMenu from "@/components/shared/vertical-menu";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const table_headings = [
  "ID",
  "Business Name",
  "GST Number",
  //   "Certificate of Incorporation",
  "Action",
];

const statusTypes = [
  { title: "All", slug: "pending" },
  { title: "Approved", slug: "approve" },
  { title: "Declined", slug: "decline" },
  { title: "Reviewing", slug: "review" },
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomersTable: React.FC<IProps> = ({ setLoading }) => {
  const [open, setOpen] = useState(false);

  const [currentContractor, setCurrentContractor] = useState<any>();

  const [declineMsg, setDeclineMsg] = useState("");

  const modalRef = useRef(null);

  const {
    contractorData,
    loadingContractors,
    gstType,
    setGstType,
    ChangeStatus,
    refetch,
  } = useGst();

  // console.log(contractorData, "d");
  // console.log(gstType);

  let rowOptions = [
    {
      name: "Accept",
      action: async (item: any) => {
        if (gstType === "approve")
          return toast.error("Contractor has been approved already...");
        console.log(item);
        const payload = { contractorId: item?._id, gstStatus: "APPROVED" };
        toast.loading("Processing...");
        try {
          const data = await ChangeStatus(payload);
          toast.remove();
          toast.success(data?.message);
          setTimeout(() => {
            refetch();
          }, 1000);
        } catch (e: any) {
          toast.remove();
          toast.error(e?.response?.data?.message);
        }
      },
    },
    {
      name: "Reject",
      action: async (item: any) => {
        if (gstType === "decline")
          return toast.error("Contractor has been declined already...");
        setCurrentContractor(item);
        setOpen(true);
      },
    },
  ];

  const handleDecline = async () => {
    if (!declineMsg) return toast.error("Kindly enter a reason");
    const payload = {
      contractorId: currentContractor?._id,
      gstStatus: "DECLINED",
      reason: declineMsg,
    };
    toast.loading("Processing...");
    try {
      const data = await ChangeStatus(payload);
      toast.remove();
      toast.success(data?.message);
      setTimeout(() => {
        refetch();
        setOpen(false);
      }, 1000);
    } catch (e: any) {
      toast.remove();
      toast.error(e?.response?.data?.message);
    }
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
        <div className="w-[600px] pt-7">
          <h1 className="text-lg mb-1 font-semibold">Enter your reason</h1>
          <textarea
            onChange={(e) => setDeclineMsg(e.target.value)}
            rows={4}
            className="w-full p-2 outline-none focus:ring-0 border border-slate-300 rounded-md focus:border-black duration-200"
          />
          <button
            onClick={handleDecline}
            className="w-full mt-3 py-3 text-white bg-black rounded-md"
          >
            Decline
          </button>
        </div>
      </Modal>

      <TableCard>
        <div className="flex items-center justify-start gap-4 w-full">
          {statusTypes.map((type, index) => (
            <button
              className={
                type.slug === gstType
                  ? "font-semibold"
                  : "font-normal text-gray-400"
              }
              onClick={() => setGstType(type.slug)}
              key={index}
            >
              {type.title}
            </button>
          ))}
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
                  <tr key={item?._id} className="border-b border-gray-100">
                    <Td>{index + 1}</Td>
                    <Td>{item?.companyName || "-"}</Td>
                    <Td>{item?.gstDetails?.gstNumber}</Td>
                    {/* <Td>{item?.}</Td> */}
                    <Td>
                      <VerticalMenu isBackground={true}>
                        <div>
                          {rowOptions?.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                option?.action(item);
                              }}
                              className="block w-full border border-slate-100 px-4 py-2 text-left bg-white duration-200 text-baseFont text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                            >
                              {option?.name}
                            </button>
                          ))}
                        </div>
                      </VerticalMenu>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableOverflow>
        )}
        {/* <Paginator /> */}
      </TableCard>
    </>
  );
};

export default CustomersTable;
