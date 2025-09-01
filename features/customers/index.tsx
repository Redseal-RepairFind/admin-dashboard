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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { filterData } from "./hooks/filterByDate";
import { useSortedData } from "@/lib/hooks/useSortedData";
import DownloadButton from "../shared/page-body/download-button";
import { downloadPDF } from "@/lib/utils/downloadPdf";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import { useCheckedList } from "@/context/checked-context";
import * as XLSX from "xlsx";
import Modal from "react-responsive-modal";
import ExportModal from "@/app/_components/ExportModal";
import { ConfirmModal, ModalType } from "../contractors";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import FilterCalendar from "../contractors/components/filter-calendar";
import { useSubscription } from "@/lib/hooks/useSubscriptions";
import { formatCurrency } from "@/lib/utils/curencyConverter";

type FilterData = {
  customers: any[];
  totalCustomer: number; // Assuming totalCustomer is a number
};
export type Checked = {
  isChecked: boolean;
  items: any;
};

const types = [
  // { id: 1, value: "Staff", slug: "ALL" },
  { id: 2, value: "All Subscribed Customers", slug: "ALL" },
  { id: 3, value: "Unknown Equpment age", slug: "UNKNOWN" },
];

const Customers = ({ type = "norm" }: { type: "sub" | "norm" }) => {
  // Fetching customers data

  const {
    sortedData,
    loadingSortedData,
    handleQuery,
    setIsQuerying,
    isQuerying,
    queryedList,
    allData,
    setSearchTerm,
    loadingAllData,
    refetch,
    isRefetchingSortedData,
  } = useSortedData("customers");

  const {
    subAnalytics,
    isLoadingSubAnalytics,
    subData,
    loadingSubData,
    isRefetchingSubData,
    refetchSubData,
  } = useSubscription(type);

  const [openModal, setOpenModal] = useState<ModalType>({
    isOpen: false,
    content: "",
  });
  const nodeRef = useRef(null);

  const { checkedList } = useCheckedList();

  const handleModalOpen = () => setOpenModal({ ...openModal, isOpen: true });
  const handleModalClose = () => {
    setOpenModal({ ...openModal, isOpen: false, content: "" });
    setIsQuerying(false);
  };

  const router = useRouter();
  const pathname = usePathname();
  const param = useSearchParams();

  const initialString = param.get("sub");
  const initialSortValue = param.get("sub")?.replace(/_/g, " ") || "all";

  const [sortValue, setSortValue] = useState(initialSortValue);

  useEffect(() => {
    const sortFromParam = param.get("sub");
    if (sortFromParam) {
      const updatedSortValue = sortFromParam.replace(/_/g, " ");
      setSortValue(updatedSortValue);
    }
  }, [param]);

  function updateUrlParams(value: string) {
    const formattedValue = value.replace(/ /g, "_").toLowerCase();

    if (value === "OPEN") {
      router.replace(`${pathname}`, {
        scroll: false,
      });
    } else {
      const params = new URLSearchParams(window.location.search);
      params.set("sub", formattedValue);
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }

    setSortValue(value);
    // setStatus(value);
  }

  // useEffect(() => {
  //   isQuerying ? setDataToRender(sortedData) : setDataToRender(sortedData);
  // }, [isQuerying, queryedList, setDataToRender, sortedData]);
  const ref = useRef();

  const [loading, setLoading] = useState(true);

  // Getting filter params from URL
  // const params = useSearchParams();
  // const filterString = params.get("sort");

  const mainData = sortedData?.data;

  const totalCustumers = mainData?.totalItems;
  const customersWithBookings = mainData?.stats?.customersWithBooking;

  // console.log(mainData?.data?.map((data) => data?.status));

  const columns = ["CustomerName", "Date_Joined", "Email", "PhoneNumber"];

  const rowsData =
    openModal.content === "full" && isQuerying
      ? allData?.data?.data
      : checkedList?.length > 0
      ? checkedList
      : sortedData?.data?.data;
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

  function handleSelected(type: "" | "full" | "selected") {
    setOpenModal({ ...openModal, content: type });

    if (type === "full") {
      setIsQuerying(true);
    } else {
      setIsQuerying(false);
    }
  }

  // console.log(subData);

  const itisLoading =
    loadingSortedData || isLoadingSubAnalytics || loadingSubData;
  // ||
  // isRefetchingSubData;

  return (
    <>
      <Header />
      {itisLoading && !isQuerying ? (
        <LoadingTemplate />
      ) : (
        <PageBody>
          <div className="flex justify-between mb-6 items-center">
            <PageHeading
              page_title={
                type === "norm" ? "Customers" : "Subscription Customers"
              }
            />
            <FilterCalendar />
            <DownloadButton
              text="Download Customer's LIST"
              onClick={handleModalOpen}
            />
          </div>

          <div className="overflow-x-auto mb-6">
            {type === "norm" ? (
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
            ) : (
              <div className="flex gap-8 min-w-[1200px]">
                <AnalyticCard
                  icon={<CustomerIcon />}
                  iconColor="bg-[#C398C7]"
                  borderColor="border-l-[#721279]"
                  name="Total Subscription Revenue"
                  info={formatCurrency(subAnalytics?.data?.total?.revenue)}
                  tip="The Total Revenue generated "
                  status="All"
                />
                {subAnalytics?.data?.statusCounts?.map(
                  (sub: any, i: number) => (
                    <AnalyticCard
                      icon={<CustomerIcon />}
                      iconColor={
                        sub?._id === "ACTIVE" ? "bg-[#d0f7d0]" : "bg-[#eaec8f]"
                      }
                      borderColor={
                        sub?._id === "ACTIVE"
                          ? "border-l-[#0D8012]"
                          : "border-l-[#e5e526]"
                      }
                      name={
                        sub?._id === "ACTIVE"
                          ? "Active Subscriptions"
                          : "Pending Subscriptions"
                      }
                      info={sub?.count}
                      tip={
                        sub?._id === "ACTIVE"
                          ? "The Total Active customer subscriptions"
                          : "The Total Pending Customer Subscriptions "
                      }
                      status="All"
                      key={i}
                    />
                  )
                )}
              </div>
            )}
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
            {/* <ExportModal
              title="Customer's List"
              exportExcel={() => handleDownloadPdf("excel")}
              exportPDF={() => handleDownloadPdf("pdf")}
            /> */}

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
                      title="Customer's List"
                      exportExcel={() => handleDownloadPdf("excel")}
                      exportPDF={() => handleDownloadPdf("pdf")}
                      data={rowsData}
                      loading={loadingAllData}
                      headers={columns}
                      name="Customer's List"
                      rowMapper={(item: any) => ({
                        CustomerName: item?.name,
                        Date_Joined: formatDateToDDMMYY(item.createdAt),
                        Email: item?.email,
                        PhoneNumber: `${item?.phoneNumber?.code} ${item?.phoneNumber?.number}`,
                      })}
                      close={handleModalClose}
                      size="A4"
                    />
                  )}
                </div>
              </CSSTransition>
            </TransitionGroup>
          </Modal>
          {type === "norm" ? null : (
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start gap-5 bg-white px-4 py-3 rounded-t-md">
                {types.map((type: any, index: number) => (
                  <button
                    className={
                      sortValue.toLowerCase() === type?.slug.toLowerCase()
                        ? "font-semibold border-b-2 border-black"
                        : "text-gray-400"
                    }
                    onClick={() => {
                      // sessionStorage.setItem("session_dispute_status", type.slug);
                      updateUrlParams(type.slug);
                    }}
                    key={index}
                  >
                    {type.value}
                  </button>
                ))}
              </div>
            </div>
          )}
          <CustomersTable
            filteredData={type === "norm" ? sortedData : subData}
            setLoading={setLoading}
            handleSearch={handleQuery}
            setIsQuerying={setIsQuerying}
            isQuerying={isQuerying}
            loadingSortedData={loadingSortedData}
            setSearchTerm={setSearchTerm}
            refetch={type === "norm" ? refetch : refetchSubData}
            isRefetching={isRefetchingSortedData}
            type={type}
          />
        </PageBody>
      )}
    </>
  );
};

export default Customers;
