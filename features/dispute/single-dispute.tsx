"use client";

import React, { useState } from "react";
import { FaCaretLeft, FaArrowLeft } from "react-icons/fa";
import TabSwitch from "./components/TabSwitch";
import { ComplaintsState, CompletedState } from "@/public/svg";
import JobInformation from "./components/JobInformation";
import Chat from "./components/Chat";
import useDisputes from "@/lib/hooks/useDisputes";
import { useRouter } from "next/navigation";
import { LoadScript } from "@react-google-maps/api";

const SingleDispute = () => {
  const [currentDisputeTab, setCurrentDisputeTab] = useState("information");

  const router = useRouter();

  const { singleDispute } = useDisputes();

  const handleBack = () => {
    router.back();
  };
  return (
    <div className="p-5">
      <div className="bg-white rounded-lg py-4 w-full px-5 mt-4 mb-8 font-semibold text-lg">
        Dispute
      </div>
      <div className="flex items-center justify-between">
        <button onClick={handleBack}>
          <FaArrowLeft />
        </button>
        <TabSwitch
          setCurrentDisputeTab={setCurrentDisputeTab}
          currentDisputeTab={currentDisputeTab}
        />
        <div className="flex items-center justify-center gap-2 px-5 py-2 bg-white">
          Status
          {singleDispute?.data?.status !== "RESOLVED" ? (
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
      <div className="mt-5">
        <LoadScript
          googleMapsApiKey={`${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
          libraries={["places"]}
        >
          {currentDisputeTab === "information" ? <JobInformation /> : <Chat />}
        </LoadScript>
      </div>
    </div>
  );
};

export default SingleDispute;
