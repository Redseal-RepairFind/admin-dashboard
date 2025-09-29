"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import Header from "../shared/inner-pages/header";
import Wrapper from "../shared/inner-pages/wrapper";
import { filledArrayFromNumber } from "@/lib/utils/array-from-number";
import { RatingStar } from "@/public/svg";
import GoBack from "../shared/go-back-button/go-back";
import BorderRectangle from "../shared/inner-pages/bordered-rect";
import SingleLineColumn from "../shared/inner-pages/single-line-column";
import JobsHistory from "./components/job-history";
import DownloadButton from "../shared/page-body/download-button";
import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { extractInitials } from "@/lib/utils/extract-initials";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "react-query";
import Image from "next/image";
import { customers } from "../../lib/api/customers";
import LoadingTemplate from "../layout/loading";
import { extractFirstLetter } from "@/lib/utils/extract-initials";

import toast from "react-hot-toast";
import useCustomers from "@/lib/hooks/useCustomers";
import { formatCurrency } from "@/lib/utils/curencyConverter";
import { downloadPDF } from "@/lib/utils/downloadPdf";
import { formatTimeDDMMYY } from "@/lib/utils/format-date";
import * as XLSX from "xlsx";
import { useJobInfo } from "./components/useJobInfo";
import Modal from "react-responsive-modal";
import ExportModal from "@/app/_components/ExportModal";
import ActionColumn from "../shared/inner-pages/action-column";
import ActionButton from "../shared/inner-pages/action-button";
import SubmitBtn from "@/components/ui/submit-btn";
import EliteCustomerModal, {
  RemoveModal,
} from "./components/elite-customer-modal";
import { IoClose } from "react-icons/io5";

