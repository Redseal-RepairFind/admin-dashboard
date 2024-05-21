import React from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import StatsCardContainer from "./components/stats-card-container";
import TopContractors from "./components/top-contractors";
import MarketPlace from "./components/market-places";

const Analytics = () => {
  return (
    <>
      <Header />
      {/* Page Body - Use for side padding on the top and sides */}
      <PageBody>
        <PageHeading page_title="Analytics" />
        <StatsCardContainer />
        <TopContractors />
        <div className="grid grid-cols-2 gap-x-8 mb-6">
          <MarketPlace
            heading="Top marketplaces"
            subHeading="(Complaints)"
            data={[25, 20, 40, 35]}
          />
          <MarketPlace
            heading="Top marketplaces"
            subHeading="(Earnings)"
            data={[23, 35, 5, 37]}
          />
        </div>
      </PageBody>
    </>
  );
};

export default Analytics;
