"use client";
import React, { useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import GstTable from "./components/GstTable";

const Index = () => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <Header />
      <PageBody>
        <GstTable setLoading={setLoading} />
      </PageBody>
    </>
  );
};

export default Index;
