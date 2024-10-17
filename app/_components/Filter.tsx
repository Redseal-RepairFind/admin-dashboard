"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type FilterProp = {
  children?: React.ReactNode;
};

const filterProps = ["All", "Last 24h", "Last 7 days", "Last 30 days"];

function Filter({ children }: FilterProp) {
  const pathname = usePathname();
  const router = useRouter();
  const param = useSearchParams();

  // Derive sortValue directly from search params
  const initialString = param.get("sort");
  const sortValue = initialString ? initialString.replace(/_/g, " ") : "All";

  function updateUrlParams(value: string) {
    const params = new URLSearchParams(window.location.search);
    const formattedValue = value.replace(/ /g, "_").toLowerCase(); // Replace spaces with underscores
    params.set("sort", formattedValue); // Set 'sort' as key in query params

    if (value === "All") {
      router.replace(`${pathname}`); // Remove query params if 'All' is selected
    } else {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }
  }

  return (
    <select
      className="text-xs font-medium border border-gray-400 rounded-sm py-2 px-4 focus:ring-0 duration-200 outline-none"
      value={sortValue} // Set the current selected value
      onChange={(e) => updateUrlParams(e.target.value)} // Handle change
    >
      {filterProps.map((filterProp) => (
        <option key={filterProp} value={filterProp}>
          {filterProp}
        </option>
      ))}
    </select>
  );
}

export default Filter;
