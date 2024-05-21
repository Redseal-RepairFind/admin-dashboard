"use client";
import React, { useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import SubAdminsTable from "./table";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";

const SubAdmins = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingTemplate />}
      <Header>
        <></>
      </Header>
      {/* Page Body - Use for side padding on the top and sides */}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Sub Admins" />
          <DownloadButton text="Download Sub Admins LIST" />
        </div>
        <SubAdminsTable setLoading={setLoading} />
      </PageBody>
    </>
  );
};
export default SubAdmins;
