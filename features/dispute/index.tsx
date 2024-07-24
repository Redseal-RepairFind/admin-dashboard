"use client";
import React, { useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import DisputeTable from "./components/DisputeTable";

const Index = () => {
  return (
    <>
      <Header />
      <PageBody>
        <DisputeTable />
      </PageBody>
    </>
  );
};

export default Index;
