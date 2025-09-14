"use client";
import DownloadButton from "@/features/shared/page-body/download-button";
import React, { useState } from "react";
import StatCard from "./stat-card";

const categories = ["jobs", "revenue", "complains"];

const StatsCardContainer = () => {
  const [category, setcategory] = useState("jobs");
  return (
    <div className="bg-white rounded-md px-8 py-10 mt-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-x-8">
          {categories.map((item, index) => (
            <button
              key={index}
              type="button"
              className={`relative flex ${
                category === item ? "after:bg-[#333]" : "after:bg-[#ddd]"
              } text-[#333] font-[500] capitalize after:transition-all after:duration-300
          after:absolute after:-bottom-2 after:w-full after:h-[6px] after:rounded-xl`}
              onClick={() => setcategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <DownloadButton text="Download Report" />
      </div>

      <div className="mt-10 flex justify-between pr-[2.5vw] pb-3">
        <StatCard heading="MTD" subHeading="(Month-to-Date)" number="356" />
        <StatCard
          heading="MTDLY"
          subHeading="(Month-to-Date last year)"
          number="356"
        />
        <StatCard heading="YTD" subHeading="(Year-to-Date)" number="356" />
        <StatCard
          heading="YTDLY"
          subHeading="(Year-to-Date last year)"
          number="356"
        />
      </div>
    </div>
  );
};

export default StatsCardContainer;
