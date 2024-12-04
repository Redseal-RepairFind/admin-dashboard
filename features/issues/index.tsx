"use client";
import React, { useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";

import PageHeading from "../shared/page-body/page-heading";
import IssuesTable from "./IssuesTable";

function Issues() {
  return (
    <>
      <Header />
      <PageBody>
        <div className="mb-6">
          <PageHeading page_title="Manage Issues" />
        </div>
        <IssuesTable />
      </PageBody>
    </>
  );
}

export default Issues;
