'use client'
import React, { useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import StaffTable from "./components/StaffTable";

const Index = () => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <Header />
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Staff" />
          {/* <DownloadButton text="Download Customer’S LIST" /> */}
        </div>
        <StaffTable setLoading={setLoading} />
      </PageBody>
    </>
  );
};

export default Index;
