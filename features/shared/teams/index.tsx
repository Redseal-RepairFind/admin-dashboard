"use client";
import Header from "@/features/layout/header/header";
import React, { useState } from "react";
import PageBody from "../page-body/page-body";
import PageHeading from "../page-body/page-heading";
import TeamsTable from "./components/teamsTable";
// import Header from "../layout/header/header";
// import PageBody from "../shared/page-body/page-body";
// import PageHeading from "../shared/page-body/page-heading";
// import DownloadButton from "../shared/page-body/download-button";
// import LoadingTemplate from "../layout/loading";
// import StaffTable from "./components/StaffTable";

const Index = () => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <Header />
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Teams" />
          {/* <DownloadButton text="Download Customer’S LIST" /> */}
        </div>
        <TeamsTable />
      </PageBody>
    </>
  );
};

export default Index;
