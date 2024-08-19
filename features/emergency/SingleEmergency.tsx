"use client";

import React, { useState } from "react";
import { FaCaretLeft, FaArrowLeft } from "react-icons/fa";
import { ComplaintsState, CompletedState } from "@/public/svg";
import useEmergency from "@/lib/hooks/useEmergency";
// import JobInformation from "./components/JobInformation";
import { useRouter } from "next/navigation";
import SectionContainer from "../../features/dispute/components/SectionContainer";

const SingleDispute = () => {
  // const [currentDisputeTab, setCurrentDisputeTab] = useState("information");

  const router = useRouter();

  const { singleEmergency } = useEmergency();

  console.log(singleEmergency);

  const status = "RESOLVED";

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="p-5">
      <div className="bg-white rounded-lg py-4 w-full px-5 mt-4 mb-8 font-semibold text-lg">
        Emergency
      </div>
      <div className="flex items-center justify-between">
        <button onClick={handleBack}>
          <FaArrowLeft />
        </button>
        <div className="flex items-center justify-center gap-2 px-5 py-2 bg-white">
          Status
          {status !== "RESOLVED" ? (
            <>
              <ComplaintsState />
              <p className="text-danger">Active</p>
            </>
          ) : (
            <>
              <CompletedState />
              <p className="text-success">Resolved</p>
            </>
          )}
        </div>
      </div>
      <div className="mt-5 w-full rounded-md">
        <SectionContainer title="Media">
          <div></div>
        </SectionContainer>
        <SectionContainer title="Description">
          <div className="pb-3">
            <p className="bg-gray-100 rounded-md p-2">
              {singleEmergency?.data?.description}
            </p>
          </div>
        </SectionContainer>
      </div>
    </div>
  );
};

export default SingleDispute;
