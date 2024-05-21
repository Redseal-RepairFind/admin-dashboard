"use client";
import React, { useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import ContractorsTable from "./components/table";

const Contractors = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Header />
      {loading && <LoadingTemplate />}
      {/* Page Body - Use for side padding on the top and sides */}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Contractors" />
          <DownloadButton text="Download Contractor’S LIST" />
        </div>
        <ContractorsTable setLoading={setLoading} />
      </PageBody>
    </>
  );
};

export default Contractors;
