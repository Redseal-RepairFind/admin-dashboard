"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "../layout/header/header";
import Searchbar from "../layout/header/components/searchbar";
import PageBody from "../shared/page-body/page-body";
// import JobsTable from "./components/table";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import {
  JobIcon,
  CompletedState,
  QuotesGivenMetrics,
  AverageDisputeResolutionTimeMetrics,
} from "@/public/svg";
import LoadingTemplate from "../layout/loading";

import { useCheckedList } from "@/context/checked-context";
import * as XLSX from "xlsx";
import Modal from "react-responsive-modal";
import ExportModal from "@/app/_components/ExportModal";

import Filter from "@/app/_components/Filter";
import { useSearchParams } from "next/navigation";
import { useSortedData } from "@/lib/hooks/useSortedData";
import { downloadPDF } from "@/lib/utils/downloadPdf";
import { trimString } from "@/lib/utils/trim-string";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import JobsTable from "./components/table";
import AnalyticCard from "../jobs/components/analytic-card";
const Jobs = () => {
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
    handleFrontEndQuery,
    setIsQuerying,
    isQuerying,
    queryedList,
    statusDataToRender,
  } = useSortedData("jobdays");

  // console.log(statusDataToRender?.data?.data[1]?.status?.toLowerCase().trim());

  useEffect(() => {
    isQuerying
      ? setDataToRender(queryedList)
      : setDataToRender(statusDataToRender);
  }, [isQuerying, queryedList, setDataToRender, statusDataToRender]);

  const totalJobs = sortedData?.data?.totalItems;
  const stats = sortedData?.data?.stats;

  const isLoading = loadingSortedData || loading;

  const columns = [
    "Customer’s Name",
    "Job ID",
    "Contractors’s Name",
    "Job Category",
    "Job Address",
    "Date",
    "Job Status",
  ];

  // console.log(sortedData);

  function contName(item: any) {
    const contractorName = `${item?.contractor?.firstName || "--"}  ${
      item?.contractor?.lastName || "--"
    }`;

    return contractorName;
  }

  // const rows = sortedData?.data?.data?.map((item: any) =>

  const rowsData =
    checkedList?.length > 0 ? checkedList : sortedData?.data?.data;
  const rows = rowsData?.map((item: any) => [
    item?.customer?.name,
    trimString(item?._id, 12),
    contName(item),
    trimString(item?.job?.category, 22),

    trimString(item?.jobLocation?.address, 22),
    formatDateToDDMMYY(item?.createdAt),
    trimString(item?.status, 22),
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
        CustomerName: item?.customer?.name,
        JobID: trimString(item?._id, 400),
        ContractorName: contName(item),
        Address: trimString(item?.location?.address, 400),
        Date: formatDateToDDMMYY(item?.createdAt),
        Status: trimString(item?.status, 22),
        Category: trimString(item?.job?.category, 22),
      };
    });

    if (!dataToExport.length) return;
    type === "excel"
      ? exportToExcel(dataToExport, "JobDaysList")
      : downloadPDF(columns, rows, "JobDaysList", "JobDay List");

    handleModalClose();
  }

  const analyticCards = [
    {
      icon: <JobIcon />,
      iconColor: "bg-[#C398C7]",
      borderColor: "border-l-[#721279]",
      name: "Total Booked Jobs",
      info: stats?.allJobdays,
      tip: "The total contractor trips started",
      status: "All",
    },
    {
      icon: <QuotesGivenMetrics />, // Placeholder icon for submitted jobs
      iconColor: "bg-[#bdecc6]",
      borderColor: "border-l-[#04ddae]",
      name: "Total Arrivals",
      info: stats?.totalArrived?.toLocaleString(),
      quotes: "Total Quotes",
      tip: "The total contractor trips waiting confirmation",
      // status: "",
    },
    {
      icon: <AverageDisputeResolutionTimeMetrics />,
      iconColor: "bg-[#f3f5d4]",
      borderColor: "border-l-[#e7cb2c]",
      name: "Total Jobs Started",
      info: stats?.totalStarted?.toLocaleString(),
      tip: "The total number of jobs started",
      // status: "",
    },
    {
      icon: <CompletedState />,
      borderColor: "border-l-[#326602]",
      name: "Total confirmed Arrivals",
      info: stats?.totalConfirmed?.toLocaleString(),
      iconColor: "bg-[#bdecc6]",
      tip: "The total contractor trips confirmed by Customer",
      // status: "confirmed",
    },
  ];

  return (
    <>
      <Header />
      {/* Page Body - Use for side padding on the top and sides */}
      {isLoading && <LoadingTemplate />}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Jobs" />
          <Filter />
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
            title="JobDay's List"
            exportExcel={() => handleDownloadPdf("excel")}
            exportPDF={() => handleDownloadPdf("pdf")}
          />
        </Modal>
        {/* Analytic Cards */}
        <div className="overflow-x-auto mb-6">
          <div className="flex flex-wrap gap-8 min-w-[1200px]">
            {analyticCards.map((card, index) => (
              <AnalyticCard
                icon={card?.icon}
                iconColor={card?.iconColor}
                borderColor={card?.borderColor}
                name={card?.name}
                info={card?.info}
                key={index}
                tip={card?.tip}
                status={card?.status}
              />
            ))}
          </div>
        </div>
        {/* Job Table */}
        <div className="my-10 flex flex-col">
          <div className="self-end mb-7">
            <DownloadButton
              text="Download JOB DAYS LIST"
              onClick={handleModalOpen}
            />
          </div>

          <JobsTable
            setLoading={setLoading}
            filteredData={dataToRender}
            handleSearch={handleFrontEndQuery}
            setIsQuerying={setIsQuerying}
          />
        </div>
      </PageBody>
    </>
  );
};

export default Jobs;
