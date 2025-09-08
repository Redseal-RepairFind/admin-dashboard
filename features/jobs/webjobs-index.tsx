"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "../layout/header/header";
import Searchbar from "../layout/header/components/searchbar";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
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
import LoadingTemplate from "../layout/loading";

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
import FilterCalendar from "../contractors/components/filter-calendar";
import { ConfirmModal, ModalType } from "../contractors";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import WebJobsTable from "./components/webTable";

const WebJobs = () => {
  const [loading, setLoading] = useState(false);
  // const [dataToRender, setDataToRender] = useState<any>();
  const [dataToRender, setDataToRender] = useState<any>();
  const { checkedList } = useCheckedList();
  const searchParams = useSearchParams();
  const listStatus = searchParams.get("listStatus") || "All";
  const [openModal, setOpenModal] = useState<ModalType>({
    isOpen: false,
    content: "",
  });
  const nodeRef = useRef(null);

  const handleModalOpen = () => setOpenModal({ ...openModal, isOpen: true });
  const handleModalClose = () => {
    setOpenModal({ ...openModal, isOpen: false, content: "" });
    setIsQuerying(false);
  };
  const ref = useRef();
  const {
    sortedData,
    loadingSortedData,
    handleFrontEndQuery,
    setIsQuerying,
    isQuerying,
    queryedList,
    statusDataToRender,
    loadingAllData,
    allData,
  } = useSortedData("web-jobs");

  // console.log(listStatus, statusDataToRender);
  useEffect(() => {
    isQuerying
      ? setDataToRender(queryedList)
      : setDataToRender(statusDataToRender);
  }, [isQuerying, queryedList, setDataToRender, statusDataToRender]);

  // const totalJobs = sortedData?.data?.totalItems;
  const stats = sortedData?.data?.stats;

  const isLoading = loadingSortedData || loading;

  const columns = [
    "Job creation date",
    "Requester's FullName",
    "Requester's email",
    "Requester's phone",
    "Customer Opened Email",
    "Requester has used app",
    "Last Login Date",
    "Number of estimates submitted",
    "No. of site vistis requested",
    "Was site visit booked",
    "Was Site visit completed",
    "Has booked Job",
    "Is Job completed",
    "Job category",
  ];

  // console.log(sortedData);

  function contName(item: any) {
    const contractorName = `${item?.contractor?.firstName || "--"}  ${
      item?.contractor?.lastName || "--"
    }`;

    return contractorName;
  }
  const rowsData =
    openModal.content === "full" && isQuerying
      ? allData?.data?.jobs
      : checkedList?.length > 0
      ? checkedList
      : sortedData?.data?.jobs;
  const rows = rowsData?.map((item: any) => [
    formatDateToDDMMYY(item?.createdAt || new Date()),
    `${item?.requesterFirstName || "--"} ${item?.requesterLastName || "--"}`,
    item?.requesterEmail || "--",
    item?.requesterPhone || "--",
    item?.hasLoggedIn ? "Yes" : "No",
    item?.lastLogin ? formatDateToDDMMYY(item?.lastLogin) : "Not logged in yet",
    item?.metadata?.isCustomerEmailOpened
      ? `Yes, email opened on ${formatDateToDDMMYY(
          item?.metadata?.customerEmailOpenedAt
        )}`
      : "Not yet",
    item?.estimatesCount || "0",
    item?.siteVisitsCount || "0",
    item?.wasSiteVisitBooked ? "Yes" : "No",
    item?.wasSiteVisitCompleted ? "Yes" : "No",
    item?.jobScheduled ? "Yes" : "No",
    item?.jobCompleted ? "Yes" : "No",
    item?.category ? item?.category : "",
  ]);

  const exportToExcel = (data: any, fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Apply column widths
    worksheet["!cols"] = [
      { wch: 25 }, // CustomerName column width
      { wch: 15 }, // ID column width
      { wch: 25 }, // ContractorName column width
      { wch: 20 }, // Address column width
      { wch: 15 }, // Date column width
      { wch: 20 }, // Status column width
      { wch: 15 }, // ID column width
      { wch: 25 }, // ContractorName column width
      { wch: 20 }, // Address column width
      { wch: 15 }, // Date column width
      { wch: 20 }, // Status column width
      { wch: 20 }, // Status column width
      { wch: 20 }, // Status column width
    ];

    // Apply header styling (assuming headers start at A1)
    const headerCells = [
      "A1",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
      "I1",
      "J1",
      "K1",
      "L1",
      "M1",
    ];
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
        JobCreationDate: formatDateToDDMMYY(item?.createdAt || new Date()),
        RequesterFullName: `${item?.requesterFirstName || "--"} ${
          item?.requesterLastName || "--"
        }`,
        RequesterEmail: item?.requesterEmail || "--",
        RequesterPhone: item?.requesterPhone || "--",
        EmailOpened: `${
          item?.metadata?.isCustomerEmailOpened
            ? `Yes, email opened on ${formatDateToDDMMYY(
                item?.metadata?.customerEmailOpenedAt
              )}`
            : "Not yet"
        }`,
        RequesterHasUsedApp: item?.hasLoggedIn ? "Yes" : "No",
        LastLoginDate: item?.lastLogin
          ? formatDateToDDMMYY(item?.lastLogin)
          : "Not logged in yet",
        NumberOfEstimatesSubmitted: item?.estimatesCount || "0",
        NumberOfBookedSiteVisit: item?.siteVisitsCount || "0",
        HasBookedSiteVisit: item?.wasSiteVisitBooked ? "Yes" : "No",
        IsSiteVisitCompleted: item?.wasSiteVisitCompleted ? "Yes" : "No",
        HasBookedJob: item?.jobScheduled ? "Yes" : "No",
        IsJobCompleted: item?.jobCompleted ? "Yes" : "No",
        JobCategory: item?.category,
      };
    });
    type === "excel"
      ? exportToExcel(dataToExport, "WebJobLists")
      : downloadPDF(columns, rows, "WebJob's.pdf", "WebJob's List");

    handleModalClose();
  }

  function handleSelected(type: "" | "full" | "selected") {
    setOpenModal({ ...openModal, content: type });

    if (type === "full") {
      setIsQuerying(true);
    } else {
      setIsQuerying(false);
    }
  }

  // console.log(rows, "rowsData");

  const analyticCards = [
    {
      icon: <JobIcon />,
      iconColor: "bg-[#C398C7]",
      borderColor: "border-l-[#721279]",
      name: "List of job requests from web",
      info: stats?.allJobs,
      tip: "Total jobs",
      status: "All",
    },
    {
      icon: <QuotesGivenMetrics />,
      borderColor: "border-l-[#d8cb12]",
      name: "Total Booked Jobs from web",
      info: stats?.totalBooked?.total?.toLocaleString(),
      iconColor: "bg-[#ebf375]",
      percentage: stats?.totalBooked?.percentage,
      tip: "Total number of successfully booked jobs",
      // status: "booked",
    },
    {
      icon: <QuotesGivenMetrics />, // Placeholder icon for submitted jobs
      iconColor: "bg-[#bdecc6]",
      borderColor: "border-l-[#04ddae]",
      name: "Total Job Completed from web",
      info: stats?.totalCompleted?.total?.toLocaleString(),
      percentage: stats?.totalCompleted?.percentage,
      // quotes: "Total Quotes",
      tip: "Total number of jobs completed",
      status: "listing",
    },
    {
      icon: <AverageDisputeResolutionTimeMetrics />,
      iconColor: "bg-[#f3f5d4]",
      borderColor: "border-l-[#e7cb2c]",
      name: "Percentage of jobs completed",
      percentage: stats?.totalCompleted?.percentage,
      mostReq: stats?.totalQuotationsForRequests,
      // quotes: "Total Quotes",
      tip: "Total percentage of completed jobs",
      status: "request",
    },
  ];

  return (
    <>
      <Header />
      {/* Page Body - Use for side padding on the top and sides */}
      {isLoading ? <LoadingTemplate /> : null}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Jobs" />
          <FilterCalendar />
          <div></div>
        </div>

        <Modal
          open={openModal.isOpen}
          onClose={handleModalClose}
          classNames={{
            modal: "customModal",
          }}
          container={ref.current}
          center
        >
          <TransitionGroup>
            <CSSTransition
              key={openModal.content}
              timeout={1000}
              classNames="fade"
              nodeRef={nodeRef} // Add the ref here
            >
              <div ref={nodeRef}>
                {openModal.content === "" ? (
                  <ConfirmModal onHandleSelected={handleSelected} />
                ) : (
                  <ExportModal
                    title="Web Job's List"
                    exportExcel={() => handleDownloadPdf("excel")}
                    exportPDF={() => handleDownloadPdf("pdf")}
                    name="Web Job List"
                    data={rowsData}
                    headers={columns}
                    loading={loadingAllData}
                    rowMapper={(item: any) => ({
                      JobCreationDate: formatDateToDDMMYY(
                        item?.createdAt || new Date()
                      ),
                      RequesterFullName: `${item?.requesterFirstName || "--"} ${
                        item?.requesterLastName || "--"
                      }`,
                      RequesterEmail: item?.requesterEmail || "--",
                      RequesterPhone: item?.requesterPhone || "--",
                      RequesterHasUsedApp: item?.hasLoggedIn ? "Yes" : "No",
                      EmailOpened: `${
                        item?.metadata?.isCustomerEmailOpened
                          ? `Yes, email opened on ${formatDateToDDMMYY(
                              item?.metadata?.customerEmailOpenedAt
                            )}`
                          : "Not yet"
                      }`,
                      LastLoginDate: item?.lastLogin
                        ? formatDateToDDMMYY(item?.lastLogin)
                        : "Not logged in yet",
                      NumberOfEstimatesSubmitted: item?.estimatesCount || "0",
                      NumberOfBookedSiteVisit: item?.siteVisitsCount || "0",
                      HasBookedSiteVisit: item?.wasSiteVisitBooked
                        ? "Yes"
                        : "No",
                      IsSiteVisitCompleted: item?.wasSiteVisitCompleted
                        ? "Yes"
                        : "No",
                      HasBookedJob: item?.jobScheduled ? "Yes" : "No",
                      IsJobCompleted: item?.jobCompleted ? "Yes" : "No",
                      JobCategory: item?.category,
                    })}
                    close={handleModalClose}
                  />
                )}
              </div>
            </CSSTransition>
          </TransitionGroup>
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
                // quotes={card?.quotes}
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
              text="Download Web JOB LIST"
              onClick={handleModalOpen}
            />
          </div>

          <WebJobsTable
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

export default WebJobs;
