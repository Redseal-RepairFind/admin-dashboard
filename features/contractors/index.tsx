"use client";
import React, { useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import ContractorsTable from "./components/table";
import useContractors from "@/lib/hooks/useContractors";
import toast from "react-hot-toast";

const Contractors = () => {
  const [loading, setLoading] = useState(true);

  const { loadingContractors, downloadData } = useContractors();

  function convertToCSV(contractors: any) {
    const headers = [
      "Contractor Name",
      "Contractor Email",
      "Phone Number",
      "Account Type",
      "Skill",
      "GST Status",
      "Ratings",
    ];

    const rows = contractors.map((contractor: any) => [
      contractor?.name,
      contractor?.email,
      `${contractor?.phoneNumber?.code}${contractor?.phoneNumber?.number}`,
      contractor?.accountType,
      contractor?.profile?.skill,
      contractor?.status,
      contractor?.rating,
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    // Create a blob and trigger a download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "contractors.csv";
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Contractor list saved successfully...");
  }

  return (
    <>
      <Header />
      {loadingContractors && <LoadingTemplate />}
      {/* Page Body - Use for side padding on the top and sides */}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Contractors" />
          <DownloadButton
            onClick={() => {
              if (downloadData?.data) {
                convertToCSV(downloadData.data);
              } else {
                toast.error("No data available to download");
              }
            }}
            text="Download Contractor’S LIST"
          />
        </div>
        <ContractorsTable setLoading={setLoading} />
      </PageBody>
    </>
  );
};

export default Contractors;
