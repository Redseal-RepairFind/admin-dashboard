"use client";
import React, { useEffect, useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import DownloadButton from "../shared/page-body/download-button";
import LoadingTemplate from "../layout/loading";
import StaffTable from "./components/StaffTable";
import { useLoader } from "@/context/LoaderContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TeamsTable from "../shared/teams/components/teamsTable";

const types = [
  // { id: 1, value: "Staff", slug: "ALL" },
  { id: 2, value: "Staff", slug: "STAFFS" },
  { id: 3, value: "Teams", slug: "TEAMS" },
];

const Index = () => {
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("All");
  const { handleNavigation } = useLoader();

  const router = useRouter();
  const pathname = usePathname();
  const param = useSearchParams();

  const initialString = param.get("stafsStatus");
  const initialSortValue =
    param.get("stafsStatus")?.replace(/_/g, " ") || "STAFFS";

  const [sortValue, setSortValue] = useState(initialSortValue);

  useEffect(() => {
    const sortFromParam = param.get("stafsStatus");
    if (sortFromParam) {
      const updatedSortValue = sortFromParam.replace(/_/g, " ");
      setSortValue(updatedSortValue);
    }
  }, [param]);

  function updateUrlParams(value: string) {
    const formattedValue = value.replace(/ /g, "_").toLowerCase();

    if (value === "OPEN") {
      router.replace(`${pathname}`, {
        scroll: false,
      });
    } else {
      const params = new URLSearchParams(window.location.search);
      params.set("stafsStatus", formattedValue);
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }

    setSortValue(value);
    setStatus(value);
  }
  return (
    <>
      <Header />
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title={sortValue?.toLocaleUpperCase()} />
          {/* <DownloadButton text="Download Customer’S LIST" /> */}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-5 bg-white px-4 py-3 rounded-t-md">
            {types.map((type: any, index: number) => (
              <button
                className={
                  sortValue.toLowerCase() === type?.slug.toLowerCase()
                    ? "font-semibold border-b-2 border-black"
                    : "text-gray-400"
                }
                onClick={() => {
                  // sessionStorage.setItem("session_dispute_status", type.slug);
                  updateUrlParams(type.slug);
                }}
                key={index}
              >
                {type.value.includes("Reviewed") ? "Ongoing" : type.value}
              </button>
            ))}
          </div>
        </div>

        {sortValue?.toLowerCase().includes("staff") ? (
          <StaffTable setLoading={setLoading} />
        ) : (
          <TeamsTable />
        )}
      </PageBody>
    </>
  );
};

export default Index;