const SingleCustomer = () => {
  const [rewardPercent, setRewardPercent] = useState<string>();

  const [openModal, setOpenModal] = useState(false);
  const [openModalToggle, setOpenModalToggle] = useState(false);
  const [openModalToggleAdd, setOpenModalToggleAdd] = useState(false);
  const [openModalRemove, setOpenModalRemove] = useState(false);

  const [contractorInfo, setContractorInfo] = useState<{
    name: string;
    email: string;
    _id: string;
  }>();
  const ref = useRef();
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const handleModalToggleOpen = () => setOpenModalToggle(true);
  const handleModalToggleClose = () => setOpenModalToggle(false);
  const handleModalToggleOpenAdd = () => setOpenModalToggleAdd(true);
  const handleModalToggleCloseAdd = () => setOpenModalToggleAdd(false);
  const handleModalRemoveOpen = (cont: {
    name: string;
    email: string;
    _id: string;
  }) => {
    setOpenModalRemove(true);
    setContractorInfo(cont);
  };
  const handleModalRemoveClose = () => {
    setOpenModalRemove(false);
    setContractorInfo(undefined);
  };

  const { value: customerDetails } = useAppSelector(
    (state: RootState) => state.singleCustomerDetail
  );

  const params = useParams();

  const { SuspendCustomer, toggleCustomerElite, isTogglingCustomerElite } =
    useCustomers();

  const id = params?.slug;
  const { jobInfo } = useJobInfo(id);

  // console.log(id);
  // console.log(jobInfo);

  const {
    isLoading,
    data: customer,
    refetch: refetchCustomer,
    isRefetching: isRefetchingCustomer,
  } = useQuery(
    ["Customer Information", id],
    () => {
      return customers.getCustomerDetails({
        id,
      });
    },
    {
      refetchOnWindowFocus: true,
      select: (response) => response?.data,
    }
  );

  const customerInfo = customer?.customer;
  const isElite = customerInfo?.isElite;
  // console.log(customerInfo);

  const {
    customerTeam,
    isLoadingCustomerTeam,
    refetchCusTeam,
    isRefetchingCusTeam,
  } = useCustomers(customerInfo?.id);

  // console.log(customerTeam);

  const selectedContractors = customerTeam?.data || [];

  const router = useRouter();
  // useLayoutEffect(() => {
  //   console.log(customerDetails.customer._id);
  //   if (customerDetails.customer._id === "") {
  //     router.push("/customers");
  //   }
  // }, []);

  const rows = jobInfo?.jobs?.map((item: any) => [
    item.contractor?.name,
    item?.title,
    formatTimeDDMMYY(item?.date),
    item?.location?.address,
    item?.type,
    item?.status,
  ]);

  // console.log(jobInfo);

  const exportToExcel = (data: any, fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Apply column widths
    worksheet["!cols"] = [
      { wch: 20 }, // CustomerName column width
      { wch: 15 }, // ID column width
      { wch: 25 }, // ContractorName column width
      { wch: 50 }, // Address column width
      { wch: 15 }, // Date column width
      { wch: 20 }, // Status column width
      // { wch: 20 }, // Status column width
    ];

    // Apply header styling (assuming headers start at A1)
    const headerCells = ["A1", "B1", "C1", "D1", "E1", "F1", "G1"];
    headerCells.forEach((cell) => {
      if (worksheet[cell]) {
        worksheet[cell].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  const columns = [
    "ContractorName",
    "JobTitle",
    "Date_Joined",
    "Address",
    "Type",
    "Status",
  ];

  function handleDownloadPdf(type: "excel" | "pdf") {
    const dataToExport = jobInfo?.jobs?.map((item: any) => {
      return {
        ContractorName: item.contractor?.name,
        JobTitle: item?.title,
        Date_Joined: formatTimeDDMMYY(item?.date),
        Address: item?.location?.address,
        Type: item?.type,
        Status: item?.status,
      };
    });
    type === "excel"
      ? exportToExcel(dataToExport, "Jobs_History")
      : downloadPDF(columns, rows, "Jobs_History", "Job History");

    handleModalClose();
  }
  if (
    isLoading ||
    isRefetchingCustomer ||
    isLoadingCustomerTeam ||
    isRefetchingCusTeam
  )
    return <LoadingTemplate />;
  return (
    <>
      <Header>
        {isLoading && <LoadingTemplate />}
        <Wrapper>
          <div className="flex gap-x-6 items-center">
            <div className="w-[86px] h-[86px] flex item-center justify-center">
              {customerInfo?.profilePhoto?.url && (
                <Image
                  src={customerInfo?.profilePhoto?.url}
                  alt=""
                  width={87}
                  height={87}
                  className="rounded-[50%]"
                />
              )}
              {!customerInfo?.profilePhoto?.url && (
                <div className="w-[86px] h-[86px] rounded-[50%] bg-[#D9D9D9] flex items-center justify-center">
                  <p className="text-[30px] font-[600] text-white">
                    <span className="capitalize">
                      {extractFirstLetter(customerInfo?.firstName)}
                    </span>
                    <span className="capitalize">
                      {extractFirstLetter(customerInfo?.lastName)}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="-mt-2">
              <p className="text-[28px] font-[600] capitalize">
                {customerInfo?.name}
              </p>
              <div className="flex gap-x-1">
                {filledArrayFromNumber(5).map((item, index) => (
                  <RatingStar key={index} />
                ))}
              </div>
            </div>
          </div>
        </Wrapper>
      </Header>

      <Wrapper>
        <div className="my-8">
          <GoBack />
        </div>
        <div className="">
          <BorderRectangle>
            <table className="w-full">
              <tbody>
                <SingleLineColumn
                  name="Email"
                  value={customerInfo?.email || ""}
                />
                <SingleLineColumn
                  name="Contact"
                  value={
                    customerInfo?.phoneNumber
                      ? `${customerInfo?.phoneNumber?.code}  ${customerInfo?.phoneNumber?.number}`
                      : "-"
                  }
                />
                <SingleLineColumn
                  name="Amount Spent"
                  value={formatCurrency(customer?.totalAmountSpent)}
                />
                <SingleLineColumn
                  name="NO. of jobs"
                  value={customer?.jobCounts}
                />
                <SingleLineColumn
                  name="Type"
                  value={isElite ? "Elite Customer" : "Normal Customer"}
                />
                {isElite && (
                  <tr className="my-2 border-b py-4">
                    <td className="py-4">Team Members</td>
                    <td className="py-4">
                      <div className=" flex items-center gap-2 w-full  flex-wrap">
                        {selectedContractors?.map((contractor: any) => (
                          <div
                            className="flex items-center gap-2 border  p-1 rounded-lg bg-black text-white"
                            key={contractor?._id}
                          >
                            <p className="text-xs">{contractor.name}</p>
                            <button
                              className="h-4 w-4 rounded-full bg-red-500"
                              onClick={() => handleModalRemoveOpen(contractor)}
                            >
                              <IoClose scale={16} />
                            </button>
                          </div>
                        ))}

                        <button
                          className="px-4 border rounded-sm"
                          onClick={handleModalToggleOpenAdd}
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {/* <SingleLineColumn name="Payment account" value="" /> */}
                {/* <SingleLineColumn name="Address" value="" /> */}
                <ActionColumn>
                  <div className="flex gap-x-4">
                    {
                      <ActionButton
                        actionName={
                          isElite
                            ? "Demote To Normal Customer"
                            : "Promote To Elite Customer"
                        }
                        onClick={() => handleModalToggleOpen()}
                        color={
                          isElite
                            ? "text-red-600 border-red-600"
                            : "text-green-600 border-green-600"
                        }
                      />
                    }
                  </div>
                </ActionColumn>
              </tbody>
            </table>
          </BorderRectangle>
        </div>

        {/* toggle elite */}
        <Modal
          onClose={() => handleModalToggleClose()}
          open={openModalToggle}
          center
          classNames={{
            modal: "customModal",
          }}
          container={ref.current}
        >
          <EliteCustomerModal
            elite={{
              isElite: isElite,
            }}
            item={customerInfo}
            handleModalToggleClose={handleModalToggleClose}
            refetch={refetchCustomer}
            isNewTeam
          />
        </Modal>

        {/* new contractors */}
        <Modal
          onClose={() => handleModalToggleCloseAdd()}
          open={openModalToggleAdd}
          center
          classNames={{
            modal: "customModal",
          }}
          container={ref.current}
        >
          <EliteCustomerModal
            elite={{
              isElite: isElite,
            }}
            item={customerInfo}
            handleModalToggleClose={handleModalToggleCloseAdd}
            refetch={refetchCusTeam}
            isNewTeam={false}
          />
        </Modal>

        {/* remove contractord */}
        <Modal
          onClose={() => handleModalRemoveClose()}
          open={openModalRemove}
          center
          classNames={{
            modal: "customModal",
          }}
          container={ref.current}
        >
          <RemoveModal
            name={contractorInfo?.name!}
            id={customerInfo?._id!}
            email={contractorInfo?.email!}
            refetchCusTeam={refetchCusTeam}
            closeModal={handleModalRemoveClose}
          />
        </Modal>

        {/* others */}
        <Modal
          open={openModal}
          onClose={handleModalClose}
          classNames={{
            modal: "customModal",
          }}
          center
          container={ref.current}
        >
          <ExportModal
            title="Job History"
            exportExcel={() => handleDownloadPdf("excel")}
            exportPDF={() => handleDownloadPdf("pdf")}
            name="Job History"
            headers={columns}
            data={jobInfo?.jobs}
            loading={isLoading}
            rowMapper={(item: any) => ({
              ContractorName: item.contractor?.name,
              JobTitle: item?.title,
              Date_Joined: formatTimeDDMMYY(item?.date),
              Address: item?.location?.address,
              Type: item?.type,
              Status: item?.status,
            })}
            close={handleModalClose}
            size="A3"
          />
        </Modal>
        <div className="mt-24 mb-10 flex flex-col">
          <div className="self-end mb-7">
            <DownloadButton
              text="Download JOB HISTORY"
              onClick={handleModalOpen}
            />
          </div>
          <JobsHistory jobHistory={customerDetails?.jobHistory} />
        </div>
      </Wrapper>
    </>
  );
};

export default SingleCustomer;
