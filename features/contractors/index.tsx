"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import ContractorsTable from "./components/table";
import useContractors from "@/lib/hooks/useContractors";

import { useCheckedList } from "@/context/checked-context";
import * as XLSX from "xlsx";
import Modal from "react-responsive-modal";
import ExportModal from "@/app/_components/ExportModal";

import { useSearchParams } from "next/navigation";
import Filter from "@/app/_components/Filter";
import {
  Contractors as CustomerIcon,
  CompletedState,
  ComplaintsState,
  JobIcon,
  CancelIconRed,
} from "@/public/svg";
import { useSortedData } from "@/lib/hooks/useSortedData";
import AnalyticCard from "../jobs/components/analytic-card";
import { downloadPDF } from "@/lib/utils/downloadPdf";

const Contractors = () => {
  const [loading, setLoading] = useState(true);

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
    statusDataToRender,
  } = useSortedData("contractors");
  const [dataToRender, setDataToRender] = useState<any>();
  const stats = sortedData?.data?.stats;
  
  useEffect(() => {
    isQuerying
      ? setDataToRender(queryedList)
      : setDataToRender(statusDataToRender);
  }, [isQuerying, queryedList, setDataToRender, statusDataToRender]);

  // console.log(listStatus, dataToRender);
  const columns = [
    "Contractor's Name",
    "Skill",
    "Status",
    "Email",
    "Stage",
    "Ratings",
  ];

  const rowsData =
    checkedList?.length > 0 ? checkedList : sortedData?.data?.data;
  const rows = rowsData?.map((item: any) => [
    item?.name,
    item?.profile?.skill === undefined ? "Not Submitted" : item?.profile?.skill,
    item?.accountStatus,
    item?.email,
    item?.onboarding?.stage?.label,
    item?.rating,
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
    ];

    // Apply header styling (assuming headers start at A1)
    const headerCells = ["A1", "B1", "C1", "D1", "E1", "F1"];
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
        ContractorName: item?.name,
        // Date_Joined: formatDateToDDMMYY(item.createdAt),
        Skill:
          item?.profile?.skill === undefined
            ? "Not Submitted"
            : item?.profile?.skill,
        Status: item?.accountStatus,
        Email: item?.email,
        Stage: item?.onboarding?.stage?.label,
        Ratings: item?.rating,
      };
    });
    if (!dataToExport) return;

    type === "excel"
      ? exportToExcel(dataToExport, "ContractorList")
      : downloadPDF(columns, rows, "ContractorList", "Contractor List");

    handleModalClose();
  }

  return (
    <>
      <Header />
      {loadingSortedData ? (
        <LoadingTemplate />
      ) : (
        <PageBody>
          <div className="flex justify-between mb-6 items-center">
            <PageHeading page_title="Contractors" />
            <Filter />
            <DownloadButton
              text="Download Contractor’S LIST"
              onClick={handleModalOpen}
            />
          </div>
          <div className="overflow-x-auto mb-6">
            <div className="flex gap-8 min-w-[1200px]">
              <AnalyticCard
                icon={<CustomerIcon />}
                iconColor="bg-[#C398C7]"
                borderColor="border-l-[#721279]"
                name="Total Contractors"
                info={stats?.total?.toLocaleString()}
                tip="Total Contractors "
                status="All"
              />

              <AnalyticCard
                icon={<CompletedState />}
                iconColor="bg-[#dcffde]"
                borderColor="border-l-[#0D8012]"
                name="Approved Contractors"
                info={stats?.approved?.toLocaleString()}
                tip="Contractors that completed signup"
                status="approved"
              />
              <AnalyticCard
                icon={<CancelIconRed />}
                iconColor="bg-[#f7a7a7]"
                borderColor="border-l-[#9A0101]"
                name="Suspended Contractors"
                info={stats?.suspended?.toLocaleString()}
                tip="Contractors suspended by an admin"
                status="suspended"
              />

              <AnalyticCard
                icon={<JobIcon />}
                iconColor="bg-[#edf793]"
                borderColor="border-l-[#d1be12]"
                name="Contractors under Review"
                info={stats?.reviewing?.toLocaleString()}
                tip="Contractors with incomplete signup"
                status="reviewing"
              />

              <AnalyticCard
                icon={<ComplaintsState />}
                iconColor="bg-[#493b3b]"
                borderColor="border-l-[#5a5555]"
                name="Blacklisted Contractors"
                info={stats?.blacklisted?.toLocaleString()}
                tip="Contractors blacklisted by an admin"
                status="blaclisted"
              />
            </div>
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
              title="Contractor's List"
              exportExcel={() => handleDownloadPdf("excel")}
              exportPDF={() => handleDownloadPdf("pdf")}
            />
          </Modal>
          <ContractorsTable
            setLoading={setLoading}
            contractorData={dataToRender}
            handleSearch={handleQuery}
            setIsQuerying={setIsQuerying}
          />
        </PageBody>
      )}
    </>
  );
};

export default Contractors;
