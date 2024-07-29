"use client";
import React, { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import LineColumn from "./LineColumn";
import { convertDate } from "@/lib/utils/format-date";
import ContractorMedia from "./ContractorMedia";
import CustomerMedia from "./CustomerMedia";

const JobMedia = ({ info }: { info: any }) => {
  const [showData, setShowData] = useState(false);

  const [currentTab, setCurrentTab] = useState("customer");

  const handleToggle = () => setShowData(!showData);

  //   console.log(info);

  const types = [
    { id: 1, title: "Customer", slug: "customer" },
    { id: 2, title: "Contractor", slug: "contractor" },
  ];

  return (
    <div className="p-5 bg-white rounded-lg my-4">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold">Media</h1>
        <button onClick={handleToggle}>
          {showData ? <FaCaretUp /> : <FaCaretDown />}
        </button>
      </div>
      {showData && (
        <div className="w-full mt-4 border-t border-t-[#e7e6e6]">
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
      )}
    </div>
  );
};

export default JobMedia;
