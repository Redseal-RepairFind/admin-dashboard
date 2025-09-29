"use client";

import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import LoadingTemplate from "../layout/loading";
import EliteCustomersTable from "./elite-customers-table";
import useCustomers from "@/lib/hooks/useCustomers";
import AnalyticCard from "../jobs/components/analytic-card";
import {
  Customise,
  FilterIcon,
  QuotesGivenMetrics,
  Transactions,
} from "@/public/svg";
import { formatCurrency } from "@/lib/utils/curencyConverter";

const EliteCustomersIndex = () => {
  const {
    eliteEarningStats,
    eliteEarnings,
    isLoadingEliteEarningStats,
    isLoadingEliteEarnings,
  } = useCustomers();

  // console.log();

  const stats = eliteEarningStats?.data?.summary;
  return (
    <>
      <Header />
      {isLoadingEliteEarningStats || isLoadingEliteEarnings ? (
        <LoadingTemplate />
      ) : (
        <PageBody>
          <div className="mb-6">
            <PageHeading page_title="Elite Customers" />
          </div>
          <div className="overflow-x-auto mb-6">
            <div className="flex gap-8 min-w-[1200px]">
              <AnalyticCard
                icon={<Transactions />}
                iconColor="bg-[#C398C7]"
                borderColor="border-l-[#721279]"
                name="Total Elite Customers"
                info={stats?.totalEliteCustomers}
                tip="The Total Elite Customers count "
                status="All"
              />
              <AnalyticCard
                icon={<QuotesGivenMetrics />}
                iconColor="bg-[#d0f7d0]"
                borderColor="border-l-[#0D8012]"
                name="Total Earnings"
                info={formatCurrency(stats?.totalEarnings)}
                tip="Total  Earnings "
                status="true"
                statusName="customersWithBooking"
              />
              <AnalyticCard
                icon={<Customise />}
                iconColor="bg-[#d0f7d0]"
                borderColor="border-l-[#bfdf06]"
                name="Highest Customer Earnings"
                info={formatCurrency(stats?.highestEarning)}
                tip="Highest amount Earned by a Customer "
                status="true"
                statusName="customersWithBooking"
              />
              <AnalyticCard
                icon={<FilterIcon />}
                iconColor="bg-[#f7f5d0]"
                borderColor="border-l-[#f6f20b]"
                name="Pending Payouts"
                info={formatCurrency(stats?.pendingPayouts)}
                tip="Pending Amounts to be paid out "
                status="true"
                statusName="customersWithBooking"
              />
              <AnalyticCard
                icon={<Customise />}
                iconColor="bg-[#d0d7f7]"
                borderColor="border-l-[#0810a0]"
                name="Completed Payouts"
                info={formatCurrency(stats?.completedPayouts)}
                tip="Completed amounts paid out"
                status="true"
                statusName="customersWithBooking"
              />
            </div>
          </div>
          <EliteCustomersTable data={eliteEarnings?.data} />
        </PageBody>
      )}
    </>
  );
};

export default EliteCustomersIndex;
