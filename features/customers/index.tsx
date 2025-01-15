"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import CustomersTable from "./components/table";
import PageHeading from "../shared/page-body/page-heading";
import LoadingTemplate from "../layout/loading";
import useCustomers from "@/lib/hooks/useCustomers";

import Filter from "@/app/_components/Filter";
import AnalyticCard from "../jobs/components/analytic-card";
import { Customers as CustomerIcon, QuotesGivenMetrics } from "@/public/svg";
import { useSearchParams } from "next/navigation";
import { filterData } from "./hooks/filterByDate";
import { useSortedData } from "@/lib/hooks/useSortedData";
import DownloadButton from "../shared/page-body/download-button";
import { downloadPDF } from "@/lib/utils/downloadPdf";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import { useCheckedList } from "@/context/checked-context";
import * as XLSX from "xlsx";
import Modal from "react-responsive-modal";
import ExportModal from "@/app/_components/ExportModal";

type FilterData = {
  customers: any[];
  totalCustomer: number; // Assuming totalCustomer is a number
};
export type Checked = {
  isChecked: boolean;
  items: any;
};

const Customers = () => {
  // Fetching customers data

  const [dataToRender, setDataToRender] = useState<any>();

  const {
    sortedData,
    loadingSortedData,
    handleQuery,
    setIsQuerying,
    isQuerying,
    queryedList,
  } = useSortedData("customers");
  const [openModal, setOpenModal] = useState(false);

  const { checkedList } = useCheckedList();

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  useEffect(() => {
    isQuerying ? setDataToRender(queryedList) : setDataToRender(sortedData);
  }, [isQuerying, queryedList, setDataToRender, sortedData]);
  const ref = useRef();

  const [loading, setLoading] = useState(true);

  // Getting filter params from URL
  // const params = useSearchParams();
  // const filterString = params.get("sort");

  const mainData = sortedData?.data;

  const totalCustumers = mainData?.totalItems;
  const customersWithBookings = mainData?.stats?.customersWithBooking;

  // console.log(mainData?.data?.map((data) => data?.status));

  const columns = ["Customer's Name", "Date Joined", "Email", "Phone Number"];

  const rowsData =
    checkedList?.length > 0 ? checkedList : sortedData?.data?.data;
  const rows = rowsData?.map((item: any) => [
    item?.name,
    formatDateToDDMMYY(item.createdAt),
    item?.email,
    `${item?.phoneNumber?.code} ${item?.phoneNumber?.number}`,
  ]);

  // console.log(rows);

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
        CustomerName: item?.name,
        Date_Joined: formatDateToDDMMYY(item.createdAt),
        Email: item?.email,
        PhoneNumber: `${item?.phoneNumber?.code} ${item?.phoneNumber?.number}`,
      };
    });
    type === "excel"
      ? exportToExcel(dataToExport, "Customer_List")
      : downloadPDF(columns, rows, "Customer_List", "Customer List");

    handleModalClose();
  }

  // console.log(sortedData);

  return (
    <>
      <Header />
      {loadingSortedData ? (
        <LoadingTemplate />
      ) : (
        <PageBody>
          <div className="flex justify-between mb-6 items-center">
            <PageHeading page_title="Customers" />
            <Filter />
            <DownloadButton
              text="Download Customer's LIST"
              onClick={handleModalOpen}
            />
          </div>

          <div className="overflow-x-auto mb-6">
            <div className="flex gap-8 min-w-[1200px]">
              <AnalyticCard
                icon={<CustomerIcon />}
                iconColor="bg-[#C398C7]"
                borderColor="border-l-[#721279]"
                name="Total Customers"
                info={totalCustumers?.toLocaleString()}
                tip="The Total Customers "
                status="All"
              />
              <AnalyticCard
                icon={<QuotesGivenMetrics />}
                iconColor="bg-[#d0f7d0]"
                borderColor="border-l-[#0D8012]"
                name="Total Customers with bookings"
                info={customersWithBookings?.toLocaleString()}
                tip="Total Customers that has bookings"
                status="true"
                statusName="customersWithBooking"
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
              title="Customer's List"
              exportExcel={() => handleDownloadPdf("excel")}
              exportPDF={() => handleDownloadPdf("pdf")}
            />
          </Modal>

          <CustomersTable
            filteredData={dataToRender}
            setLoading={setLoading}
            handleSearch={handleQuery}
            setIsQuerying={setIsQuerying}
          />
        </PageBody>
      )}
    </>
  );
};

export default Customers;
