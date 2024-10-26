"use client";
import React, { useState, useEffect } from "react";
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
} from "@/public/svg";
import { useSortedData } from "@/lib/hooks/useSortedData";
import AnalyticCard from "../jobs/components/analytic-card";
import { downloadPDF } from "@/lib/utils/downloadPdf";
import { formatCurrency } from "@/lib/utils/curencyConverter";

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [dataToRender, setDataToRender] = useState<any>();

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

  //  jobPaymentsAmount, paypalCharges{amount, percentage, fixedFee, total}
  // pendingEscrowAmount { total, count , percentage}
  // pendingPayoutAmount{ total, count , percentage}
  // refundEscrowAmount{ total, count , percentage}
  //  successfulPayoutAmount{ total, count , percentage}
  return (
    <>
      <Header />
      {/* Page Body - Use for side padding on the top and sides */}
      {loading || (loadingSortedData && <LoadingTemplate />)}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Transactions" />
          <Filter />

          <DownloadButton text="Download Transaction’s LIST" />
        </div>
        <div className="overflow-x-auto mb-6">
          <div className="flex gap-8 min-w-[1200px]">
            <AnalyticCard
              icon={<CustomerIcon />}
              iconColor="bg-[#C398C7]"
              borderColor="border-l-[#721279]"
              name="Jobs Payment Amount"
              info={formatCurrency(stats?.jobPaymentsAmount?.total)}
              tip="Total Payments Amount"
              // percentage={stats?.jobPaymentsAmount?.paypalCharges?.percentage}
              // mostReq={0}
              // quotes={0}
            />
            <AnalyticCard
              icon={<CompletedState />}
              iconColor="bg-[#dcffde]"
              borderColor="border-l-[#0D8012]"
              name="Successful Payouts Amount"
              info={formatCurrency(stats?.successfulPayoutAmount?.total)}
              tip="Total Successful Payouts Amount"
              percentage={stats?.successfulPayoutAmount?.percentage}
            />
            <AnalyticCard
              icon={<JobIcon />}
              iconColor="bg-[#edf793]"
              borderColor="border-l-[#d1be12]"
              name="Pending Escrow Amounts"
              info={formatCurrency(stats?.pendingEscrowAmount?.total)}
              tip="Total pending escrow payments"
              percentage={stats?.pendingEscrowAmount?.percentage}
            />
            {/* pendingPayoutAmount */}
            <AnalyticCard
              icon={<CancelIconRed />}
              iconColor="bg-[#f7a7a7]"
              borderColor="border-l-[#9A0101]"
              name="Pending Payout Amounts"
              info={formatCurrency(stats?.pendingPayoutAmount?.total)}
              tip="Total pending Payouts payment"
              percentage={stats?.pendingPayoutAmount?.percentage}
            />
            <AnalyticCard
              icon={<ComplaintsState />}
              iconColor="bg-[#493b3b]"
              borderColor="border-l-[#5a5555]"
              name="Refunded Escrow Amounts"
              info={formatCurrency(stats?.refundEscrowAmount?.total)}
              tip="Total Escrow Refund  payment"
              percentage={stats?.refundEscrowAmount?.percentage}
            />
          </div>
        </div>
        <CustomersTable setLoading={setLoading} data={dataToRender} />
      </PageBody>
    </>
  );
};

export default Transactions;
