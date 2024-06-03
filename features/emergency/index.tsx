"use client";
import React, { useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import EmergencyTable from "./components/EmergencyTable";

const Index = () => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Header />
      <PageBody>
        <EmergencyTable setLoading={setLoading} />
      </PageBody>
    </>
  );
};

export default Index;
