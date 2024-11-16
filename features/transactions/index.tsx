"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "../layout/header/header";
import Searchbar from "../layout/header/components/searchbar";
import PageBody from "../shared/page-body/page-body";
import CustomersTable from "./components/table";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import Filter from "@/app/_components/Filter";
import {
  Contractors as CustomerIcon,
  CompletedState,
  ComplaintsState,
  JobIcon,
  CancelIconRed,
  TotalRevenue,
} from "@/public/svg";
import { useSortedData } from "@/lib/hooks/useSortedData";
import AnalyticCard from "../jobs/components/analytic-card";
import { downloadPDF } from "@/lib/utils/downloadPdf";
import { formatCurrency } from "@/lib/utils/curencyConverter";
import { trimString } from "@/lib/utils/trim-string";
import { formatDateToDDMMYY, formatTimeDDMMYY } from "@/lib/utils/format-date";

import { useCheckedList } from "@/context/checked-context";
import * as XLSX from "xlsx";
import Modal from "react-responsive-modal";
import ExportModal from "@/app/_components/ExportModal";

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [dataToRender, setDataToRender] = useState<any>();
  const [openModal, setOpenModal] = useState(false);
  const { checkedList } = useCheckedList();
  const ref = useRef();

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const {
    sortedData,
    loadingSortedData,
    handleQuery,
    setIsQuerying,
    isQuerying,
    queryedList,
  } = useSortedData("transactions");

  useEffect(() => {
    isQuerying ? setDataToRender(queryedList) : setDataToRender(sortedData);
  }, [isQuerying, queryedList, setDataToRender, sortedData]);

  // console.log(sortedData);

  const stats = sortedData?.data?.stats;

  // console.log(stats);

  const columns = [
    "Initiator's Name",
    "Receiver",
    "Type",
    "Description",
    "Date",
    "Amount",
    "Status",
  ];

  const rowsData =
    checkedList?.length > 0 ? checkedList : sortedData?.data?.data;
  const rows = rowsData?.map((item: any) => [
    item?.fromUser?.name || "User not found ",
    item?.toUser?.name || "User not found ",
    trimString(item?.type, 28),
    trimString(item?.description, 22),
    formatTimeDDMMYY(item?.createdAt),
    item?.amount,
    trimString(item?.status, 15),
  ]);

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
      { wch: 20 }, // Status column width
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

  function handleDownloadPdf(type: "excel" | "pdf") {
    const dataToExport = rowsData.map((item: any) => {
      return {
        Initiator: item?.fromUser?.name || "User not found ",
        Receiver: item?.toUser?.name || "User not found ",
        Type: trimString(item?.type, 28),
        Date: formatDateToDDMMYY(item.createdAt),
        Description: trimString(item?.description, 22),
        Amount: formatCurrency(item?.amount),
        Status: item?.status,
      };
    });
    if (!dataToExport) return;

    type === "excel"
      ? exportToExcel(dataToExport, "TransactionsList")
      : downloadPDF(columns, rows, "TransactionsList", "Transactions List");

    handleModalClose();
  }

  return (
    <>
      <Header />
      {/* Page Body - Use for side padding on the top and sides */}
      {loading || (loadingSortedData && <LoadingTemplate />)}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Transactions" />
          <Filter />

          <DownloadButton
            text="Download Transaction’s LIST"
            onClick={handleModalOpen}
          />
        </div>
        <div className="overflow-x-auto mb-6">
          <div className="flex gap-8 min-w-[1200px] flex-wrap">
            <AnalyticCard
              icon={<CustomerIcon />}
              iconColor="bg-[#C398C7]"
              borderColor="border-l-[#721279]"
              name="Jobs Payment Amount"
              info={formatCurrency(stats?.jobPaymentsAmount?.total)}
              tip="Total Payments Amount"
              charge={stats?.jobPaymentsAmount?.count}
              quotes={"Count"}
              // percentage={stats?.jobPaymentsAmount?.paypalCharges?.percentage}
              // mostReq={0}
              // quotes={0}
            />

            <AnalyticCard
              icon={<TotalRevenue />}
              iconColor="bg-[#c7c498]"
              borderColor="border-l-[#e0ba10]"
              name="Checkout Charges"
              info={formatCurrency(
                stats?.jobPaymentsAmount?.paypalCharges?.amount
              )}
              tip="Total Payments charges by PayPal"
              // percentage={stats?.jobPaymentsAmount?.paypalCharges?.percentage}
              // charge={formatCurrency(
              //   stats?.jobPaymentsAmount?.paypalCharges?.fixedFee
              // )}
              // quotes="Fixed Fee"
            />

            <AnalyticCard
              icon={<JobIcon />}
              iconColor="bg-[#edf793]"
              borderColor="border-l-[#d1be12]"
              name="Pending Escrow Amounts"
              info={formatCurrency(stats?.pendingEscrowAmount?.total)}
              tip="Total pending escrow payments"
              // percentage={stats?.pendingEscrowAmount?.percentage}
              charge={stats?.pendingEscrowAmount?.count}
              quotes={"Count"}
            />
            {/* pendingPayoutAmount */}
            <AnalyticCard
              icon={<CancelIconRed />}
              iconColor="bg-[#f7a7a7]"
              borderColor="border-l-[#9A0101]"
              name="Pending Payout Amounts"
              info={formatCurrency(stats?.pendingPayoutAmount?.total)}
              tip="Total pending Payouts payment"
              // percentage={stats?.pendingPayoutAmount?.percentage}
              charge={stats?.pendingPayoutAmount?.count}
              quotes={"Count"}
            />

            {/* TotalRevenue */}
            <AnalyticCard
              icon={<CompletedState />}
              iconColor="bg-[#dcffde]"
              borderColor="border-l-[#0D8012]"
              name="Successful Payouts Amount"
              info={formatCurrency(stats?.successfulPayoutAmount?.total)}
              tip="Total Successful Payouts Amount"
              // percentage={stats?.successfulPayoutAmount?.percentage}
              charge={stats?.successfulPayoutAmount?.count}
              quotes={"Count"}
            />

            <AnalyticCard
              icon={<TotalRevenue />}
              iconColor="bg-[#c7c498]"
              borderColor="border-l-[#e0ba10]"
              name="Payout Charges"
              info={formatCurrency(
                stats?.successfulPayoutAmount?.paypalCharges?.amount
              )}
              tip="Total Successful Payout charges by PayPal"
            />

            <AnalyticCard
              icon={<ComplaintsState />}
              iconColor="bg-[#493b3b]"
              borderColor="border-l-[#5a5555]"
              name="Refunded Payment Amounts"
              info={formatCurrency(stats?.refundedPaymentAmount?.total)}
              tip="Total Refunded  Payment"
              // percentage={stats?.refundedPaymentAmount?.percentage}
              charge={stats?.refundedPaymentAmount?.count}
              quotes={"Count"}
            />
          </div>
          <Modal
            open={openModal}
            onClose={handleModalClose}
            classNames={{
              modal: "customModal",
            }}
            container={ref.current}
          >
            <ExportModal
              title="Transaction's List"
              exportExcel={() => handleDownloadPdf("excel")}
              exportPDF={() => handleDownloadPdf("pdf")}
            />
          </Modal>
        </div>
        <CustomersTable
          setLoading={setLoading}
          data={dataToRender}
          handleSearch={handleQuery}
          setIsQuerying={setIsQuerying}
        />
      </PageBody>
    </>
  );
};

export default Transactions;
