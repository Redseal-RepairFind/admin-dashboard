"use client";
import React from "react";
import SectionContainer from "./SectionContainer";

const DisputeForm = ({ info }: { info: any }) => {
  return (
    <SectionContainer title="Dispute Form">
      <div className="w-full mt-4 pb-5">
        <div className="p-4 bg-gray-100 text-sm font-medium rounded-md">
          {info}
        </div>
      </div>
    </SectionContainer>
  );
};

export default DisputeForm;
