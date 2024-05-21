import React from "react";
import Header from "../layout/header/header";
import Searchbar from "../layout/header/components/searchbar";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import RepsTable from "./components/table";

const Representatives = () => {
  return (
    <>
      <Header />
      {/* Page Body - Use for side padding on the top and sides */}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Representives" />
          <DownloadButton text="Download Representive’s LIST" />
        </div>
        <RepsTable />
      </PageBody>
    </>
  );
};

export default Representatives;
