"use client";
import React, { useEffect, useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";

import PageHeading from "../shared/page-body/page-heading";
import IssuesTable from "./IssuesTable";
import { useSortedData } from "@/lib/hooks/useSortedData";

function Issues() {
  const {
    issuesData: sortedData,
    queryedList,
    isQuerying,
    loadingSortedData,
  } = useSortedData("issues");

  // Initialize with the correct default data
  const [dataToRender, setDataToRender] = useState<any>(
    isQuerying ? queryedList : sortedData
  );

  useEffect(() => {
    // Update data based on `isQuerying` state
    setDataToRender(isQuerying ? queryedList : sortedData);
  }, [isQuerying, queryedList, sortedData]);

  return (
    <>
      <Header />
      <PageBody>
        <div className="mb-6">
          <PageHeading page_title="Manage Issues" />
        </div>
        <IssuesTable dataToRender={dataToRender} />
      </PageBody>
    </>
  );
}

export default Issues;
