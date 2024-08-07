"use client";
import React, { useEffect, useState } from "react";
import Header from "../layout/header/header";
import Searchbar from "../layout/header/components/searchbar";
import PageBody from "../shared/page-body/page-body";
import CustomersTable from "./components/table";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import useCustomers from "@/lib/hooks/useCustomers";

const Customers = () => {
  const [loading, setLoading] = useState(true);

  const { loadingCustomers } = useCustomers();

  // console.log(customerData, loadingCustomers);
  return (
    <>
      <Header />
      {/* Page Body - Use for side padding on the top and sides */}
      {loadingCustomers && <LoadingTemplate />}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Customers" />
          {/* <DownloadButton text="Download Customer’S LIST" /> */}
        </div>
        <CustomersTable setLoading={setLoading} />
      </PageBody>
    </>
  );
};

export default Customers;
