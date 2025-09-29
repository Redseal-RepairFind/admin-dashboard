"use client";

import React from "react";
import useDisputes from "@/lib/hooks/useDisputes";

const TabSwitch = ({
  setCurrentDisputeTab,
  currentDisputeTab,
}: {
  setCurrentDisputeTab: any;
  currentDisputeTab: any;
}) => {
  const types = [
    { id: 1, title: "Job Information", slug: "information" },
    { id: 2, title: "Chat", slug: "chat" },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {types.map((type: any, index: number) => (
        <button
          className={
            currentDisputeTab === type?.slug
              ? "font-semibold underline"
              : "text-gray-400"
          }
          onClick={() => setCurrentDisputeTab(type.slug)}
          key={index}
        >
          {type.title}
        </button>
      ))}
    </div>
  );
};

export default TabSwitch;
