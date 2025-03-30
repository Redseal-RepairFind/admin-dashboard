"use client";
import React, { useState } from "react";
import ContractorMedia from "./ContractorMedia";
import CustomerMedia from "./CustomerMedia";
import SectionContainer from "./SectionContainer";

const JobMedia = ({ info }: { info: any }) => {
  const [currentTab, setCurrentTab] = useState("customer");
  // console.log(info?.contractorPreJobMedia, info?.contractorPostJobMedia);

  const types = [
    { id: 1, title: "Customer", slug: "customer" },
    { id: 2, title: "Contractor", slug: "contractor" },
  ];

  return (
    <SectionContainer title="Media">
      <div className="w-full mt-4 pb-4 border-t border-t-[#e7e6e6]">
        <div className="flex items-center justify-start mt-4 gap-3">
          {types.map((type: any, index: number) => (
            <button
              className={
                currentTab === type?.slug
                  ? "font-semibold underline"
                  : "text-gray-400"
              }
              onClick={() => setCurrentTab(type.slug)}
              key={index}
            >
              {type.title}
            </button>
          ))}
        </div>
        <div className="w-full mt-2">
          {currentTab === "customer" ? (
            <CustomerMedia
              data={{
                preMedia: info?.customerPreJobMedia,
                postMedia: info?.customerPostJobMedia,
              }}
            />
          ) : (
            <ContractorMedia
              data={{
                preMedia: info?.contractorPreJobMedia,
                postMedia: info?.contractorPostJobMedia,
              }}
            />
          )}
        </div>
      </div>
    </SectionContainer>
  );
};

export default JobMedia;
