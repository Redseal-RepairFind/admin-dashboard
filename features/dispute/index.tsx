"use client";
import React, { useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import DisputeTable from "./components/DisputeTable";
import { LoadScript } from "@react-google-maps/api";

const Index = () => {
  return (
    <>
      <LoadScript
        googleMapsApiKey={`${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
        libraries={["places"]}
      >
        <Header />
        <PageBody>
          <DisputeTable />
        </PageBody>
      </LoadScript>
    </>
  );
};

export default Index;
