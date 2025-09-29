"use client";
import React, { useEffect, useState } from "react";

import Header from "@/features/layout/header/header";
import PageBody from "@/features/shared/page-body/page-body";
import PageHeading from "@/features/shared/page-body/page-heading";
import FeedbacksTable from "./feedbacksTable";

function Feedbacks() {

  return (
    <>
      <Header />
      <PageBody>
        <div className="mb-6">
          <PageHeading page_title="Feed backs" />
        </div>
        <FeedbacksTable />
      </PageBody>
    </>
  );
}

export default Feedbacks;
