"use client";
import React, { useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import Promotion from "../customise/components/promotions/Promotion";

const Index = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Header />
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Promotions" />
          {/* <DownloadButton text="Download Customer’S LIST" /> */}
        </div>
        <Promotion />
      </PageBody>
    </>
  );
};

export default Index;
