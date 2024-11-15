"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "../layout/header/header";
import Searchbar from "../layout/header/components/searchbar";
import PageBody from "../shared/page-body/page-body";
import JobsTable from "./components/table";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import Calender from "../overview/components/calender";
import AnalyticCard from "./components/analytic-card";
import {
  CancelIconBlue,
  CancelIconRed,
  JobIcon,
  CompletedState,
  QuotesGivenMetrics,
  DisputesInitiatedMetrics,
  DisputesResolvedMetrics,
  ComplaintsState,
  AverageDisputeResolutionTimeMetrics,
  EmergencyCallMetrics,
  JobsStartedMetrics,
} from "@/public/svg";
import userPic from "@/public/admin-pic.png";
import LoadingTemplate from "../layout/loading";

import Filter from "@/app/_components/Filter";
import { useSearchParams } from "next/navigation";
import { useSortedData } from "@/lib/hooks/useSortedData";
import { downloadPDF } from "@/lib/utils/downloadPdf";
import { trimString } from "@/lib/utils/trim-string";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";

// import ReactExport from "react-data-export";

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
import * as XLSX from "xlsx";
import Modal from "react-responsive-modal";
import ExportModal from "@/app/_components/ExportModal";
import { useCheckedList } from "@/context/checked-context";

const Jobs = () => {
  const [loading, setLoading] = useState(true);
  // const [dataToRender, setDataToRender] = useState<any>();
  const [dataToRender, setDataToRender] = useState<any>();
  const [openModal, setOpenModal] = useState(false);
  const { checkedList } = useCheckedList();

  console.log(checkedList);

  const ref = useRef();
  const {
    sortedData,
    loadingSortedData,
    handleQuery,
    setIsQuerying,
    isQuerying,
    queryedList,
  } = useSortedData("jobs");

  useEffect(() => {
    isQuerying ? setDataToRender(queryedList) : setDataToRender(sortedData);
  }, [isQuerying, queryedList, setDataToRender, sortedData]);

  // const totalJobs = sortedData?.data?.totalItems;
  const stats = sortedData?.data?.stats;

  const isLoading = loadingSortedData || loading;

  const columns = [
    "Customer's Name",
    "Job ID",
    "Contractor's Name",
    "Job Address",
    "Date",
    "status",
  ];

  // console.log(sortedData);

  function contName(item: any) {
    const contractorName = `${item?.contractor?.firstName || "--"}  ${
      item?.contractor?.lastName || "--"
    }`;

    return contractorName;
  }
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const rowsData =
    checkedList?.length > 0 ? checkedList : sortedData?.data?.data;
  const rows = rowsData?.map((item: any) => [
    item?.customer?.name,
    trimString(item?._id, 12),
    contName(item),
    trimString(item?.location?.address, 22),
    formatDateToDDMMYY(item?.createdAt || new Date()),
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
        CustomerName: item?.customer?.name,
        JobID: trimString(item?._id, 400),
        ContractorName: contName(item),
        Address: trimString(item?.location?.address, 400),
        Date: formatDateToDDMMYY(item?.createdAt),
        Status: trimString(item?.status, 22),
      };
    });
    type === "excel"
      ? exportToExcel(dataToExport, "JobLists")
      : downloadPDF(columns, rows, "Job's.pdf", "Job's List");

    handleModalClose();
  }

  const analyticCards = [
    {
      icon: <JobIcon />,
      iconColor: "bg-[#C398C7]",
      borderColor: "border-l-[#721279]",
      name: "Total Jobs",
      info: stats?.allJobs,
      tip: "Total jobs",
    },
    {
      icon: <QuotesGivenMetrics />, // Placeholder icon for submitted jobs
      iconColor: "bg-[#bdecc6]",
      borderColor: "border-l-[#04ddae]",
      name: "Total Job Listings",
      info: stats?.totalJobListing.toLocaleString(),
      mostReq: stats?.totalQuotationsForListings,
      quotes: "Total Quotes",
      tip: "Total job listings and estimate submitted",
    },
    {
      icon: <AverageDisputeResolutionTimeMetrics />,
      iconColor: "bg-[#f3f5d4]",
      borderColor: "border-l-[#e7cb2c]",
      name: "Total Job Requests",
      info: stats?.totalJobRequest?.toLocaleString(),
      mostReq: stats?.totalQuotationsForRequests,
      quotes: "Total Quotes",
      tip: "Total job requests and estimate submitted",
    },
    {
      icon: <CompletedState />,
      borderColor: "border-l-[#326602]",
      name: "Total Completed Jobs",
      info: stats?.totalCompleted?.total?.toLocaleString(),
      iconColor: "bg-[#bdecc6]",
      percentage: stats?.totalCompleted?.percentage,
      tip: "Completed jobs",
    },
    {
      icon: <QuotesGivenMetrics />,
      borderColor: "border-l-[#d8cb12]",
      name: "Total Booked Jobs",
      info: stats?.totalBooked?.total?.toLocaleString(),
      iconColor: "bg-[#ebf375]",
      percentage: stats?.totalBooked?.percentage,
      tip: "Total number of successfully booked jobs",
    },
    {
      icon: <CancelIconBlue />,
      iconColor: "bg-[#AAB2D4]",
      borderColor: "border-l-[#00235B]",
      name: "Total Disputed Jobs",
      percentage: stats?.totalDisputed?.percentage,
      info: stats?.totalDisputed?.total?.toLocaleString(),
      tip: "Total Booked Jobs in dispute",
    },
    {
      icon: <CancelIconRed />,
      iconColor: "bg-[#F6B7B7]",
      borderColor: "border-l-[#9A0101]",
      name: "Total Cancelled Jobs",
      percentage: stats?.totalCanceled?.percentage,
      info: stats?.totalCanceled?.total?.toLocaleString(),
      tip: "Total Booked jobs that got cancelled",
    },
    {
      icon: <DisputesInitiatedMetrics />,
      iconColor: "bg-[#bbc0cf]",
      borderColor: "border-l-[#0c062e]",
      name: "Total Pending Jobs",
      percentage: stats?.totalPending?.percentage,
      info: stats?.totalPending?.total?.toLocaleString(),
      tip: "New Job listings and requests",
    },
    {
      icon: <ComplaintsState />,
      iconColor: "bg-[#d6e2e6]",
      borderColor: "border-l-[#200414]",
      name: "Total Expired Jobs",
      percentage: stats?.totalExpired?.percentage,
      info: stats?.totalExpired?.total?.toLocaleString(),
      tip: "Total Expired Jobs",
    },
    {
      icon: <AverageDisputeResolutionTimeMetrics />,
      iconColor: "bg-[#f3f5d4]",
      borderColor: "border-l-[#e7cb2c]",
      name: "Total Jobs in Progress",
      percentage: stats?.totalOngoing?.percentage,
      info: stats?.totalOngoing?.total?.toLocaleString(),
      tip: "Total jobs currently in progress",
    },
    // {
    //   icon: <EmergencyCallMetrics />,
    //   iconColor: "bg-[#d48bc4]",
    //   borderColor: "border-l-[#e72c99]",
    //   name: "Total Jobs Not Started",
    //   percentage: stats?.totalNotStarted?.percentage,
    //   info: stats?.totalNotStarted?.total?.toLocaleString(),
    //   tip: "Total Jobs not started yet",
    // },
    // {
    //   icon: <QuotesGivenMetrics />, // Placeholder icon for submitted jobs
    //   iconColor: "bg-[#bdecc6]",
    //   borderColor: "border-l-[#32a8a8]",
    //   name: "Total Submitted Jobs",
    //   info: stats?.totalSubmitted?.total?.toLocaleString(),
    //   percentage: stats?.totalSubmitted?.percentage,
    //   tip: "Total Job requests with quotations",
    // },
    {
      icon: <DisputesResolvedMetrics />, // Placeholder icon for accepted jobs
      iconColor: "bg-[#b3d9e2]",
      borderColor: "border-l-[#003366]",
      name: "Total Accepted Jobs",
      info: stats?.totalAccepted?.total?.toLocaleString(),
      percentage: stats?.totalAccepted?.percentage,
      tip: "Total Job requests accepted ",
    },
    {
      icon: <JobsStartedMetrics />, // Placeholder icon for most requested category
      iconColor: "bg-[#dfb25e]",
      borderColor: "border-l-[#d9882c]",
      name: "Most Requested Category",
      info: stats?.mostRequestedCategory?._id,
      mostReq: stats?.mostRequestedCategory?.count,
      // percentage: stats?.totalAccepted?.percentage,
      tip: "Most reqested job category",
    },
    // {
    //   icon:  <div>
    //       <img
    //         src={stats.topRatedContractor.profilePhoto.url}
    //         alt="Top Rated Contractor"
    //         className="w-12 h-12 rounded-full"
    //       />
    //     </div>, // Save this as the new icon for top-rated contractor
    //   iconColor: "bg-[#d4e4f3]",
    //   borderColor: "border-l-[#005bb5]",
    //   name: "Top Rated Contractor",
    //   info: (

    //   ),
    // },
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
            title="Job's List"
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
                percentage={card?.percentage}
                mostReq={card?.mostReq}
                quotes={card?.quotes}
                tip={card?.tip}
              />
            ))}
          </div>
        </div>
        {/* Job Table */}
        <div className="my-10 flex flex-col">
          <div className="self-end mb-7">
            <DownloadButton
              text="Download JOB LIST"
              onClick={handleModalOpen}
            />
          </div>

          <JobsTable
            setLoading={setLoading}
            filteredData={dataToRender}
            handleSearch={handleQuery}
            setIsQuerying={setIsQuerying}
          />
        </div>
      </PageBody>
    </>
  );
};

export default Jobs;
